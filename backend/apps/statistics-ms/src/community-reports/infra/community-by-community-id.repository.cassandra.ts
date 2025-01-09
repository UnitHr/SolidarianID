import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { CommunityByCommunityIdMapper } from '../mapper/community-by-community-id.mapper';
import { CommunityNotFoundError } from '../exceptions';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class CommunityByCommunityIdRepository extends BaseService<Persistence.CommunityByCommunityId> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.CommunityByCommunityId) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.CommunityByCommunityId);
  }

  async findOneByCommunityId(
    communityId: string,
  ): Promise<Domain.CommunityByCommunityId> {
    const entity = await this.findOne({ communityId });

    // If the entity is not found, throw a CommunityNotFoundError
    if (!entity) {
      throw new CommunityNotFoundError(communityId);
    }

    return CommunityByCommunityIdMapper.toDomain(entity);
  }
}
