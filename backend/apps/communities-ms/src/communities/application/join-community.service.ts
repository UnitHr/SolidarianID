import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CommunityRepository } from '../repo/community.repository';
import { JoinCommunityRequestRepository } from '../repo/join-community.repository';
import { StatusRequest } from '../domain/StatusRequest';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { JoinCommunityQueryBuilder } from '../infra/filters/join-community-query.builder';

@Injectable()
export class JoinCommunityService {
  constructor(
    private readonly joinCommunityRequestRepository: JoinCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
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
    // Check if the communityId is valid
    const community = await this.communityRepository.findById(communityId);

    if (!!community === false) {
      return left(Exceptions.CommunityNotFound.create(communityId));
    }

    // Check if the request already exists
    const joinCommunityRequestAlreadyExists =
      await this.joinCommunityRequestRepository.findByUserIdAndCommunityId(
        userId,
        communityId,
      );

    if (!!joinCommunityRequestAlreadyExists === true) {
      switch (joinCommunityRequestAlreadyExists.status) {
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
    const newRequest = Domain.JoinCommunityRequest.create({
      userId,
      communityId,
      status: StatusRequest.PENDING,
    });
    this.joinCommunityRequestRepository.save(newRequest);

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

    if (!!joinCommunityRequest === false) {
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
    // Check if the request exists
    const joinCommunityRequest =
      await this.joinCommunityRequestRepository.findById(requestId);

    if (!!joinCommunityRequest === false) {
      return left(Exceptions.JoinCommunityRequestNotFound.create(requestId));
    }

    switch (status) {
      case StatusRequest.APPROVED:
        // Update the request
        joinCommunityRequest.status = StatusRequest.APPROVED;

        // Save the request
        this.joinCommunityRequestRepository.save(joinCommunityRequest);

        // Send the "joined_community" event

        break;

      case StatusRequest.DENIED:
        if (comment) {
          // Update the request
          joinCommunityRequest.status = StatusRequest.DENIED;
          joinCommunityRequest.comment = comment;

          // Save the request
          this.joinCommunityRequestRepository.save(joinCommunityRequest);
        } else {
          return left(Exceptions.CommentIsMandatory.create());
        }

        break;

      default:
        break;
    }

    return right(Result.ok<void>());
  }

  async isCommunityAdmin(
    userId: string,
    communityId: string,
  ): Promise<boolean> {
    const result = await this.communityRepository.isCommunityAdmin(
      userId,
      communityId,
    );

    return result;
  }
}
