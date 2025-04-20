/* eslint-disable import/no-cycle */
import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { EntryStatus, ActivityType } from '@users-ms/history/domain';

@Entity()
@Index(['userId', 'type', 'status', 'timestamp'])
@Index(['adminId', 'type'])
@Index(['entityId', 'entityName'])
@Index(['userId', 'adminId', 'type'])
export class HistoryEntry {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  @Index()
  type: ActivityType;

  @Column('uuid')
  entityId: string;

  @Column('varchar', { nullable: true })
  @Index()
  entityName: string;

  @Column('uuid', { nullable: true })
  @Index()
  adminId: string; // This will work for the MVP, later we need to discus if we need to change it to a Hierarchy of this class based on the use cases

  @Column('timestamp')
  timestamp: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EntryStatus,
    nullable: true,
  })
  status?: EntryStatus;
}
