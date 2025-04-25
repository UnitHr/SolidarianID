import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { CauseService } from '@communities-ms/causes/application/cause.service';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CommunityRepository } from '../repo/community.repository';
import { StatusRequest } from '../domain/StatusRequest';
import { CommunityQueryBuilder } from '../infra/filters/community-query.builder';
import { CommunityService } from './community.service';

@Injectable()
export class CommunityServiceImpl implements CommunityService {
  constructor(
    private readonly createCommunityRequestRepository: CreateCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly causeService: CauseService,
  ) {}

  async getCommunity(
    id: string,
  ): Promise<Either<Exceptions.CommunityNotFound, Result<Domain.Community>>> {
    const community = await this.communityRepository.findById(id);

    if (!community) {
      return left(Exceptions.CommunityNotFound.create(id));
    }

    return right(Result.ok(community));
  }

  async getCommunityMembers(
    id: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<
    Either<Exceptions.CommunityNotFound, { data: string[]; total: number }>
  > {
    const community = await this.communityRepository.findById(id);

    if (!community) {
      return left(Exceptions.CommunityNotFound.create(id));
    }

    // Validate page and limit
    const validatedPage = Math.max(page, 1);
    const validatedLimit = Math.max(limit, 1);

    const total = community.members.length;
    const skip = (validatedPage - 1) * validatedLimit;
    const data = community.members.slice(skip, skip + validatedLimit);

    return right({ data, total });
  }

  async getCommunityCauses(
    id: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<
    Either<Exceptions.CommunityNotFound, { data: string[]; total: number }>
  > {
    const community = await this.communityRepository.findById(id);

    if (!community) {
      return left(Exceptions.CommunityNotFound.create(id));
    }

    // Validate page and limit
    const validatedPage = Math.max(page, 1);
    const validatedLimit = Math.max(limit, 1);

    const total = community.causes.length;
    const skip = (validatedPage - 1) * validatedLimit;
    const data = community.causes.slice(skip, skip + validatedLimit);

    return right({ data, total });
  }

  async getManagedCommunities(
    userId: string,
  ): Promise<
    Either<Exceptions.UserDoNotManageCommunities, Result<Domain.Community[]>>
  > {
    const communities = await this.communityRepository.findByAdminId(userId);

    if (!communities) {
      return left(Exceptions.UserDoNotManageCommunities.create());
    }

    return right(Result.ok(communities));
  }

  async getCommunities(
    name?: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{ data: Domain.Community[]; total: number }> {
    const queryBuilder = new CommunityQueryBuilder()
      .addNameFilter(name)
      .addPagination(page, limit);

    const filters = queryBuilder.buildFilter();
    const pagination = queryBuilder.buildPagination();

    // Use Promise.all to execute both queries in parallel
    const [data, total] = await Promise.all([
      this.communityRepository.findAll(filters, pagination), // Get paginated data
      this.communityRepository.countDocuments(filters), // Count total documents
    ]);

    return { data, total };
  }

  async createCommunityRequest(createCommunityRequest: {
    userId: string;
    communityName: string;
    communityDescription: string;
    causeTitle: string;
    causeDescription: string;
    causeEndDate: Date;
    causeOds: ODSEnum[];
  }): Promise<
    Either<
      Exceptions.CommunityNameIsTaken,
      Result<Domain.CreateCommunityRequest>
    >
  > {
    const isValidEndDate = this.causeService.validateCauseEndDate(
      createCommunityRequest.causeEndDate,
    );

    if (!isValidEndDate) {
      return left(
        Exceptions.InvalidDateProvided.create(
          createCommunityRequest.causeEndDate,
        ),
      );
    }

    // Check if the community name is already taken
    const existingCommunity = await this.communityRepository.findByName(
      createCommunityRequest.communityName,
    );

    if (existingCommunity) {
      return left(
        Exceptions.CommunityNameIsTaken.create(
          createCommunityRequest.communityName,
        ),
      );
    }

    // Create the new request
    const newRequest = await this.createCommunityRequestRepository.save(
      Domain.CreateCommunityRequest.create({
        userId: createCommunityRequest.userId,
        communityName: createCommunityRequest.communityName,
        communityDescription: createCommunityRequest.communityDescription,
        causeTitle: createCommunityRequest.causeTitle,
        causeDescription: createCommunityRequest.causeDescription,
        causeEndDate: createCommunityRequest.causeEndDate,
        causeOds: createCommunityRequest.causeOds,
        status: StatusRequest.PENDING,
        createdAt: new Date(),
      }),
    );

    // Return the request object
    return right(Result.ok(newRequest));
  }

  async createCommunityCause(
    title: string,
    description: string,
    ods: ODSEnum[],
    endDate: Date,
    communityId: string,
    createdBy: string,
  ): Promise<Either<Exceptions.CommunityNotFound, Result<string>>> {
    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      return left(Exceptions.CommunityNotFound.create(communityId));
    }

    const causeId = await this.causeService.createCause(
      title,
      description,
      ods,
      endDate,
      communityId,
      createdBy,
    );

    community.addCause(causeId);
    await this.communityRepository.save(community);

    return right(Result.ok(causeId));
  }
}
