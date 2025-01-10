import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { EventPublisher } from '@nestjs/cqrs';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CommunityRepository } from '../repo/community.repository';
import { JoinCommunityRequestRepository } from '../repo/join-community.repository';
import { StatusRequest } from '../domain/StatusRequest';
import { JoinCommunityQueryBuilder } from '../infra/filters/join-community-query.builder';

@Injectable()
export class JoinCommunityService {
  constructor(
    private readonly joinCommunityRequestRepository: JoinCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async joinCommunityRequest(
    userId: string,
    communityId: string,
  ): Promise<
    Either<
      | Exceptions.JoinCommunityRequestAlreadyExists
      | Exceptions.JoinCommunityRequestDenied
      | Exceptions.UserIsAlreadyMember
      | Exceptions.CommunityNotFound,
      Result<Domain.JoinCommunityRequest>
    >
  > {
    // Validate community exists
    const community = await this.communityRepository.findById(communityId);
    if (!community) {
      return left(Exceptions.CommunityNotFound.create(communityId));
    }

    // Check existing request status
    const existingRequest =
      await this.joinCommunityRequestRepository.findByUserIdAndCommunityId(
        userId,
        communityId,
      );

    if (existingRequest) {
      switch (existingRequest.status) {
        case StatusRequest.PENDING:
          return left(
            Exceptions.JoinCommunityRequestAlreadyExists.create(
              communityId,
              userId,
            ),
          );

        // Check if the user is already a member of the community
        case StatusRequest.APPROVED:
          return left(
            Exceptions.UserIsAlreadyMember.create(communityId, userId),
          );

        // Check if the user is not allowed to join the community
        case StatusRequest.DENIED:
          return left(
            Exceptions.JoinCommunityRequestDenied.create(communityId, userId),
          );
        default:
          break;
      }
    }

    // Create the new request
    const newRequest = this.eventPublisher.mergeObjectContext(
      Domain.JoinCommunityRequest.create({
        userId,
        communityId,
        status: StatusRequest.PENDING,
      }),
    );

    await this.joinCommunityRequestRepository.save(newRequest);
    newRequest.commit();

    // Return the request object
    return right(Result.ok(newRequest));
  }

  async getJoinCommunityRequests(
    communityId: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<{ data: Domain.JoinCommunityRequest[]; total: number }> {
    const queryBuilder = new JoinCommunityQueryBuilder().addPagination(
      page,
      limit,
    );

    const pagination = queryBuilder.buildPagination();

    const [data, total] = await Promise.all([
      this.joinCommunityRequestRepository.findAll(communityId, pagination), // Get paginated data
      this.joinCommunityRequestRepository.countDocuments(communityId), // Count total documents
    ]);

    // Return the requests
    return { data, total };
  }

  async getJoinCommunityRequest(
    id: string,
  ): Promise<
    Either<
      Exceptions.JoinCommunityRequestNotFound,
      Result<Domain.JoinCommunityRequest>
    >
  > {
    const joinCommunityRequest =
      await this.joinCommunityRequestRepository.findById(id);

    if (!joinCommunityRequest) {
      return left(Exceptions.JoinCommunityRequestNotFound.create(id));
    }

    return right(Result.ok(joinCommunityRequest));
  }

  async validateJoinCommunityRequest(
    requestId: string,
    status: string,
    comment?: string,
  ): Promise<
    Either<
      Exceptions.JoinCommunityRequestNotFound | Exceptions.CommentIsMandatory,
      Result<void>
    >
  > {
    // Find the join request
    const request =
      await this.joinCommunityRequestRepository.findById(requestId);
    if (!request) {
      return left(Exceptions.JoinCommunityRequestNotFound.create(requestId));
    }

    // Find the associated community
    const community = await this.communityRepository.findById(
      request.communityId,
    );
    if (!community) {
      return left(Exceptions.CommunityNotFound.create(request.communityId));
    }

    // Merge request with event publisher
    const joinCommunityRequest =
      this.eventPublisher.mergeObjectContext(request);

    switch (status) {
      case StatusRequest.APPROVED: {
        // Update request status and add member to community
        joinCommunityRequest.status = StatusRequest.APPROVED;

        const updatedCommunity =
          this.eventPublisher.mergeObjectContext(community);
        updatedCommunity.addMember(joinCommunityRequest.userId);

        // Save both request and community
        await Promise.all([
          this.joinCommunityRequestRepository.save(joinCommunityRequest),
          this.communityRepository.save(updatedCommunity),
        ]);

        updatedCommunity.commit();
        break;
      }

      case StatusRequest.DENIED: {
        if (!comment) {
          return left(Exceptions.CommentIsMandatory.create());
        }

        // Update request status and add denial comment
        joinCommunityRequest.status = StatusRequest.DENIED;
        joinCommunityRequest.comment = comment;

        // Save updated request
        await this.joinCommunityRequestRepository.save(joinCommunityRequest);
        joinCommunityRequest.commit();
        break;
      }

      default:
        break;
    }

    return right(Result.ok<void>());
  }

  async isCommunityAdmin(
    userId: string,
    communityId: string,
  ): Promise<boolean> {
    return this.communityRepository.isCommunityAdmin(userId, communityId);
  }
}
