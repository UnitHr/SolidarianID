import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import * as Persistence from './infra/persistence';
import { FollowerDto } from './dto/follower.dto';
import { FollowingDto } from './dto/following.dto';

export class FollowerMapper {
  static toDomain(raw: Persistence.Follower): Domain.Follower {
    const follower = Domain.Follower.create(
      {
        ...raw,
        followerId: new UniqueEntityID(raw.followerId),
        followedId: new UniqueEntityID(raw.followedId),
      },
      new UniqueEntityID(raw.id),
    );
    return follower;
  }

  static toPersistence(follower: Domain.Follower): Persistence.Follower {
    return {
      id: follower.id.toString(),
      followerId: follower.followerId.toString(),
      followerFullName: follower.followerFullName,
      followerEmail: follower.followerEmail,
      followedId: follower.followedId.toString(),
      followedFullName: follower.followedFullName,
      followedEmail: follower.followedEmail,
      followedAt: follower.followedAt,
    };
  }

  static toDto(follower: Domain.Follower): FollowerDto {
    return {
      followerId: follower.followerId.toString(),
      fullName: follower.followerFullName,
      email: follower.followerEmail,
      followedAt: follower.followedAt,
    };
  }

  static toFollowingDto(follower: Domain.Follower): FollowingDto {
    return {
      followedUserId: follower.followedId.toString(),
      fullName: follower.followedFullName,
      email: follower.followedEmail,
      followedAt: follower.followedAt,
    };
  }
}
