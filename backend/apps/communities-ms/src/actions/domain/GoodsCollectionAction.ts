import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { GoodsContribution } from './contributions/GoodsContribution';

export interface GoodsCollectionActionProps extends ActionProps {
  goodType: string;
  quantity: number;
  unit: string;
  collectedQuantity?: number;
}

export class GoodsCollectionAction extends Action {
  constructor(props: GoodsCollectionActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.collectedQuantity = props.collectedQuantity ?? 0;
  }

  get goodType(): string {
    return (this.props as GoodsCollectionActionProps).goodType;
  }

  set goodType(goodType: string) {
    (this.props as GoodsCollectionActionProps).goodType = goodType;
  }

  get quantity(): number {
    return (this.props as GoodsCollectionActionProps).quantity;
  }

  set quantity(quantity: number) {
    (this.props as GoodsCollectionActionProps).quantity = quantity;
  }

  get unit(): string {
    return (this.props as GoodsCollectionActionProps).unit;
  }

  set unit(unit: string) {
    (this.props as GoodsCollectionActionProps).unit = unit;
  }

  get collectedQuantity(): number {
    return (this.props as GoodsCollectionActionProps).collectedQuantity;
  }

  set collectedQuantity(collectedQuantity: number) {
    (this.props as GoodsCollectionActionProps).collectedQuantity =
      collectedQuantity;
  }

  update(params: GoodsCollectionActionProps): void {
    this.updateCommonProperties(params);
    if (params.goodType !== undefined) this.goodType = params.goodType;
    if (params.quantity !== undefined) this.quantity = params.quantity;
    if (params.unit !== undefined) this.unit = params.unit;
    if (params.collectedQuantity !== undefined)
      this.collectedQuantity = params.collectedQuantity;
  }

  // eslint-disable-next-line class-methods-use-this
  getType(): string {
    return 'food';
  }

  getSummary(): string {
    return `We need to collect ${this.quantity} ${this.unit} of ${this.goodType} for ${this.title}. So far we have collected ${this.collectedQuantity} ${this.unit}.`;
  }

  /* eslint-disable class-methods-use-this */
  public static create(props: GoodsCollectionActionProps, id?: string): Action {
    if (id !== undefined)
      return new GoodsCollectionAction(props, new UniqueEntityID(id));
    return new GoodsCollectionAction(props);
  }

  contribute(contribution: GoodsContribution): void {
    this.addContribution(contribution);
    this.collectedQuantity += contribution.donatedQuantity;
  }
}
