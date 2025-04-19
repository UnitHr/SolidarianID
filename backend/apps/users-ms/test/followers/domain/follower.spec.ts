import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Follower } from '@users-ms/followers/domain';

describe('Follower', () => {
  describe('create', () => {
    it('should create a valid follower', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const followedAt = new Date();

      // Act
      const follower = Follower.create({
        followerId,
        followedId,
        fullName,
        email,
        followedAt,
      });

      // Assert
      expect(follower).toBeInstanceOf(Follower);
      expect(follower.followerId.toString()).toBe('follower-id');
      expect(follower.followedId.toString()).toBe('followed-id');
      expect(follower.fullName).toBe(fullName);
      expect(follower.email).toBe(email);
      expect(follower.followedAt).toBe(followedAt);
    });

    it('should create a follower with a default followedAt date when not provided', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const beforeCreate = new Date();

      // Act
      const follower = Follower.create({
        followerId,
        followedId,
        fullName,
        email,
      });
      const afterCreate = new Date();

      // Assert
      expect(follower).toBeInstanceOf(Follower);
      expect(follower.followedAt).toBeInstanceOf(Date);
      expect(follower.followedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(follower.followedAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });

    it('should create a follower with a custom id when provided', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const followedAt = new Date();
      const customId = new UniqueEntityID('custom-id');

      // Act
      const follower = Follower.create(
        {
          followerId,
          followedId,
          fullName,
          email,
          followedAt,
        },
        customId,
      );

      // Assert
      expect(follower.id.toString()).toBe('custom-id');
    });

    it('should throw an error when followerId is missing', () => {
      // Arrange
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const followedAt = new Date();

      // Act & Assert
      expect(() =>
        Follower.create({
          followerId: undefined,
          followedId,
          fullName,
          email,
          followedAt,
        }),
      ).toThrow('Missing properties');
    });

    it('should throw an error when followedId is missing', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const followedAt = new Date();

      // Act & Assert
      expect(() =>
        Follower.create({
          followerId,
          followedId: undefined,
          fullName,
          email,
          followedAt,
        }),
      ).toThrow('Missing properties');
    });

    it('should throw an error when fullName is missing', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const email = 'john@example.com';
      const followedAt = new Date();

      // Act & Assert
      expect(() =>
        Follower.create({
          followerId,
          followedId,
          fullName: undefined,
          email,
          followedAt,
        }),
      ).toThrow('Missing properties');
    });

    it('should throw an error when email is missing', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const followedAt = new Date();

      // Act & Assert
      expect(() =>
        Follower.create({
          followerId,
          followedId,
          fullName,
          email: undefined,
          followedAt,
        }),
      ).toThrow('Missing properties');
    });

    it('should emit UserFollowedEvent when creating a new follower (id = null)', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const followedAt = new Date();

      // Spy on the apply method
      const applySpy = jest.spyOn(Follower.prototype, 'apply');

      // Act
      Follower.create({
        followerId,
        followedId,
        fullName,
        email,
        followedAt,
      });

      // Assert
      expect(applySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UserFollowedEvent',
          userId: 'follower-id',
          followedUserId: 'followed-id',
          followedUserEmail: email,
          date: followedAt,
        }),
      );
      applySpy.mockRestore();
    });

    it('should not emit UserFollowedEvent when creating a follower from database (id != null)', () => {
      // Arrange
      const followerId = new UniqueEntityID('follower-id');
      const followedId = new UniqueEntityID('followed-id');
      const fullName = 'John Doe';
      const email = 'john@example.com';
      const followedAt = new Date();
      const customId = new UniqueEntityID('custom-id');

      // Spy on the apply method
      const applySpy = jest.spyOn(Follower.prototype, 'apply');

      // Act
      Follower.create(
        {
          followerId,
          followedId,
          fullName,
          email,
          followedAt,
        },
        customId,
      );

      // Assert
      expect(applySpy).not.toHaveBeenCalled();
      applySpy.mockRestore();
    });
  });
});
