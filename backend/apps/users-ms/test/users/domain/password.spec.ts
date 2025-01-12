import { UserPassword } from '@users-ms/users/domain/Password';
import { InvalidPasswordError } from '@users-ms/users/exceptions';

describe('Equivalence partitioning tests for UserPassword.create', () => {
  // Valid partition tests (Passwords that meet the pattern)
  it('Should accept a valid password that meets the pattern', async () => {
    // Arrange
    const validPassword = '123456Test*';

    // Act
    const userPassword = await UserPassword.create(validPassword);

    // Assert
    expect(userPassword).toBeInstanceOf(UserPassword);
  });

  // Invalid partition tests (Passwords that do not meet the pattern)
  it('Should throw InvalidPasswordError for passwords with less than 8 characters', async () => {
    // Arrange
    const shortPassword = 'Pass1*';

    // Act & Assert
    await expect(UserPassword.create(shortPassword)).rejects.toThrow(
      InvalidPasswordError,
    );
  });

  it('Should throw InvalidPasswordError for passwords with only letters', async () => {
    // Arrange
    const passwordWithLettersOnly = 'password';

    // Act & Assert
    await expect(UserPassword.create(passwordWithLettersOnly)).rejects.toThrow(
      InvalidPasswordError,
    );
  });

  it('Should throw InvalidPasswordError for passwords with only numbers', async () => {
    // Arrange
    const passwordWithNumbersOnly = '12345678';

    // Act & Assert
    await expect(UserPassword.create(passwordWithNumbersOnly)).rejects.toThrow(
      InvalidPasswordError,
    );
  });

  it('Should throw InvalidPasswordError for passwords with only special characters', async () => {
    // Arrange
    const passwordWithSpecialChars = '****@@!!';

    // Act & Assert
    await expect(UserPassword.create(passwordWithSpecialChars)).rejects.toThrow(
      InvalidPasswordError,
    );
  });
});

describe('Password length boundary tests', () => {
  it('Should accept a valid password with an exact length of 8 characters', async () => {
    // Arrange
    const validPassword = '123Test*';

    // Act
    const userPassword = await UserPassword.create(validPassword);

    // Assert
    expect(userPassword).toBeInstanceOf(UserPassword);
  });

  it('Should throw InvalidPasswordError for passwords with less than 8 characters', async () => {
    // Arrange
    const shortPassword = '123Tes*';

    // Act & Assert
    await expect(UserPassword.create(shortPassword)).rejects.toThrow(
      InvalidPasswordError,
    );
  });
  it('Should accept a valid password with a length of 9 characters', async () => {
    // Arrange
    const validPassword = '1234Test*';

    // Act
    const userPassword = await UserPassword.create(validPassword);

    // Assert
    expect(userPassword).toBeInstanceOf(UserPassword);
  });
});

describe('UserPassword fromHashedPassword method', () => {
  it('Should create password from hashed value', () => {
    // Arrange
    const hashedPassword = '$2b$10$someHashedPasswordValue';

    // Act
    const userPassword = UserPassword.fromHashedPassword(hashedPassword);

    // Assert
    expect(userPassword).toBeInstanceOf(UserPassword);
    expect(userPassword.value).toBe(hashedPassword);
  });
});

describe('UserPassword compare method', () => {
  it('Should correctly compare matching passwords', async () => {
    // Arrange
    const plainPassword = '123456Test*';
    const userPassword = await UserPassword.create(plainPassword);

    // Act
    const isMatch = await userPassword.compare(plainPassword);

    // Assert
    expect(isMatch).toBe(true);
  });

  it('Should correctly compare non-matching passwords', async () => {
    // Arrange
    const originalPassword = '123456Test*';
    const wrongPassword = '123456Test#';
    const userPassword = await UserPassword.create(originalPassword);

    // Act
    const isMatch = await userPassword.compare(wrongPassword);

    // Assert
    expect(isMatch).toBe(false);
  });
});
