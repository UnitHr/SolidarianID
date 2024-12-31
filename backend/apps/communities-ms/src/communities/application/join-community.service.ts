import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CommunityRepository } from '../repo/community.repository';
import { JoinCommunityRequestRepository } from '../repo/join-community.repository';
import { StatusRequest } from '../domain/StatusRequest';

@Injectable()
export class JoinCommunityService {
  constructor(
    private readonly joinCommunityRequestRepository: JoinCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  async joinCommunityRequest(joinCommunityRequest: {
    userId: string;
    communityId: string;
  }): Promise<
    Either<
      | Exceptions.JoinCommunityRequestAlreadyExists
      | Exceptions.JoinCommunityRequestDenied
      | Exceptions.UserIsAlreadyMember
      | Exceptions.CommunityNotFound,
      Result<Domain.JoinCommunityRequest>
    >
  > {
    // Check if the communityId is valid
    const community = await this.communityRepository.findById(
      joinCommunityRequest.communityId,
    );

    if (!!community === false) {
      return left(
        Exceptions.CommunityNotFound.create(joinCommunityRequest.communityId),
      );
    }

    // Check if the request already exists
    const joinCommunityRequestAlreadyExists =
      await this.joinCommunityRequestRepository.findByUserIdAndCommunityId(
        joinCommunityRequest.userId,
        joinCommunityRequest.communityId,
      );

    if (!!joinCommunityRequestAlreadyExists === true) {
      switch (joinCommunityRequestAlreadyExists.status) {
        case StatusRequest.Pending:
          return left(
            Exceptions.JoinCommunityRequestAlreadyExists.create(
              joinCommunityRequest.communityId,
              joinCommunityRequest.userId,
            ),
          );

        // Check if the user is already a member of the community
        case StatusRequest.Approved:
          return left(
            Exceptions.UserIsAlreadyMember.create(
              joinCommunityRequest.communityId,
              joinCommunityRequest.userId,
            ),
          );

        // Check if the user is not allowed to join the community
        case StatusRequest.Denied:
          return left(
            Exceptions.JoinCommunityRequestDenied.create(
              joinCommunityRequest.communityId,
              joinCommunityRequest.userId,
            ),
          );
        default:
          break;
      }
    }

    // Create the new request
    const newRequest = Domain.JoinCommunityRequest.create({
      userId: joinCommunityRequest.userId,
      communityId: joinCommunityRequest.communityId,
      status: StatusRequest.Pending,
    });
    this.joinCommunityRequestRepository.save(newRequest);

    // Return the request object
    return right(Result.ok(newRequest));
  }

  async getJoinCommunityRequests(
    offset: number,
    limit: number,
  ): Promise<Result<Domain.JoinCommunityRequest[]>> {
    // Get all the requests
    const joinCommunityRequests =
      await this.joinCommunityRequestRepository.findAll(offset, limit);

    // Return the requests
    return Result.ok(joinCommunityRequests);
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
      case StatusRequest.Approved:
        // Update the request
        joinCommunityRequest.status = StatusRequest.Approved;

        // Save the request
        this.joinCommunityRequestRepository.save(joinCommunityRequest);

        // Send the "joined_community" event

        break;

      case StatusRequest.Denied:
        if (comment) {
          // Update the request
          joinCommunityRequest.status = StatusRequest.Denied;
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
}
