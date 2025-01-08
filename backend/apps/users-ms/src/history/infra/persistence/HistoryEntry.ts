/* eslint-disable import/no-cycle */
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { HistoryEntryStatus, HistoryEntryType } from '@users-ms/history/domain';
import { History } from './History';

@Entity()
export class HistoryEntry {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: HistoryEntryType,
  })
  type: HistoryEntryType;

  @Column('uuid')
  entityId: string;

  @Column('timestamp')
  timestamp: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: HistoryEntryStatus,
    default: HistoryEntryStatus.ACTIVE,
  })
  status: HistoryEntryStatus;

  @ManyToOne(() => History, (history) => history.entries)
  @JoinColumn({ name: 'historyId' })
  history: History;
}
