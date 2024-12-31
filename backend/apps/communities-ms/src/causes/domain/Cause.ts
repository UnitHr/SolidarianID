import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions/missing-properties.error';
import { CauseEndDate } from './CauseEndDate';

export interface CauseProps {
  title: string;
  description: string;
  ods: number[];
  endDate: CauseEndDate;
  communityId: string;
  actions: string[];
  supporters: string[];
}

export class Cause extends Entity<CauseProps> {
  private constructor(props: CauseProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  set description(value: string) {
    this.props.description = value;
  }

  get ods(): number[] {
    return this.props.ods;
  }

  set ods(value: number[]) {
    this.props.ods = value;
  }

  get endDate(): CauseEndDate {
    return this.props.endDate;
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get actions(): string[] {
    return this.props.actions;
  }

  get supporters(): string[] {
    return this.props.supporters;
  }

  public static create(props: CauseProps, id?: UniqueEntityID): Cause {
    const { title, description, ods, endDate, communityId } = props;
    if (!title || !description || !ods || !endDate || !communityId) {
      throw new MissingPropertiesError('[Cause] Properties are missing.');
    }
    return new Cause(props, id);
  }

  public addSupporter(userId: string): void {
    this.props.supporters.push(userId);
  }

  public createCauseAction(description: string): void {
    this.props.actions.push(description);
  }
}
