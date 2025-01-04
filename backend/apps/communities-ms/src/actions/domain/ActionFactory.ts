import { InvalidActionTypeError } from '../exceptions';
import { Action } from './Action';
import { ActionType } from './ActionType';
import { EconomicAction } from './EconomicAction';
import { GoodsCollectionAction } from './GoodsCollectionAction';
import { VolunteerAction } from './VolunteerAction';

export class ActionFactory {
  static createAction(
    type: ActionType,
    title,
    description,
    causeId,
    target,
    unit,
    goodType?,
    location?,
    date?,
  ): Action {
    const commonProps = { type, title, description, causeId, target, unit };
    switch (type) {
      case ActionType.ECONOMIC: {
        return EconomicAction.create({
          ...commonProps,
        });
      }
      case ActionType.GOODS_COLLECTION: {
        return GoodsCollectionAction.create({
          ...commonProps,
          goodType,
        });
      }
      case ActionType.VOLUNTEER: {
        return VolunteerAction.create({
          ...commonProps,
          location,
          date,
        });
      }
      default:
        throw new InvalidActionTypeError(type);
    }
  }
}
