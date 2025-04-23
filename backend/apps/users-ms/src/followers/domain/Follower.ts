import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { UserFollowedEvent } from './events/UserFollowedEvent';

export interface FollowerProps {
  followerId: UniqueEntityID;
  followedId: UniqueEntityID;
  followerFullName: string;
  followerEmail: string;
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

  get followerFullName(): string {
    return this.props.followerFullName;
  }

  get followerEmail(): string {
    return this.props.followerEmail;
  }

  get followedAt(): Date {
    return this.props.followedAt;
  }

  public static create(
    props: FollowerProps,
    id?: UniqueEntityID,
    followedEmail?: string,
  ): Follower {
    const {
      followerId,
      followedId,
      followerFullName,
      followerEmail,
      followedAt,
    } = props;
    if (!followerId || !followedId || !followerFullName || !followerEmail) {
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
          followedEmail,
          follower.followedAt,
        ),
      );
    }
    return follower;
  }
}
