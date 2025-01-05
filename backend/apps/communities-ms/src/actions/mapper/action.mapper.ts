import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';
import { ActionDto } from '../dto/action.dto';
import { ContributionMapper } from './contribution.mapper';
import { InvalidActionTypeError } from '../exceptions';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';

export class ActionMapper {
  static toDomain(document: Persistence.Action): Domain.Action {
    const {
      status,
      title,
      description,
      causeId,
      type,
      target,
      unit,
      achieved,
      createdBy,
      createdAt,
      updatedAt,
    } = document;

    const mappedContributions = document.contributions
      ? document.contributions.map(ContributionMapper.toDomain)
      : undefined;

    const commonProps = {
      status,
      title,
      description,
      causeId,
      type,
      contributions: mappedContributions,
      target,
      unit,
      achieved,
      createdBy,
      createdAt,
      updatedAt,
    };

    const id = new UniqueEntityID(document.id);

    if (document.type === Domain.ActionType.ECONOMIC) {
      return Domain.EconomicAction.create(
        {
          ...commonProps,
        },
        id,
      );
    }
    if (document.type === Domain.ActionType.GOODS_COLLECTION) {
      return Domain.GoodsCollectionAction.create(
        {
          ...commonProps,
          goodType: document.goodType,
        },
        id,
      );
    }
    if (document.type === Domain.ActionType.VOLUNTEER) {
      return Domain.VolunteerAction.create(
        {
          ...commonProps,
          location: document.location,
          date: document.date,
        },
        id,
      );
    }

    throw new InvalidActionTypeError(document.type);
  }

  static toPersistence(action: Domain.Action): Persistence.Action {
    const mappedContributions = action.contributions
      ? action.contributions.map(ContributionMapper.toPersistence)
      : undefined;

    const commonProps = {
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
      createdBy: action.createdBy,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
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

    throw new InvalidActionTypeError(action.type);
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
    throw new InvalidActionTypeError(action.type);
  }
}
