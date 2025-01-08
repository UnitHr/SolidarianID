import { envs } from 'apps/statistics-ms/src/config';
import { Column, Entity } from 'cassandra-for-nest';

@Entity({
  keyspace: envs.cassandraKeyspace, // Cassandra Keyspace
  table: 'actions_by_community', // Cassandra Table
})
export default class ActionByCommunityId {
  @Column({ name: 'community_id' })
  communityId: string; // Community ID

  @Column({ name: 'cause_id' })
  causeId: string; // Cause ID

  @Column({ name: 'action_id' })
  actionId: string; // Action ID

  @Column({ name: 'action_name' })
  actionName: string; // Action Name

  @Column({ name: 'target' })
  target: number; // Target value for the action

  @Column({ name: 'achieved' })
  achieved: number; // Achieved value for the action
}
