import { ActionReportResponseDto } from '../dto/action-report-response.dto';
import { Utils } from '@common-lib/common-lib/common/utils';
import * as Persistence from '../infra/persistence';
import * as Domain from '../domain';

export class ActionByCommunityIdMapper {
  static toDomain(
    raw: Persistence.ActionByCommunityId,
  ): Domain.ActionByCommunityId {
    return Domain.ActionByCommunityId.create(
      raw.communityId,
      raw.causeId,
      raw.actionId,
      raw.actionName,
      raw.target,
      raw.achieved,
    );
  }

  static toPersistence(
    entity: Domain.ActionByCommunityId,
  ): Persistence.ActionByCommunityId {
    return {
      communityId: entity.communityId,
      causeId: entity.causeId,
      actionId: entity.actionId,
      actionName: entity.actionName,
      target: entity.target,
      achieved: entity.achieved,
    };
  }

  static toDto(entity: Domain.ActionByCommunityId): ActionReportResponseDto {
    return {
      actionId: entity.actionId,
      actionName: entity.actionName,
      progress: Utils.calculateAverage(entity.achieved, entity.target),
    };
  }
}
