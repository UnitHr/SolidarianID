/**
 * @file This module exports various utility functions used across the application.
 * @module common/utils
 *
 * @description This module provides a collection of utility functions used throughout the application.
 */

export class Utils {
  static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  }

  static calculateAverage(amount: number, totalAmount: number): number {
    if (totalAmount === 0) {
      return 0;
    }
    return parseFloat(((amount / totalAmount) * 100).toFixed(2));
  }
}
