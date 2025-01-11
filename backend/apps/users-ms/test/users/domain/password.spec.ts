import { UserPassword } from '@users-ms/users/domain/Password';
import { InvalidPasswordError } from '@users-ms/users/exceptions';

describe('Equivalence partitioning tests for UserPassword.create', () => {
  // Valid partition tests (Passwords that meet the pattern)
  it('Should accept a valid password that meets the pattern', async () => {
    const validPassword = '123456Test*';

    const userPassword = await UserPassword.create(validPassword);

    expect(userPassword).toBeInstanceOf(UserPassword);
  });

  // Invalid partition tests (Passwords that do not meet the pattern)
  it('Should throw InvalidPasswordError for passwords with less than 8 characters', async () => {
    const shortPassword = 'Pass1*';

    await expect(UserPassword.create(shortPassword)).rejects.toThrow(
      InvalidPasswordError,
    );
  });

  it('Should throw InvalidPasswordError for passwords with only letters', async () => {
    const passwordWithLettersOnly = 'password';

    await expect(UserPassword.create(passwordWithLettersOnly)).rejects.toThrow(
      InvalidPasswordError,
    );
  });

  it('Should throw InvalidPasswordError for passwords with only numbers', async () => {
    const passwordWithNumbersOnly = '12345678';

    await expect(UserPassword.create(passwordWithNumbersOnly)).rejects.toThrow(
      InvalidPasswordError,
    );
  });

  it('Should throw InvalidPasswordError for passwords with only special characters', async () => {
    const passwordWithSpecialChars = '****@@!!';

    await expect(UserPassword.create(passwordWithSpecialChars)).rejects.toThrow(
      InvalidPasswordError,
    );
  });
});

describe('Password length boundary tests', () => {
  it('Should accept a valid password with an exact length of 8 characters', async () => {
    const validPassword = '123Test*';

    const userPassword = await UserPassword.create(validPassword);

    expect(userPassword).toBeInstanceOf(UserPassword);
  });

  it('Should throw InvalidPasswordError for passwords with less than 8 characters', async () => {
    const shortPassword = '123Tes*';

    await expect(UserPassword.create(shortPassword)).rejects.toThrow(
      InvalidPasswordError,
    );
  });
});
