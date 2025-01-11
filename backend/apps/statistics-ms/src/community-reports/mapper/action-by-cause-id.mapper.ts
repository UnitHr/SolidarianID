import { Utils } from '@common-lib/common-lib/common/utils';
import { ActionReportResponseDto } from '../dto/action-report-response.dto';
import * as Persistence from '../infra/persistence';
import * as Domain from '../domain';

export class ActionByCauseIdMapper {
  static toDomain(raw: Persistence.ActionByCauseId): Domain.ActionByCauseId {
    return Domain.ActionByCauseId.create(
      raw.causeId,
      raw.actionId,
      raw.actionName,
      raw.target,
      raw.achieved,
    );
  }

  static toPersistence(
    entity: Domain.ActionByCauseId,
  ): Persistence.ActionByCauseId {
    return {
      causeId: entity.causeId,
      actionId: entity.actionId,
      actionName: entity.actionName,
      target: entity.target,
      achieved: entity.achieved,
    };
  }

  static toDto(entity: Domain.ActionByCauseId): ActionReportResponseDto {
    return {
      actionId: entity.actionId,
      actionName: entity.actionName,
      progress: Utils.calculateAverage(entity.achieved, entity.target),
    };
  }
}
