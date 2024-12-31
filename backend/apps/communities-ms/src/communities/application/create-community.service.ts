import { Injectable } from '@nestjs/common';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CommunityRepository } from '../repo/community.repository';
import { StatusRequest } from '../domain/StatusRequest';

@Injectable()
export class CreateCommunityService {
  constructor(
    private readonly createCommunityRequestRepository: CreateCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  async getCreateCommunityRequests(
    offset: number,
    limit: number,
  ): Promise<Result<Domain.CreateCommunityRequest[]>> {
    // Get all the requests
    const createCommunityRequests =
      await this.createCommunityRequestRepository.findAll(offset, limit);

    // Return the requests
    return Result.ok(createCommunityRequests);
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
      case StatusRequest.Approved: {
        // Update the request
        createCommunityRequest.status = StatusRequest.Approved;

        // Save the request
        this.createCommunityRequestRepository.save(createCommunityRequest);

        // Create the community
        const newCommunity = Domain.Community.create({
          adminId: createCommunityRequest.userId,
          name: createCommunityRequest.communityName,
          description: createCommunityRequest.communityDescription,
          members: [],
          causes: [],
        });
        this.communityRepository.save(newCommunity);

        // Send the "created_community" event

        // Return the community object
        return right(Result.ok(newCommunity));
      }

      case StatusRequest.Denied:
        if (comment) {
          // Update the request
          createCommunityRequest.status = StatusRequest.Denied;
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
