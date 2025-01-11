import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { OdsStatisticsMapper } from '../mapper/ods-statistics.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class OdsStatisticsRepository extends BaseService<Persistence.OdsStatistics> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.OdsStatistics) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.OdsStatistics);
  }

  public async findAllEntities(): Promise<Domain.OdsStatistics[]> {
    const results = await this.findAll();
    return results.map(OdsStatisticsMapper.toDomain);
  }

  async findOneEntity(odsId: number): Promise<Domain.OdsStatistics> | null {
    const entity = await this.findOne({ odsId });
    if (!entity) {
      return null;
    }
    return OdsStatisticsMapper.toDomain(entity);
  }

  async getTotalSupports(): Promise<number> {
    const cql = `SELECT SUM(supports_count) AS total_supports FROM ${this.keyspaceName}.${this.tableName}`;
    const result = await this.mapCqlAsExecution(cql, undefined, undefined)({});
    const totalSupports = result.first()?.['total_supports'] || 0;
    return totalSupports;
  }

  async saveOneEntity(odsStatistics: Domain.OdsStatistics): Promise<void> {
    const entity = OdsStatisticsMapper.toPersistence(odsStatistics);
    await this.saveOne(entity);
  }
}
