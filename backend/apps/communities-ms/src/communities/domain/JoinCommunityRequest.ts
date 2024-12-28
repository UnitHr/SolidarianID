import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { Status } from './Status';

interface JoinCommunityRequestProps {
  userId: string; // This is the user that is trying to join to the community
  communityId: string; // This is the community that the user is trying to join
  status: Status;
  comment?: string;
}

export class JoinCommunityRequest extends Entity<JoinCommunityRequestProps> {
  private constructor(props: JoinCommunityRequestProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    // eslint-disable-next-line no-underscore-dangle
    return this._id;
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

  get communityId(): string {
    return this.props.communityId;
  }

  set communityId(communityId: string) {
    this.props.communityId = communityId;
  }

  static create(
    props: JoinCommunityRequestProps,
    id?: UniqueEntityID,
  ): JoinCommunityRequest {
    return new JoinCommunityRequest(props, id);
  }
}
