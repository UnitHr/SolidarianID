import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';
import { CreateCommunityRequestDto } from '../dto/create-community-request.dto';

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
        causeEndDate: new Date(raw.cause.end),
        causeOds: raw.cause.ods,
        status: raw.status,
        createdAt: raw.createdAt,
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
        end: entity.causeEndDate,
        ods: entity.causeOds,
      },
      status: entity.status,
      createdAt: entity.createdAt,
      comment: entity.comment,
    };
  }

  static toDto(
    entity: Domain.CreateCommunityRequest,
  ): CreateCommunityRequestDto {
    return {
      id: entity.id.toString(),
      userId: entity.userId,
      communityName: entity.communityName,
      communityDescription: entity.communityDescription,
      causeTitle: entity.causeTitle,
      causeDescription: entity.causeDescription,
      causeEndDate: entity.causeEndDate,
      causeOds: entity.causeOds,
      status: entity.status,
      createdAt: entity.createdAt,
      comment: entity.comment,
    };
  }
}
