import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { JoinCommunityRequestCreatedEvent } from '@common-lib/common-lib/events/domain/JoinCommunityRequestCreatedEvent';
import { JoinCommunityRequestRejectedEvent } from '@common-lib/common-lib/events/domain/JoinCommunityRequestRejectedEvent';
import { StatusRequest } from './StatusRequest';
import { MissingPropertiesError } from '../exceptions';

interface JoinCommunityRequestProps {
  userId: string;
  communityId: string;
  communityName: string;
  adminId: string;
  status: StatusRequest;
  comment?: string;
}

export class JoinCommunityRequest extends EntityRoot<JoinCommunityRequestProps> {
  private constructor(props: JoinCommunityRequestProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get status(): StatusRequest {
    return this.props.status;
  }

  set status(status: StatusRequest) {
    this.props.status = status;

    if (status === StatusRequest.DENIED) {
      this.apply(
        new JoinCommunityRequestRejectedEvent(
          this.userId,
          this.communityId,
          this.communityName,
        ),
      );
    }
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

  get communityName(): string {
    return this.props.communityName;
  }

  get adminId(): string {
    return this.props.adminId;
  }

  static create(
    props: JoinCommunityRequestProps,
    id?: UniqueEntityID,
  ): JoinCommunityRequest {
    const { userId, communityId, communityName, status, adminId } = props;
    if (!userId || !communityId || !communityName || !status || !adminId) {
      MissingPropertiesError.create();
    }
    const joinCommunityRequest = new JoinCommunityRequest(props, id);
    if (!id) {
      joinCommunityRequest.apply(
        new JoinCommunityRequestCreatedEvent(
          userId,
          communityId,
          communityName,
          adminId,
        ),
      );
    }
    return joinCommunityRequest;
  }
}
