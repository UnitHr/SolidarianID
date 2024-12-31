import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';

export interface ContributionProps {
  userId: string;

  actionId: string;

  date: Date;

  description?: string;
}

export class Contribution extends Entity<ContributionProps> {
  protected constructor(props: ContributionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get actionId(): string {
    return this.props.actionId;
  }

  get date(): Date {
    return this.props.date;
  }

  get description(): string {
    return this.props.description;
  }

  public static create(props: ContributionProps, id?: string): Contribution {
    if (id !== undefined) {
      return new Contribution(props, new UniqueEntityID(id));
    }
    return new Contribution(props);
  }
}
