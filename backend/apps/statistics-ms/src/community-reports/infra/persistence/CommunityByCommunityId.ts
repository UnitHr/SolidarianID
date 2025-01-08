import { envs } from 'apps/statistics-ms/src/config';
import { Column, Entity } from 'cassandra-for-nest';

@Entity({
  keyspace: envs.cassandraKeyspace, // Cassandra Keyspace
  table: 'communities_by_community_id', // Cassandra Table
})
export default class CommunityByCommunityId {
  @Column({ name: 'community_id' })
  communityId: string; // Community ID

  @Column({ name: 'community_name' })
  communityName: string; // Name of the community

  @Column({ name: 'admin_id' })
  adminId: string; // Admin User ID

  @Column({ name: 'members_count' })
  membersCount: number; // Total number of members

  @Column({ name: 'ods' })
  ods: Set<number>; // Set of Sustainable Development Goals (SDGs)
}
