import { UserServiceImpl } from '@users-ms/users/application/user.service.impl';
import { User } from '@users-ms/users/domain';
import {
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  UserNotFoundError,
} from '@users-ms/users/exceptions';
import { UserRepository } from '@users-ms/users/user.repository';

jest.mock('@users-ms/users/user.repository');

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    userService = new UserServiceImpl(userRepositoryMock);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      userRepositoryMock.findByEmail.mockResolvedValue(null);

      userRepositoryMock.save.mockResolvedValue({
        id: '1234',
      } as unknown as User);

      // Act
      const userId = await userService.createUser(
        'John',
        'Doe',
        new Date('2000-01-01'),
        'john.doe@example.com',
        'password',
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
      expect(userRepositoryMock.save).toHaveBeenCalled();
    });

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
      // Arrange
      userRepositoryMock.findByEmail.mockResolvedValue({
        email: 'john.doe@example.com',
      } as User);

      // Act
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

      // Assert
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user profile successfully', async () => {
      // Arrange
      const existingUser = {
        id: '1234',
        email: 'old.email@example.com',
        updateProfile: jest.fn(),
      } as unknown as User;
      userRepositoryMock.findById.mockResolvedValue(existingUser);
      userRepositoryMock.findByEmail.mockResolvedValue(null);

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
      userRepositoryMock.findById.mockResolvedValue(null);

      // Act
      await expect(
        userService.updateUser('1234', 'new.email@example.com', 'Updated bio'),
      ).rejects.toThrow(UserNotFoundError);

      // Assert
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw EmailUpdateConflictError if the email is the same', async () => {
      // Arrange
      const existingUser = {
        id: '1234',
        email: 'new.email@example.com',
      } as unknown as User;
      userRepositoryMock.findById.mockResolvedValue(existingUser);

      // Act
      await expect(
        userService.updateUser('1234', 'new.email@example.com', 'Updated bio'),
      ).rejects.toThrow(EmailUpdateConflictError);

      // Assert
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
      expect(userRepositoryMock.findByEmail).not.toHaveBeenCalled();
      expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should throw EmailAlreadyInUseError if email is already used by another user', async () => {
      // Arrange
      const existingUser = {
        id: '1234',
        email: 'old.email@example.com',
      } as unknown as User;
      userRepositoryMock.findById.mockResolvedValue(existingUser);
      userRepositoryMock.findByEmail.mockResolvedValue({
        email: 'new.email@example.com',
      } as User);

      // Act
      await expect(
        userService.updateUser('1234', 'new.email@example.com', 'Updated bio'),
      ).rejects.toThrow(EmailAlreadyInUseError);

      // Assert
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
      const existingUser = {
        id: '1234',
        firstName: 'John',
        lastName: 'Doe',
      } as unknown as User;
      userRepositoryMock.findById.mockResolvedValue(existingUser);

      // Act
      const result = await userService.getUserProfile('1234');

      // Assert
      expect(result).toEqual(existingUser);
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
      // Arrange
      userRepositoryMock.findById.mockResolvedValue(null);

      // Act
      await expect(userService.getUserProfile('1234')).rejects.toThrow(
        UserNotFoundError,
      );

      // Assert
      expect(userRepositoryMock.findById).toHaveBeenCalledWith('1234');
    });
  });
});
