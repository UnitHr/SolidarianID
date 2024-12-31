import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { Contribution, ContributionProps } from './Contribution';

export interface VolunteerContributionProps extends ContributionProps {
  hoursContributed?: number;
  volunteerNumber: number;
  task: string;
  location: string;
}

export class VolunteerContribution extends Contribution {
  constructor(props: VolunteerContributionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get hoursContributed(): number {
    return (this.props as VolunteerContributionProps).hoursContributed;
  }

  get volunteerNumber(): number {
    return (this.props as VolunteerContributionProps).volunteerNumber;
  }

  get task(): string {
    return (this.props as VolunteerContributionProps).task;
  }

  get location(): string {
    return (this.props as VolunteerContributionProps).location;
  }

  public static create(
    props: VolunteerContributionProps,
    id?: string,
  ): VolunteerContribution {
    if (id !== undefined)
      return new VolunteerContribution(props, new UniqueEntityID(id));
    return new VolunteerContribution(props);
  }
}
