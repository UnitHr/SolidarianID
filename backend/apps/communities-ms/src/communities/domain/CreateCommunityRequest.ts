import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { StatusRequest } from './StatusRequest';
import { MissingPropertiesError } from '../exceptions';

interface CreateCommunityRequestProps {
  userId: string;
  communityName: string;
  communityDescription: string;
  causeTitle: string;
  causeDescription: string;
  causeEndDate: Date;
  causeOds: ODSEnum[];
  status: StatusRequest;
  comment?: string;
}

export class CreateCommunityRequest extends Entity<CreateCommunityRequestProps> {
  private constructor(props: CreateCommunityRequestProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
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

  get causeEndDate(): Date {
    return this.props.causeEndDate;
  }

  get causeOds(): number[] {
    return this.props.causeOds;
  }

  get status(): StatusRequest {
    return this.props.status;
  }

  set status(status: StatusRequest) {
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
    const {
      userId,
      communityName,
      communityDescription,
      causeTitle,
      causeDescription,
      causeEndDate,
      causeOds,
      status,
    } = props;
    if (
      !userId ||
      !communityName ||
      !communityDescription ||
      !causeTitle ||
      !causeDescription ||
      !causeEndDate ||
      !causeOds ||
      !status
    ) {
      MissingPropertiesError.create();
    }

    return new CreateCommunityRequest(props, id);
  }
}
