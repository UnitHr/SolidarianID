import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions/missing-properties.error';
import { ActionCreatedEvent } from '@common-lib/common-lib/events/domain/ActionCreatedEvent';
import { Action, ActionProps } from './Action';
import { ActionType } from './ActionType';

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

  get date(): Date {
    return (this.props as VolunteerActionProps).date;
  }

  public static create(
    props: VolunteerActionProps,
    id?: UniqueEntityID,
  ): VolunteerAction {
    if (!super.checkProperties(props) || !props.location || !props.date) {
      throw new MissingPropertiesError('[Action] Properties are missing.');
    }
    const action = new VolunteerAction(props, id);
    if (!id) {
      action.apply(
        new ActionCreatedEvent(
          action.id.toString(),
          props.createdBy,
          props.causeId,
          props.communityId,
          props.target,
          props.type,
          props.title,
        ),
      );
    }
    return action;
  }
}
