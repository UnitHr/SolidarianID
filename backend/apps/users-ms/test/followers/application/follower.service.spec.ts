import { EventPublisher } from '@nestjs/cqrs';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { FollowerServiceImpl } from '@users-ms/followers/application/follower.service.impl';
import { FollowerRepository } from '@users-ms/followers/follower.repository';
import { Follower } from '@users-ms/followers/domain';
import { UserAlreadyFollowedError } from '@users-ms/followers/exceptions/user-already-followed.error';
import { UserCannotFollowSelfError } from '@users-ms/followers/exceptions/user-cannot-follow-self.error';
import { UserService } from '@users-ms/users/application/user.service';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions';

jest.mock('@users-ms/followers/follower.repository');

describe('FollowerServiceImpl', () => {
  let followerService: FollowerServiceImpl;
  let followerRepositoryMock: jest.Mocked<FollowerRepository>;
  let eventPublisherMock: jest.Mocked<EventPublisher>;
  let userServiceMock: jest.Mocked<UserService>;

  // Test data constants
  const FOLLOWER_ID = 'follower-id';
  const FOLLOWED_ID = 'followed-id';
  const FOLLOWER_NAME = 'Follower Name';
  const FOLLOWER_EMAIL = 'follower@example.com';
  const FOLLOWED_NAME = 'Followed Name';
  const FOLLOWED_EMAIL = 'followed@email.com';

  beforeEach(() => {
    followerRepositoryMock = {
      find: jest.fn(),
      findById: jest.fn(),
      findFollowers: jest.fn(),
      findFollowing: jest.fn(),
      countFollowers: jest.fn(),
      countFollowing: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<FollowerRepository>;

    userServiceMock = {
      getUserProfile: jest.fn().mockResolvedValue({
        fullName: FOLLOWER_NAME,
        email: FOLLOWER_EMAIL,
      }),
    } as unknown as jest.Mocked<UserService>;

    eventPublisherMock = {
      mergeObjectContext: jest.fn().mockImplementation((follower) => follower),
    } as unknown as jest.Mocked<EventPublisher>;

    followerService = new FollowerServiceImpl(
      followerRepositoryMock,
      userServiceMock,
      eventPublisherMock,
    );
  });

  // Helper function to create a follower
  const createFollower = (
    customId?: string,
    followerId = FOLLOWER_ID,
    followedId = FOLLOWED_ID,
  ): Follower => {
    const follower = Follower.create(
      {
        followerId: new UniqueEntityID(followerId),
        followerFullName: FOLLOWER_NAME,
        followerEmail: FOLLOWER_EMAIL,
        followedId: new UniqueEntityID(followedId),
        followedFullName: FOLLOWED_NAME,
        followedEmail: FOLLOWED_EMAIL,
        followedAt: new Date(),
      },
      customId ? new UniqueEntityID(customId) : undefined,
    );

    jest.spyOn(follower, 'commit');
    return follower;
  };

  describe('followUser', () => {
    it('should allow one user to follow another user successfully', async () => {
      // Arrange
      followerRepositoryMock.find.mockResolvedValueOnce(null); // Not following yet
      const commitSpy = jest.spyOn(Follower.prototype, 'commit');
      const follower = createFollower();
      followerRepositoryMock.save.mockResolvedValueOnce(follower);

      // Act
      await followerService.followUser(FOLLOWED_ID, FOLLOWER_ID);

      // Assert
      expect(followerRepositoryMock.find).toHaveBeenCalledWith(
        FOLLOWER_ID,
        FOLLOWED_ID,
      );

      expect(userServiceMock.getUserProfile).toHaveBeenCalledWith(FOLLOWED_ID);
      expect(userServiceMock.getUserProfile).toHaveBeenCalledWith(FOLLOWER_ID);

      expect(eventPublisherMock.mergeObjectContext).toHaveBeenCalledWith(
        expect.any(Follower),
      );

      expect(followerRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            followerId: expect.objectContaining({ value: FOLLOWER_ID }),
            followedId: expect.objectContaining({ value: FOLLOWED_ID }),
            followerFullName: FOLLOWER_NAME,
            followerEmail: FOLLOWER_EMAIL,
          }),
        }),
      );

      // Check if commit was called on any Follower instance
      expect(commitSpy).toHaveBeenCalled();
      commitSpy.mockRestore();
    });

    it('should throw UserCannotFollowSelfError when trying to follow self', async () => {
      // Act & Assert
      await expect(
        followerService.followUser(FOLLOWER_ID, FOLLOWER_ID),
      ).rejects.toThrow(UserCannotFollowSelfError);

      expect(followerRepositoryMock.find).not.toHaveBeenCalled();
      expect(followerRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw UserAlreadyFollowedError when already following', async () => {
      // Arrange
      const existingFollower = createFollower(
        'existing-id',
        FOLLOWER_ID,
        FOLLOWED_ID,
      );
      followerRepositoryMock.find.mockResolvedValueOnce(existingFollower);

      // Act & Assert
      await expect(
        followerService.followUser(FOLLOWED_ID, FOLLOWER_ID),
      ).rejects.toThrow(UserAlreadyFollowedError);

      expect(followerRepositoryMock.find).toHaveBeenCalledWith(
        FOLLOWER_ID,
        FOLLOWED_ID,
      );
      expect(followerRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFoundError when user followed not found', async () => {
      // Arrange
      followerRepositoryMock.find.mockResolvedValueOnce(null);
      userServiceMock.getUserProfile.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act & Assert
      await expect(
        followerService.followUser(FOLLOWED_ID, FOLLOWER_ID),
      ).rejects.toThrow(EntityNotFoundError);

      expect(followerRepositoryMock.find).toHaveBeenCalledWith(
        FOLLOWER_ID,
        FOLLOWED_ID,
      );
      expect(followerRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('getUserFollowers', () => {
    it('returns paginated list of followers for a user with default pagination', async () => {
      // Arrange
      const followers = [
        createFollower('follower-record-1', 'follower-1', FOLLOWED_ID),
        createFollower('follower-record-2', 'follower-2', FOLLOWED_ID),
      ];
      const total = 2;
      followerRepositoryMock.findFollowers.mockResolvedValueOnce([
        followers,
        total,
      ]);

      // Act
      const result = await followerService.getUserFollowers(FOLLOWED_ID);

      // Assert
      expect(result).toEqual({ followers, total });
      expect(followerRepositoryMock.findFollowers).toHaveBeenCalledWith(
        FOLLOWED_ID,
        undefined,
        undefined,
      );
    });

    it('returns paginated list of followers with specific page and limit', async () => {
      // Arrange
      const followers = [
        createFollower('follower-record-3', 'follower-3', FOLLOWED_ID),
      ];
      const total = 5;
      const page = 2;
      const limit = 1;
      followerRepositoryMock.findFollowers.mockResolvedValueOnce([
        followers,
        total,
      ]);

      // Act
      const result = await followerService.getUserFollowers(
        FOLLOWED_ID,
        page,
        limit,
      );

      // Assert
      expect(result).toEqual({ followers, total });
      expect(followerRepositoryMock.findFollowers).toHaveBeenCalledWith(
        FOLLOWED_ID,
        page,
        limit,
      );
    });

    it('returns empty followers list when user has no followers', async () => {
      // Arrange
      const total = 0;
      followerRepositoryMock.findFollowers.mockResolvedValueOnce([[], total]);

      // Act
      const result = await followerService.getUserFollowers(FOLLOWED_ID);

      // Assert
      expect(result).toEqual({ followers: [], total: 0 });
      expect(followerRepositoryMock.findFollowers).toHaveBeenCalledWith(
        FOLLOWED_ID,
        undefined,
        undefined,
      );
    });
  });

  describe('getUserFollowing', () => {
    it('returns paginated list of users that a user is following with default pagination', async () => {
      // Arrange
      const following = [
        createFollower('following-record-1', FOLLOWED_ID, 'followed-1'),
        createFollower('following-record-2', FOLLOWED_ID, 'followed-2'),
      ];
      const total = 2;
      followerRepositoryMock.findFollowing.mockResolvedValueOnce([
        following,
        total,
      ]);

      // Act
      const result = await followerService.getUserFollowing(FOLLOWED_ID);

      // Assert
      expect(result).toEqual({ following, total });
      expect(followerRepositoryMock.findFollowing).toHaveBeenCalledWith(
        FOLLOWED_ID,
        undefined,
        undefined,
      );
    });

    it('returns paginated list of following with specific page and limit', async () => {
      // Arrange
      const following = [
        createFollower('following-record-3', FOLLOWED_ID, 'followed-3'),
      ];
      const total = 5;
      const page = 2;
      const limit = 1;
      followerRepositoryMock.findFollowing.mockResolvedValueOnce([
        following,
        total,
      ]);

      // Act
      const result = await followerService.getUserFollowing(
        FOLLOWED_ID,
        page,
        limit,
      );

      // Assert
      expect(result).toEqual({ following, total });
      expect(followerRepositoryMock.findFollowing).toHaveBeenCalledWith(
        FOLLOWED_ID,
        page,
        limit,
      );
    });

    it('returns empty following list when user is not following anyone', async () => {
      // Arrange
      const total = 0;
      followerRepositoryMock.findFollowing.mockResolvedValueOnce([[], total]);

      // Act
      const result = await followerService.getUserFollowing(FOLLOWED_ID);

      // Assert
      expect(result).toEqual({ following: [], total: 0 });
      expect(followerRepositoryMock.findFollowing).toHaveBeenCalledWith(
        FOLLOWED_ID,
        undefined,
        undefined,
      );
    });
  });

  describe('isFollowing', () => {
    it('returns true when user is following another user', async () => {
      // Arrange
      const existingFollower = createFollower();
      followerRepositoryMock.find.mockResolvedValueOnce(existingFollower);

      // Act
      const result = await followerService.isFollowing(
        FOLLOWED_ID,
        FOLLOWER_ID,
      );

      // Assert
      expect(result).toBe(true);
      expect(followerRepositoryMock.find).toHaveBeenCalledWith(
        FOLLOWER_ID,
        FOLLOWED_ID,
      );
    });

    it('returns false when user is not following another user', async () => {
      // Arrange
      followerRepositoryMock.find.mockResolvedValueOnce(null);

      // Act
      const result = await followerService.isFollowing(
        FOLLOWED_ID,
        FOLLOWER_ID,
      );

      // Assert
      expect(result).toBe(false);
      expect(followerRepositoryMock.find).toHaveBeenCalledWith(
        FOLLOWER_ID,
        FOLLOWED_ID,
      );
    });
  });
});
