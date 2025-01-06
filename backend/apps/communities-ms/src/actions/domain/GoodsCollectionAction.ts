import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions/missing-properties.error';
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

  public static create(
    props: GoodsCollectionActionProps,
    id?: UniqueEntityID,
  ): GoodsCollectionAction {
    if (!super.checkProperties(props) || !props.goodType) {
      throw new MissingPropertiesError('[Action] Properties are missing.');
    }
    return new GoodsCollectionAction(props, id);
  }
}
