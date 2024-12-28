import { error } from 'console';
import * as Domain from './domain';
import { ActionFactory } from './domain/ActionFactory';
import { ActionDto } from './dto/action.dto';
import * as Persistence from './infra/persistence';
import { ActionDocument } from './infra/persistence/Action';

export class ActionMapper {
  static toDomain(document: ActionDocument): Domain.Action {
    const { id, status, title, description, causeId } = document;
    if ('type' in document) {
      if (document.type === 'economic') {
        return ActionFactory.createAction('economic', {
          id,
          status,
          title,
          description,
          causeId,
          targetAmount: document.targetAmount,
          currentAmount: document.currentAmount,
        });
      }
      if (document.type === 'food') {
        return ActionFactory.createAction('food', {
          id,
          status,
          title,
          description,
          causeId,
          foodType: document.foodType,
          quantity: document.quantity,
          unit: document.unit,
          collectedQuantity: document.collectedQuantity,
        });
      }
      if (document.type === 'volunteer') {
        return ActionFactory.createAction('volunteer', {
          id,
          status,
          title,
          description,
          causeId,
          targetVolunteers: document.targetVolunteers,
          currentVolunteers: document.currentVolunteers,
          location: document.location,
          date: document.date,
        });
      }
    }

    throw error(`Unknown action type: ${document.constructor.name}`);
  }

  static toPersistence(action: Domain.Action): Persistence.Action {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commonProps: any = {
      id: action.id.toString(),
      status: action.status,
      title: action.title,
      description: action.description,
      causeId: action.causeId,
    };

    if (action instanceof Domain.EconomicAction) {
      return {
        ...commonProps,
        type: 'economic',
        targetAmount: action.targetAmount,
        currentAmount: action.currentAmount,
      };
    }
    if (action instanceof Domain.FoodAction) {
      return {
        ...commonProps,
        type: 'food',
        foodType: action.foodType,
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
    if (action instanceof Domain.FoodAction) {
      return Object.assign(commonProps, {
        foodType: action.foodType,
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
