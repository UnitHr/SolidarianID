import { error } from 'console';
import * as Domain from '../domain';
import { ActionDto } from '../dto/action.dto';
import * as Persistence from '../infra/persistence';
import { ContributionMapper } from './contribution.mapper';

export class ActionMapper {
  static toDomain(document: Persistence.Action): Domain.Action {
    const { id, status, title, description, causeId } = document;

    const mappedContributions = document.contributions
      ? document.contributions.map(ContributionMapper.toDomain)
      : undefined;

    const commonProps = {
      id,
      status,
      title,
      description,
      causeId,
      contributions: mappedContributions,
    };

    if (document.type === 'economic') {
      return Domain.EconomicAction.create(
        {
          ...commonProps,
          targetAmount: document.targetAmount,
          currentAmount: document.currentAmount,
        },
        id,
      );
    }
    if (document.type === 'goodsCollection') {
      return Domain.GoodsCollectionAction.create(
        {
          ...commonProps,
          goodType: document.goodType,
          quantity: document.quantity,
          unit: document.unit,
          collectedQuantity: document.collectedQuantity,
        },
        id,
      );
    }
    if (document.type === 'volunteer') {
      return Domain.VolunteerAction.create(
        {
          ...commonProps,
          targetVolunteers: document.targetVolunteers,
          location: document.location,
          currentVolunteers: document.currentVolunteers,
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
      contributions: mappedContributions,
    };

    if (action instanceof Domain.EconomicAction) {
      return {
        ...commonProps,
        type: 'economic',
        targetAmount: action.targetAmount,
        currentAmount: action.currentAmount,
      };
    }
    if (action instanceof Domain.GoodsCollectionAction) {
      return {
        ...commonProps,
        type: 'goodsCollection',
        goodType: action.goodType,
        quantity: action.quantity,
        unit: action.unit,
        collectedQuantity: action.collectedQuantity,
      };
    }
    if (action instanceof Domain.VolunteerAction) {
      return {
        ...commonProps,
        type: 'volunteer',
        targetVolunteers: action.targetVolunteers,
        currentVolunteers: action.currentVolunteers,
        location: action.location,
        date: action.date,
      };
    }

    throw error(`Unknown action type: ${action.constructor.name}`);
  }

  static toDTO(action: Domain.Action): ActionDto {
    const commonProps: ActionDto = {
      id: action.id.toString(),
      status: action.status,
      type: action.getType(),
      title: action.title,
      description: action.description,
      causeId: action.causeId,
    };
    if (action instanceof Domain.EconomicAction) {
      return Object.assign(commonProps, {
        targetAmount: action.targetAmount,
        currentAmount: action.currentAmount,
      });
    }
    if (action instanceof Domain.GoodsCollectionAction) {
      return Object.assign(commonProps, {
        goodType: action.goodType,
        quantity: action.quantity,
        unit: action.unit,
        collectedQuantity: action.collectedQuantity,
      });
    }
    if (action instanceof Domain.VolunteerAction) {
      return Object.assign(commonProps, {
        targetVolunteers: action.targetVolunteers,
        currentVolunteers: action.currentVolunteers,
        location: action.location,
        date: action.date,
      });
    }
    throw new Error(`Unknown domain action type: ${action.constructor.name}`);
  }
}
