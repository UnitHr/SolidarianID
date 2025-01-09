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

  public async findOneEntity(
    communityId: string,
  ): Promise<Domain.CommunityStatistics> {
    const entity = await this.findOne({ communityId });

    if (!entity) {
      throw new Error(`Community statistics with id:${communityId} not found`);
    }

    return CommunityStatisticsMapper.toDomain(entity);
  }

  public async findAllEntities(): Promise<Domain.CommunityStatistics[]> {
    const entities = await this.findAll();
    return entities.map(CommunityStatisticsMapper.toDomain);
  }

  async getTotalSupports(): Promise<number> {
    const cql = `SELECT SUM(support_count) AS total_supports FROM ${this.keyspaceName}.${this.tableName}`;
    const result = await this.mapCqlAsExecution(cql, undefined, undefined)({});
    const totalSupports = result.first()?.['total_supports'] || 0;
    return totalSupports;
  }

  async save(communityStatistics: Domain.CommunityStatistics): Promise<void> {
    const entity = CommunityStatisticsMapper.toPersistence(communityStatistics);
    await this.saveOne(entity);
  }
}
