import { HistoryEntry } from '@users-ms/history/infra/persistence';
import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  recipientId: string;

  @Column('boolean', { default: false })
  read: boolean;

  @Column('uuid')
  @Index()
  historyEntryId: string;

  @ManyToOne(() => HistoryEntry)
  @JoinColumn({ name: 'historyEntryId' })
  historyEntry: HistoryEntry;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  timestamp: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
