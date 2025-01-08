/* eslint-disable import/no-cycle */
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { HistoryEntry } from './HistoryEntry';

@Entity()
export class History {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @OneToMany(() => HistoryEntry, (entry) => entry.history, {
    cascade: true,
    eager: true,
  })
  entries: HistoryEntry[];
}
