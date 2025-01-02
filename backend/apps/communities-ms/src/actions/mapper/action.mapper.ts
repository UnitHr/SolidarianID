import { error } from 'console';
import * as Domain from '../domain';
import { ActionType } from '../domain/ActionType';
import { ActionDto } from '../dto/action.dto';
import * as Persistence from '../infra/persistence';
import { ContributionMapper } from './contribution.mapper';

export class ActionMapper {
  static toDomain(document: Persistence.Action): Domain.Action {
    const {
      id,
      status,
      title,
      description,
      causeId,
      type,
      target,
      unit,
      achieved,
    } = document;

    const mappedContributions = document.contributions
      ? document.contributions.map(ContributionMapper.toDomain)
      : undefined;

    const commonProps = {
      id,
      status,
      title,
      description,
      causeId,
      type,
      contributions: mappedContributions,
      target,
      unit,
      achieved,
    };

    if (document.type === ActionType.ECONOMIC) {
      return Domain.EconomicAction.create(
        {
          ...commonProps,
        },
        id,
      );
    }
    if (document.type === ActionType.GOODS_COLLECTION) {
      return Domain.GoodsCollectionAction.create(
        {
          ...commonProps,
          goodType: document.goodType,
        },
        id,
      );
    }
    if (document.type === ActionType.VOLUNTEER) {
      return Domain.VolunteerAction.create(
        {
          ...commonProps,
          location: document.location,
          date: document.date,
        },
        id,
      );
    }
    // TODO: return something (lint)
    throw error(`Unknown action type: ${document.type}`);
  }

  static toPersistence(action: Domain.Action): Persistence.Action {
    const mappedContributions = action.contributions
      ? action.contributions.map(ContributionMapper.toPersistence)
      : undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commonProps: any = {
      id: action.id.toString(),
      status: action.status,
      title: action.title,
      description: action.description,
      causeId: action.causeId,
      type: action.type,
      contributions: mappedContributions,
      target: action.target,
      unit: action.unit,
      achieved: action.achieved,
    };

    if (action instanceof Domain.EconomicAction) {
      return {
        ...commonProps,
      };
    }
    if (action instanceof Domain.GoodsCollectionAction) {
      return {
        ...commonProps,
        goodType: action.goodType,
      };
    }
    if (action instanceof Domain.VolunteerAction) {
      return {
        ...commonProps,
        location: action.location,
        date: action.date,
      };
    }

    throw error(`Unknown action type: ${action.constructor.name}`);
  }

  static toDTO(action: Domain.Action): ActionDto {
    const commonProps: ActionDto = {
      id: action.id.toString(),
      status: action.status.toString(),
      type: action.type,
      title: action.title,
      description: action.description,
      causeId: action.causeId,
      target: action.target,
      unit: action.unit,
      achieved: action.achieved,
    };
    if (action instanceof Domain.EconomicAction) {
      return Object.assign(commonProps);
    }
    if (action instanceof Domain.GoodsCollectionAction) {
      return Object.assign(commonProps, {
        goodType: action.goodType,
      });
    }
    if (action instanceof Domain.VolunteerAction) {
      return Object.assign(commonProps, {
        location: action.location,
        date: action.date,
      });
    }
    throw new Error(`Unknown domain action type: ${action.constructor.name}`);
  }
}
