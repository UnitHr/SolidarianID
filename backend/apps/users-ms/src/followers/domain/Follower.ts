import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { UserFollowedEvent } from './events/UserFollowedEvent';

export interface FollowerProps {
  followerId: UniqueEntityID;
  followerFullName: string;
  followerEmail: string;
  followedId: UniqueEntityID;
  followedFullName?: string;
  followedAt?: Date;
}

export class Follower extends EntityRoot<FollowerProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get followerId(): UniqueEntityID {
    return this.props.followerId;
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

  get followedId(): UniqueEntityID {
    return this.props.followedId;
  }

  get followedFullName(): string | undefined {
    return this.props.followedFullName;
  }

  public static create(props: FollowerProps, id?: UniqueEntityID): Follower {
    const {
      followerId,
      followerFullName,
      followerEmail,
      followedId,
      followedFullName,
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
          followedFullName,
          follower.followedAt,
        ),
      );
    }
    return follower;
  }
}
