import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { CauseEndDate } from '@communities-ms/causes/domain/CauseEndDate';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';

export class CreateCommunityRequestMapper {
  static toDomain(
    raw: Persistence.CreateCommunityRequest,
  ): Domain.CreateCommunityRequest {
    return Domain.CreateCommunityRequest.create(
      {
        userId: raw.userId,
        communityName: raw.id,
        communityDescription: raw.description,
        causeTitle: raw.cause.title,
        causeDescription: raw.cause.description,
        causeEndDate: CauseEndDate.create(raw.cause.end).getValue(),
        causeOds: raw.cause.ods,
        status: raw.status,
        comment: raw.comment,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    entity: Domain.CreateCommunityRequest,
  ): Persistence.CreateCommunityRequest {
    return {
      id: entity.id.toString(),
      userId: entity.userId,
      name: entity.communityName,
      description: entity.communityDescription,
      cause: {
        title: entity.causeTitle,
        description: entity.causeDescription,
        end: entity.causeEndDate.value,
        ods: entity.causeOds,
      },
      status: entity.status,
      comment: entity.comment,
    };
  }
}
