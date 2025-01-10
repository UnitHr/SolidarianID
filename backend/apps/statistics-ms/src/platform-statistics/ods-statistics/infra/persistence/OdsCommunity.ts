import { Entity, Column } from 'cassandra-for-nest';
import { envs } from '../../../../config';

@Entity({
  keyspace: envs.cassandraKeyspace,
  table: 'ods_community',
})
export class OdsCommunity {
  @Column({ name: 'ods_id' })
  odsId: number; // ODS Identifier

  @Column({ name: 'community_id' })
  communityId: string; // Community Identifier
}
