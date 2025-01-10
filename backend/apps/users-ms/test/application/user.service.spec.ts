import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { UserServiceImpl } from '@users-ms/users/application/user.service.impl';
import { User } from '@users-ms/users/domain';
import {
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
} from '@users-ms/users/exceptions';
import { UserRepository } from '@users-ms/users/user.repository';
import { EventPublisher } from '@nestjs/cqrs';

jest.mock('@users-ms/users/user.repository');

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let eventPublisherMock: jest.Mocked<EventPublisher>;

  const createMockId = (id: string = 'default-id'): UniqueEntityID => {
    return new UniqueEntityID(id);
  };

  const createMockUser = (overrides: Partial<User> = {}): User => {
    const userId = overrides.id ?? createMockId();
    return {
      id: userId,
      firstName: 'Default',
      lastName: 'User',
      email: 'default.user@example.com',
      bio: 'Default bio',
      birthDate: new Date('1990-01-01'),
      updateProfile: jest.fn(),
      ...overrides,
    } as User;
  };

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    eventPublisherMock = {
      mergeObjectContext: jest.fn().mockImplementation((user) => user),
      mergeClassContext: jest.fn(),
    } as unknown as jest.Mocked<EventPublisher>;

    userService = new UserServiceImpl(userRepositoryMock, eventPublisherMock);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new EntityNotFoundError('User not found'),
      );
      userRepositoryMock.save.mockResolvedValueOnce(
        createMockUser({ id: createMockId('1234') }),
      );

      // Act
      const userId = await userService.createUser(
        'John',
        'Doe',
        new Date('2000-01-01'),
        'john.doe@example.com',
        'password_A123',
        'This is my bio',
        true,
        false,
        'user',
      );

      // Assert
      expect(userId).toBe('1234');
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
    });

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
      // Arrange
      userRepositoryMock.findByEmail.mockResolvedValueOnce(
        createMockUser({ email: 'john.doe@example.com' }),
      );

      // Act & Assert
      await expect(
        userService.createUser(
          'John',
          'Doe',
          new Date('2000-01-01'),
          'john.doe@example.com',
          'password',
          'This is my bio',
          true,
          false,
          'user',
        ),
      ).rejects.toThrow(EmailAlreadyInUseError);

      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user profile successfully', async () => {
      // Arrange
      const existingUser = createMockUser({
        id: createMockId('1234'),
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
        email: 'new.email@example.com',
        bio: 'Updated bio',
      });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(existingUser);
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
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

    it('should throw EmailUpdateConflictError if the email is the same as current', async () => {
      // Arrange
      const existingUser = createMockUser({
        id: createMockId('1234'),
        email: 'new.email@example.com',
      });
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);

      // Act & Assert
      await expect(
        userService.updateUser('1234', 'new.email@example.com', 'Updated bio'),
      ).rejects.toThrow(EmailUpdateConflictError);

      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw EmailAlreadyInUseError if email is already used by another user', async () => {
      // Arrange
      const existingUser = createMockUser({
        id: createMockId('1234'),
        email: 'old.email@example.com',
      });
      userRepositoryMock.findById.mockResolvedValueOnce(existingUser);
      userRepositoryMock.findByEmail.mockResolvedValueOnce(
        createMockUser({ email: 'new.email@example.com' }),
      );

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
  });

  describe('getUserProfile', () => {
    it('should return the user profile if user exists', async () => {
      // Arrange
      const existingUser = createMockUser({
        id: createMockId('1234'),
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

    it('should throw UserNotFoundError if user does not exist', async () => {
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

  describe('getUserByEmail', () => {
    it('should return the user if email exists', async () => {
      // Arrange
      const existingUser = createMockUser({
        id: createMockId('1234'),
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

    it('should throw UserNotFoundError if email does not exist', async () => {
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
