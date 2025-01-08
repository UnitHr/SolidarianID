import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';
import { JoinCommunityRequestDto } from '../dto/join-community-request.dto';

export class JoinCommunityRequestMapper {
  static toDomain(
    raw: Persistence.JoinCommunityRequest,
  ): Domain.JoinCommunityRequest {
    return Domain.JoinCommunityRequest.create(
      {
        userId: raw.userId,
        communityId: raw.communityId,
        status: raw.status,
        comment: raw.comment,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    entity: Domain.JoinCommunityRequest,
  ): Persistence.JoinCommunityRequest {
    return {
      id: entity.id.toString(),
      userId: entity.userId,
      communityId: entity.communityId,
      status: entity.status,
      comment: entity.comment,
    };
  }

  static toDto(entity: Domain.JoinCommunityRequest): JoinCommunityRequestDto {
    return {
      id: entity.id.toString(),
      userId: entity.userId,
      communityId: entity.communityId,
      status: entity.status,
      comment: entity.comment,
    };
  }
}
