import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { VolunteerContribution } from './contributions/VolunteerContribution';

export interface VolunteerActionProps extends ActionProps {
  targetVolunteers: number;
  currentVolunteers?: number;
  location: string;
  date: Date;
}

export class VolunteerAction extends Action {
  constructor(props: VolunteerActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.currentVolunteers = props.currentVolunteers ?? 0;
  }

  get targetVolunteers(): number {
    return (this.props as VolunteerActionProps).targetVolunteers;
  }

  set targetVolunteers(value: number) {
    (this.props as VolunteerActionProps).targetVolunteers = value;
  }

  get currentVolunteers(): number {
    return (this.props as VolunteerActionProps).currentVolunteers;
  }

  set currentVolunteers(value: number) {
    (this.props as VolunteerActionProps).currentVolunteers = value;
  }

  get location(): string {
    return (this.props as VolunteerActionProps).location;
  }

  set location(value: string) {
    (this.props as VolunteerActionProps).location = value;
  }

  get date(): Date {
    return (this.props as VolunteerActionProps).date;
  }

  set date(value: Date) {
    (this.props as VolunteerActionProps).date = value;
  }

  update(params: VolunteerActionProps): void {
    super.updateCommonProperties(params);
    if (params.targetVolunteers !== undefined)
      this.targetVolunteers = params.targetVolunteers;
    if (params.currentVolunteers !== undefined)
      this.currentVolunteers = params.currentVolunteers;
    if (params.location !== undefined) this.location = params.location;
    if (params.date !== undefined) this.date = params.date;
  }

  getSummary(): string {
    return `We need ${this.targetVolunteers} volunteers for ${this.title}. So far we have ${this.currentVolunteers} inscriptions`;
  }

  // eslint-disable-next-line class-methods-use-this
  getType(): string {
    return 'volunteer';
  }

  /* eslint-disable class-methods-use-this */
  public static create(props: VolunteerActionProps, id?: string): Action {
    if (id !== undefined)
      return new VolunteerAction(props, new UniqueEntityID(id));
    return new VolunteerAction(props);
  }

  contribute(contribution: VolunteerContribution): void {
    this.addContribution(contribution);
    console.log(`CONTRIBUTE IN VOLUNTEER ${contribution}`);

    this.currentVolunteers += contribution.volunteerNumber;
  }
}
