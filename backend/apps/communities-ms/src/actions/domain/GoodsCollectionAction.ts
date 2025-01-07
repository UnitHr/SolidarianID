import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';
import { ActionCreatedEvent } from './events/ActionCreatedEvent';

interface GoodsCollectionActionProps extends ActionProps {
  goodType: string;
}

export class GoodsCollectionAction extends Action {
  constructor(props: GoodsCollectionActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.type = ActionType.GOODS_COLLECTION;
  }

  get goodType(): string {
    return (this.props as GoodsCollectionActionProps).goodType;
  }

  set goodType(goodType: string) {
    (this.props as GoodsCollectionActionProps).goodType = goodType;
  }

  public static create(
    props: GoodsCollectionActionProps,
    id?: string,
  ): GoodsCollectionAction {
    const action = new GoodsCollectionAction(props, new UniqueEntityID(id));
    action.apply(
      new ActionCreatedEvent(action.id.toString(), props.type, props.title),
    );
    return action;
  }
}
