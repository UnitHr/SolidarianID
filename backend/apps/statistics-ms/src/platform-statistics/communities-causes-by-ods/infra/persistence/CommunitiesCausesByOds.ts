import { Column, Entity } from 'cassandra-for-nest';
import { envs } from '../../../../config';

@Entity({
  keyspace: envs.cassandraKeyspace, // Cassandra Keyspace
  table: 'communities_causes_by_ods', // Cassandra Table
})
export default class CommunitiesCausesByOds {
  @Column({ name: 'ods_id' })
  odsId: number; // ODS Identifier

  @Column({ name: 'communities_count' })
  communitiesCount: number; // Number of associated communities

  @Column({ name: 'causes_count' })
  causesCount: number; // Number of associated causes
}
