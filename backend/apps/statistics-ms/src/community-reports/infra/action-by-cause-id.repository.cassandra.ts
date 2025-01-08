import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { ActionByCauseIdMapper } from '../mapper/action-by-cause-id.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class ActionByCauseIdRepository extends BaseService<Persistence.ActionByCauseId> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.ActionByCauseId) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.ActionByCauseId);
  }

  async findManyByCauseId(causeId: string): Promise<Domain.ActionByCauseId[]> {
    const entities = await this.findMany({ causeId });
    return entities.map(ActionByCauseIdMapper.toDomain);
  }
}
