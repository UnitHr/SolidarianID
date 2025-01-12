import { Either } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import * as Domain from '../domain';
import * as Exceptions from '../exceptions';

export abstract class CommunityService {
  abstract getCommunity(
    id: string,
  ): Promise<Either<Exceptions.CommunityNotFound, Result<Domain.Community>>>;

  abstract getCommunityMembers(
    id: string,
    page?: number,
    limit?: number,
  ): Promise<
    Either<Exceptions.CommunityNotFound, { data: string[]; total: number }>
  >;

  abstract getCommunityCauses(
    id: string,
    page?: number,
    limit?: number,
  ): Promise<
    Either<Exceptions.CommunityNotFound, { data: string[]; total: number }>
  >;

  abstract getCommunities(
    name?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Domain.Community[]; total: number }>;

  abstract createCommunityRequest(createCommunityRequest: {
    userId: string;
    communityName: string;
    communityDescription: string;
    causeTitle: string;
    causeDescription: string;
    causeEndDate: Date;
    causeOds: ODSEnum[];
  }): Promise<
    Either<
      Exceptions.CommunityNameIsTaken | Exceptions.InvalidDateProvided,
      Result<Domain.CreateCommunityRequest>
    >
  >;

  abstract createCommunityCause(
    title: string,
    description: string,
    ods: ODSEnum[],
    endDate: Date,
    communityId: string,
    createdBy: string,
  ): Promise<Either<Exceptions.CommunityNotFound, Result<string>>>;
}
