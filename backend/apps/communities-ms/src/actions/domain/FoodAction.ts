import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';

export interface FoodActionProps extends ActionProps {
  foodType: string;
  quantity: number;
  unit: string;
  collectedQuantity: number;
}

export class FoodAction extends Action {
  constructor(props: FoodActionProps) {
    super(props, new UniqueEntityID(props.id));
  }

  get foodType(): string {
    return (this.props as FoodActionProps).foodType;
  }

  set foodType(foodType: string) {
    (this.props as FoodActionProps).foodType = foodType;
  }

  get quantity(): number {
    return (this.props as FoodActionProps).quantity;
  }

  set quantity(quantity: number) {
    (this.props as FoodActionProps).quantity = quantity;
  }

  get unit(): string {
    return (this.props as FoodActionProps).unit;
  }

  set unit(unit: string) {
    (this.props as FoodActionProps).unit = unit;
  }

  get collectedQuantity(): number {
    return (this.props as FoodActionProps).collectedQuantity;
  }

  set collectedQuantity(collectedQuantity: number) {
    (this.props as FoodActionProps).collectedQuantity = collectedQuantity;
  }

  update(params: FoodActionProps): void {
    this.updateCommonProperties(params);
    if (params.foodType !== undefined) this.foodType = params.foodType;
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
    return `We need to collect ${this.quantity} ${this.unit} of ${this.foodType} for ${this.title}. So far we have collected ${this.collectedQuantity} ${this.unit}.`;
  }

  /* eslint-disable class-methods-use-this */
  create(props: FoodActionProps): Action {
    return new FoodAction(props);
  }
}
