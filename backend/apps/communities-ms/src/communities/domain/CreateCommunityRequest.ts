import { Ods } from './Ods';
import { Status } from './Status';
import { CauseEndDate } from './CauseEndDate';
import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';

interface CreateCommunityRequestProps {
  userId: string; // This is the user that is creating the community
  communityName: string;
  communityDescription: string;
  causeTitle: string;
  causeDescription: string;
  causeEndDate: CauseEndDate;
  causeOds: Ods[];
  status: Status;
  comment?: string;
}

export class CreateCommunityRequest extends Entity<CreateCommunityRequestProps> {
  private constructor(props: CreateCommunityRequestProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    // eslint-disable-next-line no-underscore-dangle
    return this._id;
  }

  get communityName(): string {
    return this.props.communityName;
  }

  get communityDescription(): string {
    return this.props.communityDescription;
  }

  get causeTitle(): string {
    return this.props.causeTitle;
  }

  get causeDescription(): string {
    return this.props.causeDescription;
  }

  get causeEndDate(): CauseEndDate {
    return this.props.causeEndDate;
  }

  get causeOds(): Ods[] {
    return this.props.causeOds;
  }

  get status(): Status {
    return this.props.status;
  }

  set status(status: Status) {
    this.props.status = status;
  }

  get comment(): string | undefined {
    return this.props.comment;
  }

  set comment(comment: string) {
    this.props.comment = comment;
  }

  get userId(): string {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
  }

  static create(
    props: CreateCommunityRequestProps,
    id?: UniqueEntityID,
  ): CreateCommunityRequest {
    return new CreateCommunityRequest(props, id);
  }
}
