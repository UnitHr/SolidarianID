import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { Contribution, ContributionProps } from './Contribution';

export interface GoodsContributionProps extends ContributionProps {
  goodType: string;
  donatedQuantity: number;
  unit: string;
}

export class GoodsContribution extends Contribution {
  constructor(props: GoodsContributionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get goodType(): string {
    return (this.props as GoodsContributionProps).goodType;
  }

  get donatedQuantity(): number {
    return (this.props as GoodsContributionProps).donatedQuantity;
  }

  get unit(): string {
    return (this.props as GoodsContributionProps).unit;
  }

  public static create(
    props: GoodsContributionProps,
    id?: string,
  ): GoodsContribution {
    if (id !== undefined)
      return new GoodsContribution(props, new UniqueEntityID(id));
    return new GoodsContribution(props);
  }
}
