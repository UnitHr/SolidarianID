import { Utils } from '../../src/common/utils';

describe('Utils', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-20').getTime());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should calculate age correctly for birthday already passed this year', () => {
    const birthDate = new Date('1990-02-15');
    expect(Utils.calculateAge(birthDate)).toBe(34);
  });

  it('should calculate age correctly for birthday not yet passed this year', () => {
    const birthDate = new Date('1990-04-15');
    expect(Utils.calculateAge(birthDate)).toBe(33);
  });

  it('should calculate age correctly for birthday today', () => {
    const birthDate = new Date('1990-03-20');
    expect(Utils.calculateAge(birthDate)).toBe(34);
  });

  it('should calculate age correctly for birthday tomorrow', () => {
    const birthDate = new Date('1990-03-21');
    expect(Utils.calculateAge(birthDate)).toBe(33);
  });

  it('should calculate age correctly for birthday yesterday', () => {
    const birthDate = new Date('1990-03-19');
    expect(Utils.calculateAge(birthDate)).toBe(34);
  });

  it('should calculate age correctly for leap year birthday (Feb 29)', () => {
    const birthDate = new Date('2000-02-29');
    expect(Utils.calculateAge(birthDate)).toBe(24);
  });

  it('should calculate age correctly for December 31st birthday', () => {
    const birthDate = new Date('1990-12-31');
    expect(Utils.calculateAge(birthDate)).toBe(33);
  });

  it('should calculate age correctly for January 1st birthday', () => {
    const birthDate = new Date('1990-01-01');
    expect(Utils.calculateAge(birthDate)).toBe(34);
  });

  describe('calculateAverage', () => {
    it('should calculate percentage correctly', () => {
      expect(Utils.calculateAverage(25, 100)).toBe(25.0);
    });

    it('should handle decimal results', () => {
      expect(Utils.calculateAverage(33, 100)).toBe(33.0);
    });

    it('should round to 2 decimal places', () => {
      expect(Utils.calculateAverage(1, 3)).toBe(33.33);
    });

    it('should handle large numbers', () => {
      expect(Utils.calculateAverage(1000000, 2000000)).toBe(50.0);
    });

    it('should handle small decimal numbers', () => {
      expect(Utils.calculateAverage(0.1, 1)).toBe(10.0);
    });

    it('should return 100 for equal amounts', () => {
      expect(Utils.calculateAverage(100, 100)).toBe(100.0);
    });

    it('should handle zero amount', () => {
      expect(Utils.calculateAverage(0, 100)).toBe(0.0);
    });

    it('should handle negative amount', () => {
      expect(Utils.calculateAverage(-50, 200)).toBe(-25.0);
    });

    it('should throw an error for zero total amount', () => {
      expect(() => Utils.calculateAverage(50, 0)).toThrow(
        'Total amount must be greater than zero',
      );
    });

    it('should throw an error for negative total amount', () => {
      expect(() => Utils.calculateAverage(50, -100)).toThrow(
        'Total amount must be greater than zero',
      );
    });
  });
});
