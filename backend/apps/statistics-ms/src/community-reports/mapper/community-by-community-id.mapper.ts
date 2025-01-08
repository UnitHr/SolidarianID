import {
  mapODSEnumListToDetails,
  ODSEnum,
} from '@common-lib/common-lib/common/ods';
import { CommunityByCommunityIdResponseDto } from '../dto/community-report-response.dto';
import { CauseByCommunityIdMapper } from './cause-by-community-id.repository.mapper';
import * as Persistence from '../infra/persistence';
import * as Domain from '../domain';

export class CommunityByCommunityIdMapper {
  static toDomain(
    raw: Persistence.CommunityByCommunityId,
  ): Domain.CommunityByCommunityId {
    return Domain.CommunityByCommunityId.create(
      raw.communityId,
      raw.communityName,
      raw.adminId,
      raw.membersCount,
      new Set<ODSEnum>(raw.ods),
    );
  }

  static toPersistence(
    entity: Domain.CommunityByCommunityId,
  ): Persistence.CommunityByCommunityId {
    return {
      communityId: entity.communityId,
      communityName: entity.communityName,
      adminId: entity.adminId,
      membersCount: entity.membersCount,
      ods: new Set<number>(entity.ods),
    };
  }

  static toDto(
    entity: Domain.CommunityByCommunityId,
  ): CommunityByCommunityIdResponseDto {
    return {
      communityId: entity.communityId,
      communityName: entity.communityName,
      adminId: entity.adminId,
      members: entity.membersCount,
      ods: mapODSEnumListToDetails(Array.from(entity.ods)),
      causes: entity.causes.map(CauseByCommunityIdMapper.toDto),
    };
  }
}
