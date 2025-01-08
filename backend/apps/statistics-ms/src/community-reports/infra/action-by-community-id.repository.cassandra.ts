import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { ActionByCommunityIdMapper } from '../mapper/action-by-community-id.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class ActionByCommunityIdRepository extends BaseService<Persistence.ActionByCommunityId> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.ActionByCommunityId) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.ActionByCommunityId);
  }

  async findManyByCommunityId(
    communityId: string,
  ): Promise<Domain.ActionByCommunityId[]> {
    const entities = await this.findMany({ communityId });
    return entities.map(ActionByCommunityIdMapper.toDomain);
  }
}
