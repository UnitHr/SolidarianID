import { User, UserProps } from '@users-ms/users/domain/User';
import { UserBirthDate } from '@users-ms/users/domain/UserBirthDate';
import { UserPassword } from '@users-ms/users/domain/Password';
import { UserEmail } from '@users-ms/users/domain/UserEmail';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import {
  MissingPropertiesError,
  UserAlreadyFollowedError,
  UserCannotFollowSelfError,
} from '@users-ms/users/exceptions';

describe('User', () => {
  // Common test data setup
  const createValidProps = async (): Promise<UserProps> => ({
    firstName: 'John',
    lastName: 'Doe',
    birthDate: UserBirthDate.create(new Date('1990-01-01')),
    email: UserEmail.create('john@example.com'),
    password: await UserPassword.create('ValidPass123!'),
    bio: 'Some bio',
    showAge: true,
    showEmail: true,
    role: 'user',
  });

  describe('create', () => {
    it('should create a valid user', async () => {
      // Arrange
      const props = await createValidProps();

      // Act
      const user = User.create(props);

      // Assert
      expect(user).toBeInstanceOf(User);
    });

    it('should create a user with custom id', async () => {
      // Arrange
      const props = await createValidProps();
      const customId = new UniqueEntityID('custom-id');

      // Act
      const user = User.create(props, customId);

      // Assert
      expect(user.id.toString()).toBe('custom-id');
    });

    it('should create a user with default bio when not provided', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.bio;

      // Act
      const user = User.create(props);

      // Assert
      expect(user.bio).toBe('No bio available');
    });

    it('should throw MissingPropertiesError when firstName is missing', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.firstName;

      // Act & Assert
      expect(() => User.create(props)).toThrow(MissingPropertiesError);
    });

    it('should throw MissingPropertiesError when lastName is missing', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.lastName;

      // Act & Assert
      expect(() => User.create(props)).toThrow(MissingPropertiesError);
    });

    it('should throw MissingPropertiesError when birthDate is missing', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.birthDate;

      // Act & Assert
      expect(() => User.create(props)).toThrow(MissingPropertiesError);
    });

    it('should throw MissingPropertiesError when email is missing', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.email;

      // Act & Assert
      expect(() => User.create(props)).toThrow(MissingPropertiesError);
    });

    it('should throw MissingPropertiesError when password is missing', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.password;

      // Act & Assert
      expect(() => User.create(props)).toThrow(MissingPropertiesError);
    });

    it('should initialize empty followers array when not provided', async () => {
      // Arrange
      const props = await createValidProps();

      // Act
      const user = User.create(props);

      // Assert
      expect(user.followers).toEqual([]);
    });
  });

  describe('updateProfile', () => {
    it('should update email when provided', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const currentBio = user.bio;
      const newEmail = 'newemail@example.com';

      // Act
      user.updateProfile({ email: newEmail });

      // Assert
      expect(user.email).toBe(newEmail);
      expect(user.bio).toBe(currentBio);
    });

    it('should update bio when provided', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const currentEmail = user.email;
      const newBio = 'New bio text';

      // Act
      user.updateProfile({ bio: newBio });

      // Assert
      expect(user.bio).toBe(newBio);
      expect(user.email).toBe(currentEmail);
    });

    it('should update both email and bio when provided', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const newEmail = 'newemail@example.com';
      const newBio = 'New bio text';

      // Act
      user.updateProfile({ email: newEmail, bio: newBio });

      // Assert
      expect(user.email).toBe(newEmail);
      expect(user.bio).toBe(newBio);
    });

    it('should set default bio when empty string is provided', async () => {
      // Arrange
      const user = User.create(await createValidProps());

      // Act
      user.updateProfile({ bio: '' });

      // Assert
      expect(user.bio).toBe('No bio available');
    });

    it('should not update email when same email is provided', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const originalEmail = user.email;

      // Act
      user.updateProfile({ email: originalEmail });

      // Assert
      expect(user.email).toBe(originalEmail);
    });
  });

  describe('followUser', () => {
    it('should add user to followers', async () => {
      // Arrange
      const follower = User.create({
        ...(await createValidProps()),
        email: UserEmail.create('follower@example.com'),
      });
      const followed = User.create(await createValidProps());
      const applyMock = jest.spyOn(
        follower as unknown as { apply: jest.Mock },
        'apply',
      );

      // Act
      follower.followUser(followed);

      // Assert
      expect(followed.followers).toContain(follower);
      expect(applyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UserFollowedEvent',
          userId: follower.id.toString(),
          followedUserId: followed.id.toString(),
        }),
      );
    });

    it('should throw UserCannotFollowSelfError when trying to follow self', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const applyMock = jest.spyOn(
        user as unknown as { apply: jest.Mock },
        'apply',
      );

      // Act & Assert
      expect(() => user.followUser(user)).toThrow(UserCannotFollowSelfError);
      expect(applyMock).not.toHaveBeenCalled();
    });

    it('should throw UserAlreadyFollowedError when already following', async () => {
      // Arrange
      const follower = User.create({
        ...(await createValidProps()),
        email: UserEmail.create('follower@example.com'),
      });
      const followed = User.create(await createValidProps());
      const applyMock = jest.spyOn(
        follower as unknown as { apply: jest.Mock },
        'apply',
      );
      follower.followUser(followed);
      applyMock.mockClear();

      // Act & Assert
      expect(() => follower.followUser(followed)).toThrow(
        UserAlreadyFollowedError,
      );
      expect(applyMock).not.toHaveBeenCalled();
    });

    it('should emit UserFollowedEvent when following user', async () => {
      // Arrange
      const follower = User.create({
        ...(await createValidProps()),
        email: UserEmail.create('follower@example.com'),
      });
      const followed = User.create(await createValidProps());
      const applyMock = jest.spyOn(
        follower as unknown as { apply: jest.Mock },
        'apply',
      );

      // Act
      follower.followUser(followed);

      // Assert
      expect(applyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UserFollowedEvent',
          userId: follower.id.toString(),
          followedUserId: followed.id.toString(),
        }),
      );
    });
  });
});
