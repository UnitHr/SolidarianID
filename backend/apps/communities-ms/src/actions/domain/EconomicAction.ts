import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions/missing-properties.error';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';
import { ActionCreatedEvent } from './events/ActionCreatedEvent';

export class EconomicAction extends Action {
  constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.type = ActionType.ECONOMIC;
  }

  public static create(
    props: ActionProps,
    id?: UniqueEntityID,
  ): EconomicAction {
    if (!super.checkProperties(props)) {
      throw new MissingPropertiesError('[Action] Properties are missing.');
    }
    const action = new EconomicAction(props, id);
    if (!id) {
      action.apply(
        new ActionCreatedEvent(action.id.toString(), props.type, props.title),
      );
    }
    return action;
  }
}
