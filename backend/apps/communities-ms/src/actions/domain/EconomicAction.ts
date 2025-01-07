import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';
import { ActionCreatedEvent } from './events/ActionCreatedEvent';

export class EconomicAction extends Action {
  constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.type = ActionType.ECONOMIC;
  }

  public static create(props: ActionProps, id?: string): EconomicAction {
    const action = new EconomicAction(props, new UniqueEntityID(id));
    action.apply(
      new ActionCreatedEvent(action.id.toString(), props.type, props.title),
    );
    return action;
  }
}
