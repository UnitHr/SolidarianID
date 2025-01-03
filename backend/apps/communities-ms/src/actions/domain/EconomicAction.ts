import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';

export class EconomicAction extends Action {
  constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.type = ActionType.ECONOMIC;
  }

  update(params: ActionProps): void {
    this.updateCommonProperties(params);
  }

  /* eslint-disable class-methods-use-this */
  public static create(props: ActionProps, id?: string): EconomicAction {
    if (id !== undefined)
      return new EconomicAction(props, new UniqueEntityID(id));
    return new EconomicAction(props);
  }
}
