import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { Contribution, ContributionProps } from './Contribution';

export interface EconomicContributionProps extends ContributionProps {
  donatedAmount: number;
}

export class EconomicContribution extends Contribution {
  constructor(props: EconomicContributionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get donatedAmount(): number {
    return (this.props as EconomicContributionProps).donatedAmount;
  }

  public static create(
    props: EconomicContributionProps,
    id?: string,
  ): EconomicContribution {
    if (id !== undefined)
      return new EconomicContribution(props, new UniqueEntityID(id));
    return new EconomicContribution(props);
  }
}
