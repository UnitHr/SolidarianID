import { UserEmail } from '@users-ms/users/domain/UserEmail';
import { InvalidEmailError } from '@users-ms/users/exceptions/invalid-email.error';

describe('UserEmail', () => {
  describe('create', () => {
    it('should create a valid UserEmail object', () => {
      const email = 'test@example.com';
      const userEmail = UserEmail.create(email);

      expect(userEmail).toBeInstanceOf(UserEmail);
      expect(userEmail.value).toBe(email);
    });

    it('should convert email to lowercase', () => {
      const email = 'Test@Example.COM';
      const userEmail = UserEmail.create(email);

      expect(userEmail.value).toBe('test@example.com');
    });

    it('should throw InvalidEmailError for email without @', () => {
      const email = 'testexample.com';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email without domain', () => {
      const email = 'test@';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email without local part', () => {
      const email = '@example.com';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email with spaces', () => {
      const email = 'test @example.com';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for empty email', () => {
      const email = '';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email with multiple @ symbols', () => {
      const email = 'test@example@domain.com';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should throw InvalidEmailError for email with invalid characters', () => {
      const email = 'test!#$%@example.com';

      expect(() => UserEmail.create(email)).toThrow(InvalidEmailError);
    });

    it('should accept email with plus sign in local part', () => {
      const email = 'test+label@example.com';
      const userEmail = UserEmail.create(email);

      expect(userEmail.value).toBe('test+label@example.com');
    });

    it('should accept email with dots in local part', () => {
      const email = 'first.last@example.com';
      const userEmail = UserEmail.create(email);

      expect(userEmail.value).toBe('first.last@example.com');
    });
  });
});
