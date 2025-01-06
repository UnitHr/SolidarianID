import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { CommunityStatisticsMapper } from '../community-statistics.mapper';

@Injectable()
export default class CommunityStatisticsRepository extends BaseService<Persistence.CommunityStatistics> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.CommunityStatistics) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.CommunityStatistics);
  }

  public async findAllEntities(): Promise<Domain.CommunityStatistics[]> {
    const results = await this.findAll();
    return results.map(CommunityStatisticsMapper.toDomain);
  }

  async getTotalSupports(): Promise<number> {
    const cql = `SELECT SUM(support_count) AS total_supports FROM ${this.keyspaceName}.${this.tableName}`;
    const result = await this.mapCqlAsExecution(cql, undefined, undefined)({});
    const totalSupports = result.first()?.['total_supports'] || 0;
    return totalSupports;
  }
}
