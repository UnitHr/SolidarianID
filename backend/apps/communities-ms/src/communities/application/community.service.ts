import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CommunityRepository } from '../repo/community.repository';
import { Status } from '../domain/Status';
import { Ods } from '../domain/Ods';

@Injectable()
export class CommunityService {
  constructor(
    private readonly createCommunityRequestRepository: CreateCommunityRequestRepository,
    private readonly communityRepository: CommunityRepository,
  ) {}

  async getCommunity(
    id: string,
  ): Promise<Either<Exceptions.CommunityNotFound, Result<Domain.Community>>> {
    const community = await this.communityRepository.findById(id);

    if (!!community === false) {
      return left(Exceptions.CommunityNotFound.create(id));
    }

    return right(Result.ok(community));
  }

  async createCommunityRequest(createCommunityRequest: {
    userId: string;
    communityName: string;
    communityDescription: string;
    causeTitle: string;
    causeDescription: string;
    causeEndDate: Date;
    causeOds: Ods[];
  }): Promise<
    Either<
      Exceptions.CommunityNameIsTaken,
      Result<Domain.CreateCommunityRequest>
    >
  > {
    const causeEndOrError = Domain.CauseEndDate.create(
      createCommunityRequest.causeEndDate,
    );

    // If the cause end date is invalid, return the error
    if (causeEndOrError.isFailure) {
      return right(Result.fail(causeEndOrError.errorValue()));
    }

    // Check if the community name is already taken
    const communityNameIsTaken = await this.communityRepository.findByName(
      createCommunityRequest.communityName,
    );

    if (!!communityNameIsTaken === true) {
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
        causeEndDate: causeEndOrError.getValue(),
        causeOds: createCommunityRequest.causeOds,
        status: Status.Pending,
      }),
    );
    console.log(newRequest);
    // Return the request object
    return right(Result.ok(newRequest));
  }
}
