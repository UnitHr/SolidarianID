import { Injectable } from '@nestjs/common';
import { InjectClient, InjectMapper, BaseService } from 'cassandra-for-nest';
import { Client, mapping } from 'cassandra-driver';
import { OdsCommunityMapper } from '../mapper/ods-community.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';

@Injectable()
export default class OdsCommunityRepository extends BaseService<Persistence.OdsCommunity> {
  constructor(
    @InjectClient() client: Client, // Inyect the Cassandra client
    @InjectMapper(Persistence.OdsCommunity) mapper: mapping.Mapper, // Inyect the Cassandra mapper
  ) {
    super(client, mapper, Persistence.OdsCommunity);
  }

  async findById(communityId: string): Promise<Domain.OdsCommunity | null> {
    const community = await this.findOne({ communityId });
    if (!community) {
      return null;
    }
    return OdsCommunityMapper.toDomain(community);
  }

  async save(community: Domain.OdsCommunity): Promise<void> {
    await this.save(community);
  }
}
