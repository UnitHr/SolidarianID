import { OdsStatistics } from '../domain';

export abstract class OdsStatisticsService {
  abstract getAll(): Promise<OdsStatistics[]>;

  abstract getTotalSupports(): Promise<number>;
}
