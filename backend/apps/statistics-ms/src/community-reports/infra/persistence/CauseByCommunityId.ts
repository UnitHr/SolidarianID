import { envs } from 'apps/statistics-ms/src/config';
import { Column, Entity } from 'cassandra-for-nest';

@Entity({
  keyspace: envs.cassandraKeyspace, // Cassandra Keyspace
  table: 'causes_by_community', // Cassandra Table
})
export default class CauseByCommunityId {
  @Column({ name: 'community_id' })
  communityId: string; // Community ID

  @Column({ name: 'cause_id' })
  causeId: string; // Cause ID

  @Column({ name: 'cause_name' })
  causeName: string; // Cause Name

  @Column({ name: 'supports_count' })
  supportsCount: number; // Number of supports received for the cause

  @Column({ name: 'ods' })
  ods: Set<number>; // Set of Sustainable Development Goals (SDGs)
}
