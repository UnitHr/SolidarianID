import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { UserFollowedEvent } from './events/UserFollowedEvent';

export interface FollowerProps {
  followerId: UniqueEntityID;
  followedId: UniqueEntityID;
  fullName: string;
  email: string;
  followedAt?: Date;
}

export class Follower extends EntityRoot<FollowerProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get followerId(): UniqueEntityID {
    return this.props.followerId;
  }

  get followedId(): UniqueEntityID {
    return this.props.followedId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string {
    return this.props.email;
  }

  get followedAt(): Date {
    return this.props.followedAt;
  }

  public static create(props: FollowerProps, id?: UniqueEntityID): Follower {
    const { followerId, followedId, fullName, email, followedAt } = props;
    if (!followerId || !followedId || !fullName || !email || !followedAt) {
      throw new Error('Missing properties');
    }

    const follower = new Follower(
      { ...props, followedAt: followedAt || new Date() },
      id,
    );

    if (!id) {
      follower.apply(
        new UserFollowedEvent(
          followerId.toString(),
          followedId.toString(),
          email,
          follower.followedAt,
        ),
      );
    }
    return follower;
  }
}
