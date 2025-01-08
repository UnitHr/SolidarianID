import { Column, Entity } from 'cassandra-for-nest';
import { envs } from '../../../../config';

@Entity({
  keyspace: envs.cassandraKeyspace, // Cassandra Keyspace
  table: 'community_statistics', // Cassandra Table
})
export default class CommunityStatistics {
  @Column({ name: 'community_id' })
  communityId: string; // Community ID

  @Column({ name: 'community_name' })
  communityName: string; // Name of the community

  @Column({ name: 'support_count' })
  supportCount: number; // Total supports received for community actions

  @Column({ name: 'actions_target_total' })
  actionsTargetTotal: number; // Sum of the targets of the actions

  @Column({ name: 'actions_achieved_total' })
  actionsAchievedTotal: number; // Sum of the achievements of the actions
}
