/**
 * This file contains constant values used throughout the application.
 * These constants are intended to be used globally to ensure consistency.
 */

export const AGE_OF_MAJORITY = 18; // The age of majority in years

export const PASSWORD_PATTERN =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
// The pattern for a valid password requires:
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one digit
// - At least one special character
// - A minimum length of 8 characters

export const PASSWORD_HASH_SALT_ROUNDS = 10; // The number of rounds for hashing
