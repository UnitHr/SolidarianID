import { Column, Entity } from 'cassandra-for-nest';
import { envs } from '../../../../config';

@Entity({
  keyspace: envs.cassandraKeyspace, // Cassandra Keyspace
  table: 'ods_statistics', // Cassandra Table
})
export default class OdsStatistics {
  @Column({ name: 'ods_id' })
  odsId: number; // ODS Identifier

  @Column({ name: 'communities_count' })
  communitiesCount: number; // Number of associated communities

  @Column({ name: 'causes_count' })
  causesCount: number; // Number of associated causes

  @Column({ name: 'supports_count' })
  supportsCount: number; // Number of supports
}
