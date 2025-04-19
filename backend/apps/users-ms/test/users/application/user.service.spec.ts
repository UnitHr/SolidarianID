// user.service.impl.spec.ts

import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { EventPublisher } from '@nestjs/cqrs';

import { UserServiceImpl } from '@users-ms/users/application/user.service.impl';
import { UserRepository } from '@users-ms/users/user.repository';
import { User } from '@users-ms/users/domain';

import {
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  InvalidPasswordError,
} from '@users-ms/users/exceptions';

import { UnderageUserError } from '@users-ms/users/exceptions/under-age-user.error';
import { UserBirthDate } from '@users-ms/users/domain/UserBirthDate';
import { UserPassword } from '@users-ms/users/domain/Password';
import { UserEmail } from '@users-ms/users/domain/UserEmail';

jest.mock('@users-ms/users/user.repository');

const TEST_USER_DATA = {
  VALID_ID: '1234',
  VALID_EMAIL: 'test.user@example.com',
  VALID_PASSWORD: '123456Test*',
  VALID_BIRTH_DATE: new Date('1990-01-01'),
  UNDERAGE_BIRTH_DATE: new Date(),
};

const createMockUser = async (overrides: Partial<User> = {}): Promise<User> => {
  const password = await UserPassword.create(TEST_USER_DATA.VALID_PASSWORD);

  // Merge overrides with defaults before creating the user
  const props = {
    firstName: 'Default',
    lastName: 'User',
    email: UserEmail.create(TEST_USER_DATA.VALID_EMAIL),
    bio: 'Default bio',
    birthDate: UserBirthDate.create(TEST_USER_DATA.VALID_BIRTH_DATE),
    password,
    showAge: false,
    showEmail: false,
    role: 'user',
    followers: [],
  };

  // Create user with merged props
  const user = User.create(
    {
      ...props,
      ...overrides,
      email: overrides.email ? UserEmail.create(overrides.email) : props.email,
      password: overrides.userPassword || props.password,
    },
    overrides.id || new UniqueEntityID(TEST_USER_DATA.VALID_ID),
  );

  jest.spyOn(user, 'updateProfile');
  jest.spyOn(user, 'commit');

  return user;
};

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let eventPublisherMock: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    eventPublisherMock = {
      mergeObjectContext: jest.fn().mockImplementation((user) => user),
      mergeClassContext: jest.fn(),
    } as unknown as jest.Mocked<EventPublisher>;

    userService = new UserServiceImpl(userRepositoryMock, eventPublisherMock);
  });

  // ---------------------------------------------------------------------------------------
  // createUser
  // ---------------------------------------------------------------------------------------
  describe('createUser', () => {
    it('creates a new user successfully and returns its ID', async () => {
      // Arrange
      const testUserId = '1234';
      const testUser = await createMockUser({
        id: new UniqueEntityID(testUserId),
      });
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );
      userRepositoryMock.save.mockResolvedValueOnce(testUser);
      eventPublisherMock.mergeObjectContext.mockReturnValue(testUser);

      // Act
      const userId = await userService.createUser(
        testUser.firstName,
        testUser.lastName,
        testUser.birthDate.value,
        testUser.email,
        testUser.password,
        testUser.bio,
        testUser.showAge,
        testUser.showEmail,
      );

      // Assert
      expect(userId).toBe(testUserId);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        testUser.email,
      );
      expect(userRepositoryMock.save).toHaveBeenCalledWith(testUser);
      expect(eventPublisherMock.mergeObjectContext).toHaveBeenCalledTimes(1);
      expect(testUser.commit).toHaveBeenCalledTimes(1);
    });

    it('throws EmailAlreadyInUseError if email is already in use', async () => {
      // Arrange
      const existingUser = await createMockUser({
        email: 'john.doe@example.com',
      });
      userRepositoryMock.findByEmail.mockResolvedValueOnce(existingUser);

      // Act & Assert
      await expect(
        userService.createUser(
          'John',
          'Doe',
          new Date('2000-01-01'),
          'john.doe@example.com',
          'password',
          'My bio',
          true,
          false,
        ),
      ).rejects.toThrow(EmailAlreadyInUseError);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('throws UnderageUserError if user is under age', async () => {
      // Arrange
      const birthDateUnderAge = new Date();
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act & Assert
      await expect(
        userService.createUser(
          'Junior',
          'Smith',
          birthDateUnderAge,
          'junior@example.com',
          'ValidPass123*',
          'Underage user bio',
          true,
          true,
        ),
      ).rejects.toThrow(UnderageUserError);
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('validates password requirements during user creation', async () => {
      // Arrange
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act & Assert
      await expect(
        userService.createUser(
          'John',
          'Doe',
          TEST_USER_DATA.VALID_BIRTH_DATE,
          'john.doe@example.com',
          'weak', // Invalid password
          'Bio',
          true,
          true,
        ),
      ).rejects.toThrow(InvalidPasswordError);

      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('creates user with default values when optional parameters are not provided', async () => {
      // Arrange
      const testUser = await createMockUser();
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );
      userRepositoryMock.save.mockResolvedValueOnce(testUser);
      eventPublisherMock.mergeObjectContext.mockReturnValue(testUser);

      // Act
      const userId = await userService.createUser(
        'John',
        'Doe',
        TEST_USER_DATA.VALID_BIRTH_DATE,
        'john.doe@example.com',
        TEST_USER_DATA.VALID_PASSWORD,
        'Bio',
        true,
        true,
      );

      // Assert
      expect(userId).toBeDefined();
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          showAge: false, // Default value
          showEmail: false, // Default value
          role: 'user', // Default value
        }),
      );
    });
  });

  // ---------------------------------------------------------------------------------------
  // updateUser
  // ---------------------------------------------------------------------------------------
  describe('updateUser', () => {
    it('updates a user profile successfully', async () => {
      // Arrange
      const existingUser = await createMockUser({
        id: new UniqueEntityID('1234'),
        email: 'old.email@example.com',
      });
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act
      await userService.updateUser(
        '1234',
        'new.email@example.com',
        'Updated bio',
      );

      // Assert
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'new.email@example.com',
      );
      expect(existingUser.updateProfile).toHaveBeenCalledWith({
        bio: 'Updated bio',
        email: 'new.email@example.com',
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(existingUser);
    });

    it('throws EntityNotFoundError if user does not exist', async () => {
      // Arrange
      userRepositoryMock.findById.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act & Assert
      await expect(
        userService.updateUser('1234', 'new.email@example.com', 'Updated bio'),
      ).rejects.toThrow(EntityNotFoundError);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('throws EmailUpdateConflictError if the email is the same as current', async () => {
      // Arrange
      const existingUser = await createMockUser({
        id: new UniqueEntityID('1234'),
        email: 'same.email@example.com',
      });
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);

      // Act & Assert
      await expect(
        userService.updateUser('1234', 'same.email@example.com', 'Updated bio'),
      ).rejects.toThrow(EmailUpdateConflictError);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('throws EmailAlreadyInUseError if email is already used by another user', async () => {
      // Arrange
      const existingUser = await createMockUser({
        id: new UniqueEntityID('1234'),
        email: 'old.email@example.com',
      });
      const userWithSameEmail = await createMockUser({
        id: new UniqueEntityID('5678'),
        email: 'new.email@example.com',
      });

      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);
      userRepositoryMock.findByEmail.mockResolvedValueOnce(userWithSameEmail);

      // Act & Assert
      await expect(
        userService.updateUser('1234', 'new.email@example.com', 'Updated bio'),
      ).rejects.toThrow(EmailAlreadyInUseError);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'new.email@example.com',
      );
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('updates only bio when email is not provided', async () => {
      // Arrange
      const existingUser = await createMockUser();
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act
      await userService.updateUser(TEST_USER_DATA.VALID_ID, null, 'New bio');

      // Assert
      expect(existingUser.updateProfile).toHaveBeenCalledWith({
        bio: 'New bio',
        email: null,
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(existingUser);
      expect(existingUser.email).toBe(TEST_USER_DATA.VALID_EMAIL);
    });

    it('handles empty bio update', async () => {
      // Arrange
      const existingUser = await createMockUser();
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act
      await userService.updateUser(TEST_USER_DATA.VALID_ID, undefined, '');

      // Assert
      expect(existingUser.updateProfile).toHaveBeenCalledWith({
        bio: '',
        email: undefined,
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(existingUser);
    });

    it('updates only email when bio is not provided', async () => {
      // Arrange
      const existingUser = await createMockUser();
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act
      await userService.updateUser(
        TEST_USER_DATA.VALID_ID,
        'new.email@example.com',
        undefined,
      );

      // Assert
      expect(existingUser.updateProfile).toHaveBeenCalledWith({
        bio: undefined,
        email: 'new.email@example.com',
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(existingUser);
      expect(existingUser.bio).toBe('Default bio');
    });
  });

  // ---------------------------------------------------------------------------------------
  // getUserProfile
  // ---------------------------------------------------------------------------------------
  describe('getUserProfile', () => {
    it('returns the user profile if user exists', async () => {
      // Arrange
      const existingUser = await createMockUser({
        id: new UniqueEntityID('1234'),
        firstName: 'John',
        lastName: 'Doe',
      });
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);

      // Act
      const result = await userService.getUserProfile('1234');

      // Assert
      expect(result).toEqual(existingUser);
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
    });

    it('throws EntityNotFoundError if user does not exist', async () => {
      // Arrange
      userRepositoryMock.findById.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act & Assert
      await expect(userService.getUserProfile('1234')).rejects.toThrow(
        EntityNotFoundError,
      );
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
    });
  });

  // ---------------------------------------------------------------------------------------
  // getUserByEmail
  // ---------------------------------------------------------------------------------------
  describe('getUserByEmail', () => {
    it('returns the user if email exists', async () => {
      // Arrange
      const existingUser = await createMockUser({
        id: new UniqueEntityID('1234'),
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
      userRepositoryMock.findByEmail.mockResolvedValueOnce(existingUser);

      // Act
      const result = await userService.getUserByEmail('john.doe@example.com');

      // Assert
      expect(result).toEqual(existingUser);
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
    });

    it('throws EntityNotFoundError if email does not exist', async () => {
      // Arrange
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );

      // Act & Assert
      await expect(
        userService.getUserByEmail('john.doe@example.com'),
      ).rejects.toThrow(EntityNotFoundError);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
    });
  });
});
