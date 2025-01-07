import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';
import { ActionCreatedEvent } from './events/ActionCreatedEvent';

interface VolunteerActionProps extends ActionProps {
  location: string;
  date: Date;
}

export class VolunteerAction extends Action {
  constructor(props: VolunteerActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.type = ActionType.VOLUNTEER;
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

  public static create(
    props: VolunteerActionProps,
    id?: string,
  ): VolunteerAction {
    const action = new VolunteerAction(props, new UniqueEntityID(id));
    if (!id) {
      action.apply(
        new ActionCreatedEvent(action.id.toString(), props.type, props.title),
      );
    }
    return action;
  }
}
