import { ActivityType } from '@users-ms/history/domain';
import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  userId: string;

  @Column('enum', { enum: ActivityType })
  activityType: ActivityType;

  @Column('uuid')
  primaryEntityId: string;

  @Column('uuid', { nullable: true })
  secondaryEntityId: string;

  @Column('boolean', { default: false })
  read: boolean;

  @Column('uuid')
  @Index()
  historyEntryId: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  timestamp: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
