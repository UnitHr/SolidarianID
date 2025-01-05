/**
 * This file contains utility functions used throughout the application.
 * These utilities are intended to be used globally to ensure consistency.
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
    return parseFloat(((amount / totalAmount) * 100).toFixed(2));
  }

  static getPaginationLinks(
    endpoint: string,
    offset: number,
    limit: number,
  ): { prev?: string; next: string } {
    const links: { prev?: string; next: string } = {
      next: `${endpoint}?offset=${offset + limit}&limit=${limit}`,
    };

    if (offset > 0 && offset > limit) {
      links.prev = `${endpoint}?offset=${offset - limit}&limit=${limit}`;
    }

    return links;
  }
}
