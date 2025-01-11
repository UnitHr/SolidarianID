/* eslint-disable import/no-cycle */
import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { EntryStatus, ActivityType } from '@users-ms/history/domain';

@Entity()
export class HistoryEntry {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  @Index()
  type: ActivityType;

  @Column('uuid')
  entityId: string;

  @Column('timestamp')
  @Index()
  timestamp: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EntryStatus,
    nullable: true,
  })
  @Index()
  status?: EntryStatus;

  @Column('jsonb', { nullable: true })
  metadata: {
    adminId?: string;
    entityName?: string;
    description?: string;
    amount?: number;
    volunteerHours?: number;
    location?: string;
    role?: string;
  };
}
