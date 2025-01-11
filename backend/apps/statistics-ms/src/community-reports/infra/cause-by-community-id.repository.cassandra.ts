import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { CauseByCommunityIdMapper } from '../mapper/cause-by-community-id.repository.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class CauseByCommunityIdRepository extends BaseService<Persistence.CauseByCommunityId> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.CauseByCommunityId) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.CauseByCommunityId);
  }

  async findManyByCommunityId(
    communityId: string,
  ): Promise<Domain.CauseByCommunityId[]> {
    const entity = await this.findMany({ communityId });
    return entity.map(CauseByCommunityIdMapper.toDomain);
  }

  async findOneByCauseId(
    communityId: string,
    causeId: string,
  ): Promise<Domain.CauseByCommunityId> {
    const entity = await this.findOne({ communityId, causeId });
    return CauseByCommunityIdMapper.toDomain(entity);
  }

  async save(cause: Domain.CauseByCommunityId): Promise<void> {
    const entity = CauseByCommunityIdMapper.toPersistence(cause);
    return this.saveOne(entity);
  }
}
