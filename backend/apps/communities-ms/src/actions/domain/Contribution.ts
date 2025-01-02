import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';

interface ContributionProps {
  userId: string;

  actionId: string;

  date: Date;

  amount: number;

  unit: string;
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

  get amount(): number {
    return this.props.amount;
  }

  set amount(value: number) {
    this.props.amount = value;
  }

  get unit(): string {
    return this.props.unit;
  }

  set unit(value: string) {
    this.props.unit = value;
  }

  public static create(props: ContributionProps, id?: string): Contribution {
    if (id !== undefined) {
      return new Contribution(props, new UniqueEntityID(id));
    }
    return new Contribution(props);
  }
}
