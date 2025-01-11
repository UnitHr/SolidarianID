import {
  mapNumberArrayToODSEnumSet,
  mapODSEnumSetToNumberArray,
  mapODSEnumListToDetails,
} from '@common-lib/common-lib/common/ods';
import { CauseReportResponseDto } from '../dto/cause-report-response.dto';
import * as Persistence from '../infra/persistence';
import * as Domain from '../domain';
import { ActionByCauseIdMapper } from './action-by-cause-id.mapper';

export class CauseByCommunityIdMapper {
  static toDomain(
    raw: Persistence.CauseByCommunityId,
  ): Domain.CauseByCommunityId {
    return Domain.CauseByCommunityId.create(
      raw.communityId,
      raw.causeId,
      raw.causeName,
      mapNumberArrayToODSEnumSet(raw.ods),
      raw.supportsCount,
    );
  }

  static toPersistence(
    entity: Domain.CauseByCommunityId,
  ): Persistence.CauseByCommunityId {
    return {
      communityId: entity.communityId,
      causeId: entity.causeId,
      causeName: entity.causeName,
      ods: mapODSEnumSetToNumberArray(entity.ods),
      supportsCount: entity.supportsCount,
    };
  }

  static toDto(entity: Domain.CauseByCommunityId): CauseReportResponseDto {
    return {
      causeId: entity.causeId,
      causeName: entity.causeName,
      supports: entity.supportsCount,
      ods: mapODSEnumListToDetails(Array.from(entity.ods)),
      actions: entity.actions.map(ActionByCauseIdMapper.toDto),
    };
  }
}
