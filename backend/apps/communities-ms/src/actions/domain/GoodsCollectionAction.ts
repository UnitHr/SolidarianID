import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';

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

  /* eslint-disable class-methods-use-this */
  public static create(props: GoodsCollectionActionProps, id?: string): Action {
    if (id !== undefined)
      return new GoodsCollectionAction(props, new UniqueEntityID(id));
    return new GoodsCollectionAction(props);
  }
}
