import { UserBirthDate } from '@users-ms/users/domain/UserBirthDate';
import { InvalidDateProvidedError } from '@common-lib/common-lib/core/exceptions';
import { UnderageUserError } from '@users-ms/users/exceptions/under-age-user.error';
import { AGE_OF_MAJORITY } from '@common-lib/common-lib/common/constant';

describe('UserBirthDate', () => {
  describe('create', () => {
    it('should create a valid UserBirthDate object for someone exactly at age of majority', () => {
      // Arrange
      const date = new Date();
      date.setFullYear(date.getFullYear() - AGE_OF_MAJORITY);

      // Act
      const birthDate = UserBirthDate.create(date);

      // Assert
      expect(birthDate).toBeInstanceOf(UserBirthDate);
      expect(birthDate.value).toEqual(date);
      expect(birthDate.age).toEqual(AGE_OF_MAJORITY);
    });

    it('should create a valid UserBirthDate object for someone one year above age of majority', () => {
      // Arrange
      const date = new Date();
      date.setFullYear(date.getFullYear() - (AGE_OF_MAJORITY + 1));

      // Act
      const birthDate = UserBirthDate.create(date);

      // Assert
      expect(birthDate).toBeInstanceOf(UserBirthDate);
      expect(birthDate.value).toEqual(date);
      expect(birthDate.age).toEqual(AGE_OF_MAJORITY + 1);
    });

    it('should create a valid UserBirthDate object for someone well above age of majority', () => {
      // Arrange
      const date = new Date();
      date.setFullYear(date.getFullYear() - (AGE_OF_MAJORITY + 10));
      // Act
      const birthDate = UserBirthDate.create(date);

      // Assert
      expect(birthDate).toBeInstanceOf(UserBirthDate);
      expect(birthDate.value).toEqual(date);
      expect(birthDate.age).toEqual(AGE_OF_MAJORITY + 10);
    });

    it('should throw UnderageUserError for users younger than age of majority', () => {
      // Arrange
      const date = new Date();
      date.setFullYear(date.getFullYear() - AGE_OF_MAJORITY + 1);

      // Act & Assert
      expect(() => UserBirthDate.create(date)).toThrow(UnderageUserError);
    });

    it('should throw InvalidDateProvidedError for invalid date', () => {
      // Arrange
      const invalidDate = new Date('invalid date');

      // Act & Assert
      expect(() => UserBirthDate.create(invalidDate)).toThrow(
        InvalidDateProvidedError,
      );
    });

    it('should throw InvalidDateProvidedError for non-Date objects', () => {
      // Arrange
      const notADate = '2000-01-01' as unknown as Date;

      // Act & Assert
      expect(() => UserBirthDate.create(notADate)).toThrow(
        InvalidDateProvidedError,
      );
    });

    it('should throw InvalidDateProvidedError for future dates', () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      // Act & Assert
      expect(() => UserBirthDate.create(futureDate)).toThrow(
        InvalidDateProvidedError,
      );
    });

    it('should accept user who just turned age of majority today', () => {
      // Arrange
      const today = new Date();
      const birthDate = new Date(
        today.getFullYear() - AGE_OF_MAJORITY,
        today.getMonth(),
        today.getDate(),
      );

      // Act
      const userBirthDate = UserBirthDate.create(birthDate);

      // Assert
      expect(userBirthDate.value).toEqual(birthDate);
    });

    it('should reject user who is one day short of age of majority', () => {
      // Arrange
      const today = new Date();
      const birthDate = new Date(
        today.getFullYear() - AGE_OF_MAJORITY,
        today.getMonth(),
        today.getDate() + 1,
      );

      // Act & Assert
      expect(() => UserBirthDate.create(birthDate)).toThrow(UnderageUserError);
    });

    it('should handle leap year birth dates correctly', () => {
      // Arrange
      const today = new Date();
      const leapYearBirthDate = new Date(
        today.getFullYear() - (AGE_OF_MAJORITY + 1),
        1, // February
        29,
      );

      // Act
      const userBirthDate = UserBirthDate.create(leapYearBirthDate);

      // Assert
      expect(userBirthDate.value).toEqual(leapYearBirthDate);
    });

    it('should handle birth dates on month boundaries', () => {
      // Arrange
      const today = new Date();
      const lastDayOfMonth = new Date(
        today.getFullYear() - (AGE_OF_MAJORITY + 1),
        0, // January
        31,
      );

      // Act
      const userBirthDate = UserBirthDate.create(lastDayOfMonth);

      // Assert
      expect(userBirthDate.value).toEqual(lastDayOfMonth);
    });

    it('should handle birth dates on year boundaries', () => {
      // Arrange
      const today = new Date();
      const newYearsEve = new Date(
        today.getFullYear() - (AGE_OF_MAJORITY + 1),
        11, // December
        31,
      );

      // Act
      const userBirthDate = UserBirthDate.create(newYearsEve);

      // Assert
      expect(userBirthDate.value).toEqual(newYearsEve);
    });
  });
});
