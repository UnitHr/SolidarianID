import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions/missing-properties.error';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseEndDate } from './CauseEndDate';
import {
  ActionAlreadyExistsError,
  SupporterAlreadyExistsError,
} from '../exceptions';

export interface CauseProps {
  title: string;
  description: string;
  ods: ODSEnum[];
  endDate: CauseEndDate;
  communityId: string;
  actionsIds?: string[];
  supportersIds?: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Cause extends Entity<CauseProps> {
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

  get ods(): ODSEnum[] {
    return this.props.ods;
  }

  set ods(value: ODSEnum[]) {
    this.props.ods = value;
  }

  get endDate(): CauseEndDate {
    return this.props.endDate;
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get actionsIds(): string[] {
    return [...this.props.actionsIds];
  }

  get supportersIds(): string[] {
    return [...this.props.supportersIds];
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(props: CauseProps, id?: UniqueEntityID): Cause {
    const { title, description, ods, endDate, communityId, createdBy } = props;
    if (
      !title ||
      !description ||
      !ods ||
      !endDate ||
      !communityId ||
      !createdBy
    ) {
      throw new MissingPropertiesError('[Cause] Properties are missing.');
    }

    const defaultProps: CauseProps = {
      ...props,
      actionsIds: props.actionsIds || [],
      supportersIds: props.supportersIds || [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    return new Cause(defaultProps, id);
  }

  public addAction(actionId: string): void {
    // We check if the action already exists
    if (this.props.actionsIds.includes(actionId)) {
      throw new ActionAlreadyExistsError(actionId);
    }

    this.props.actionsIds.push(actionId);
  }

  public addSupporter(userId: string): void {
    // We check if the supporter already exists
    if (this.props.supportersIds.includes(userId)) {
      throw new SupporterAlreadyExistsError(userId);
    }

    this.props.supportersIds.push(userId);
  }
}
