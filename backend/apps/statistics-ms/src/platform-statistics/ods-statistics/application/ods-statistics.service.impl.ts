import { Injectable } from '@nestjs/common';
import { OdsStatisticsService } from './ods-statistics.service';
import OdsStatisticsRepository from '../infra/ods-statistics.repository.cassandra';
import { OdsStatistics } from '../domain';

@Injectable()
export class OdsStatisticsServiceImpl implements OdsStatisticsService {
  constructor(
    private readonly odsStatisticsRepository: OdsStatisticsRepository,
  ) {}

  getAll(): Promise<OdsStatistics[]> {
    return this.odsStatisticsRepository.findAllEntities();
  }

  getTotalSupports(): Promise<number> {
    return this.odsStatisticsRepository.getTotalSupports();
  }
}
