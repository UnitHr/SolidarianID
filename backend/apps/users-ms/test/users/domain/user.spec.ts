import { User, UserProps } from '@users-ms/users/domain/User';
import { UserBirthDate } from '@users-ms/users/domain/UserBirthDate';
import { UserPassword } from '@users-ms/users/domain/Password';
import { UserEmail } from '@users-ms/users/domain/UserEmail';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { MissingPropertiesError } from '@users-ms/users/exceptions';
import { InvalidEmailError } from '@users-ms/users/exceptions/invalid-email.error';

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

    it('should throw MissingPropertiesError with correct message', async () => {
      // Arrange
      const props = await createValidProps();
      delete props.firstName;

      // Act & Assert
      expect(() => User.create(props)).toThrow(
        '[User] Missing properties to create a new user.',
      );
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

    it('should not call UserEmail.create if the new email is the same as the current email', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const originalEmail = user.email;

      const createSpy = jest.spyOn(UserEmail, 'create');

      // Act
      user.updateProfile({ email: originalEmail });

      // Assert
      expect(createSpy).not.toHaveBeenCalled();
      expect(user.email).toBe(originalEmail);
    });

    it('should not update email when email is undefined', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const originalEmail = user.email;

      // Act
      user.updateProfile({ bio: 'new bio' });

      // Assert
      expect(user.email).toBe(originalEmail);
    });

    it('should not update email when email is null', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const originalEmail = user.email;

      // Act
      user.updateProfile({ email: null });

      // Assert
      expect(user.email).toBe(originalEmail);
    });

    it('should trim bio when updating', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const bioWithSpaces = '  bio with spaces  ';

      // Act
      user.updateProfile({ bio: bioWithSpaces });

      // Assert
      expect(user.bio).toBe('bio with spaces');
    });

    it('trows InvalidEmailError when email is not valid', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const originalEmail = user.email;

      // Act
      expect(() => user.updateProfile({ email: 'invalid-email' })).toThrow(
        InvalidEmailError,
      );
      expect(user.email).toBe(originalEmail);
    });
  });

  describe('getters and setters', () => {
    it('should set and get email correctly', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const newEmail = 'new@example.com';

      // Act
      user.email = newEmail;

      // Assert
      expect(user.email).toBe(newEmail);
    });

    it('should set and get password correctly', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const newPassword = await UserPassword.create('NewPass123!');

      // Act
      user.password = newPassword;

      // Assert
      expect(user.userPassword).toBe(newPassword);
      expect(user.password).toBe(newPassword.value);
    });

    it('should set and get bio correctly', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const newBio = 'New bio';

      // Act
      user.bio = newBio;

      // Assert
      expect(user.bio).toBe(newBio);
    });

    it('should set and get role correctly', async () => {
      // Arrange
      const user = User.create(await createValidProps());
      const newRole = 'admin';

      // Act
      user.role = newRole;

      // Assert
      expect(user.role).toBe(newRole);
    });

    it('should get age from birthDate correctly', async () => {
      // Arrange
      const birthDate = UserBirthDate.create(new Date('1990-01-01'));
      const props = await createValidProps();
      const user = User.create({ ...props, birthDate });

      // Act & Assert
      expect(user.age).toBe(birthDate.age);
    });
  });

  describe('isValidPassword', () => {
    it('should validate password correctly', async () => {
      // Arrange
      const password = 'ValidPass123!';
      const props = await createValidProps();
      props.password = await UserPassword.create(password);
      const user = User.create(props);

      // Act & Assert
      await expect(user.isValidPassword(password)).resolves.toBe(true);
      await expect(user.isValidPassword('WrongPass123!')).resolves.toBe(false);
    });
  });
});
