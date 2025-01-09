import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { StatusRequest } from './StatusRequest';
import { MissingPropertiesError } from '../exceptions';
import { JoinCommunityRequestCreatedEvent } from './events/JoinCommunityRequestCreatedEvent';

interface JoinCommunityRequestProps {
  userId: string;
  communityId: string;
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
    const { userId, communityId, status } = props;
    if (!userId || !communityId || !status) {
      MissingPropertiesError.create();
    }
    const joinCommunityRequest = new JoinCommunityRequest(props, id);
    if (!id) {
      joinCommunityRequest.apply(
        new JoinCommunityRequestCreatedEvent(userId, communityId, status),
      );
    }
    return joinCommunityRequest;
  }
}
