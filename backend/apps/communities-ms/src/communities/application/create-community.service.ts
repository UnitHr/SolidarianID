import { Injectable } from '@nestjs/common';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import { CauseService } from '@communities-ms/causes/application/cause.service';
import {
  CreateCommunitySortBy,
  PaginationDefaults,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { EventPublisher } from '@nestjs/cqrs';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CommunityRepository } from '../repo/community.repository';
import { StatusRequest } from '../domain/StatusRequest';
import { CreateCommunityQueryBuilder } from '../infra/filters/create-community-query.builder';

@Injectable()
export class CreateCommunityService {
  constructor(
    private readonly createCommunityRequestRepository: CreateCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly causeService: CauseService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async getCreateCommunityRequests(
    createdAtFilter?: Date,
    statusFilter?: StatusRequest,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{ data: Domain.CreateCommunityRequest[]; total: number }> {
    const queryBuilder = new CreateCommunityQueryBuilder()
      .addStatusFilter(statusFilter)
      .addCreatedAtFilter(createdAtFilter)
      .addStatusFilter(statusFilter)
      .addSort(CreateCommunitySortBy.CREATED_AT, SortDirection.DESC)
      .addPagination(page, limit);

    const filters = queryBuilder.buildFilter();
    const sort = queryBuilder.buildSort();
    const pagination = queryBuilder.buildPagination();

    // Use Promise.all to execute both queries in parallel
    const [data, total] = await Promise.all([
      this.createCommunityRequestRepository.findAll(filters, sort, pagination), // Get paginated data
      this.createCommunityRequestRepository.countDocuments(filters), // Count total documents
    ]);

    return {
      data,
      total,
    };
  }

  async getCreateCommunityRequest(
    id: string,
  ): Promise<
    Either<
      Exceptions.CreateCommunityRequestNotFound,
      Result<Domain.CreateCommunityRequest>
    >
  > {
    const createCommunityRequest =
      await this.createCommunityRequestRepository.findById(id);

    if (!!createCommunityRequest === false) {
      return left(Exceptions.CreateCommunityRequestNotFound.create(id));
    }

    return right(Result.ok(createCommunityRequest));
  }

  async validateCreateCommunityRequest(
    requestId: string,
    status: string,
    comment?: string,
  ): Promise<
    Either<
      Exceptions.CreateCommunityRequestNotFound | Exceptions.CommentIsMandatory,
      Result<Domain.Community> | Result<void>
    >
  > {
    // Find the request
    const createCommunityRequest =
      await this.createCommunityRequestRepository.findById(requestId);

    if (!!createCommunityRequest === false) {
      return left(Exceptions.CreateCommunityRequestNotFound.create(requestId));
    }

    switch (status) {
      case StatusRequest.APPROVED: {
        // Update the request
        createCommunityRequest.status = StatusRequest.APPROVED;

        // Save the request
        this.createCommunityRequestRepository.save(createCommunityRequest);

        // Create the community
        const newCommunity = this.eventPublisher.mergeObjectContext(
          Domain.Community.create({
            adminId: createCommunityRequest.userId,
            name: createCommunityRequest.communityName,
            description: createCommunityRequest.communityDescription,
            members: [],
            causes: [],
          }),
        );

        // Create the cause
        const causeId = await this.causeService.createCause(
          createCommunityRequest.causeTitle,
          createCommunityRequest.causeDescription,
          createCommunityRequest.causeOds,
          createCommunityRequest.causeEndDate,
          newCommunity.id.toString(),
          createCommunityRequest.userId,
        );

        // Add the cause to the community
        newCommunity.addCause(causeId);

        // Save the community
        this.communityRepository.save(newCommunity);

        newCommunity.commit();
        // Return the community object
        return right(Result.ok(newCommunity));
      }

      case StatusRequest.DENIED:
        if (comment) {
          // Update the request
          createCommunityRequest.status = StatusRequest.DENIED;
          createCommunityRequest.comment = comment;

          // Save the request
          this.createCommunityRequestRepository.save(createCommunityRequest);
        } else {
          return left(Exceptions.CommentIsMandatory.create());
        }

        return right(Result.ok<void>());

      default:
        break;
    }

    return right(Result.ok<void>());
  }
}
