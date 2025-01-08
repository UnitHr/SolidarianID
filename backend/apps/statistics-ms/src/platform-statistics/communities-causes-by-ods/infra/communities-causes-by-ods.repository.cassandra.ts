import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { CommunitiesCausesByOdsMapper } from '../communities-causes-by-ods.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class CommunitiesCausesByOdsRepository extends BaseService<Persistence.CommunitiesCausesByOds> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.CommunitiesCausesByOds) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.CommunitiesCausesByOds);
  }

  public async findAllEntities(): Promise<Domain.CommunitiesCausesByOds[]> {
    const results = await this.findAll();
    return results.map(CommunitiesCausesByOdsMapper.toDomain);
  }
}
