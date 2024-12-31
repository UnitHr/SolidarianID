/* import { Action } from './Action';
import { EconomicAction, EconomicActionProps } from './EconomicAction';
import { FoodAction, FoodActionProps } from './FoodAction';
import { VolunteerAction, VolunteerActionProps } from './VolunteerAction';

// TODO: Avoid using any when the DDD is implemented
export class ActionFactory {
  static createAction(
    type: 'economic' | 'food' | 'volunteer',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any,
  ): Action {
    switch (type) {
      case 'economic': {
        const economicAction = new EconomicAction(
          params as EconomicActionProps,
        );
        return economicAction;
      }
      case 'food':
        return new FoodAction(params as FoodActionProps);
      case 'volunteer':
        return new VolunteerAction(params as VolunteerActionProps);
      default:
        throw new Error(`Invalid action type: ${type}`);
    }
  }
}
*/
