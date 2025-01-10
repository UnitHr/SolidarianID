import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { HistoryEntry as DomainHistoryEntry } from '../domain/HistoryEntry';
import { HistoryEntryType } from '../domain/HistoryEntryType';
import { HistoryEntryRepository } from '../domain/history-entry.repository';
import { HistoryEntry } from './persistence/HistoryEntry';
import { HistoryEntryMapper } from '../history-entry.mapper';
import { EntryStatus } from '../domain/HistoryEntryStatus';

@Injectable()
export class HistoryEntryRepositoryTypeorm extends HistoryEntryRepository {
  constructor(
    @InjectRepository(HistoryEntry)
    private readonly historyEntryRepository: TypeOrmRepository<HistoryEntry>,
  ) {
    super();
  }

  async save(entity: DomainHistoryEntry): Promise<DomainHistoryEntry> {
    const persistenceEntity = await this.historyEntryRepository.save(
      HistoryEntryMapper.toPersistence(entity),
    );
    return HistoryEntryMapper.toDomain(persistenceEntity);
  }

  async findById(id: string): Promise<DomainHistoryEntry> {
    const entry = await this.historyEntryRepository.findOneBy({ id });
    if (!entry) {
      throw new EntityNotFoundError(`HistoryEntry with id ${id} not found`);
    }
    return HistoryEntryMapper.toDomain(entry);
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<DomainHistoryEntry[]> {
    const entries = await this.historyEntryRepository.find({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { timestamp: 'DESC' },
    });
    return entries.map(HistoryEntryMapper.toDomain);
  }

  async findByUserIdAndType(
    userId: string,
    type: HistoryEntryType,
    page = 1,
    limit = 10,
  ): Promise<DomainHistoryEntry[]> {
    const entries = await this.historyEntryRepository.find({
      where: { userId, type },
      skip: (page - 1) * limit,
      take: limit,
      order: { timestamp: 'DESC' },
    });
    return entries.map(HistoryEntryMapper.toDomain);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.historyEntryRepository.count({
      where: { userId },
    });
  }

  async countByUserIdAndType(
    userId: string,
    type: HistoryEntryType,
  ): Promise<number> {
    return this.historyEntryRepository.count({
      where: { userId, type },
    });
  }

  async findByEntityIdTypeAndStatus(
    userId: string,
    entityId: string,
    type: HistoryEntryType,
    status: EntryStatus,
  ): Promise<DomainHistoryEntry | null> {
    const entry = await this.historyEntryRepository.findOne({
      where: {
        userId,
        entityId,
        type,
        status,
      },
    });

    if (!entry) {
      throw new EntityNotFoundError(
        `HistoryEntry with userId ${userId}, entityId ${entityId}, type ${type} and status ${status} not found`,
      );
    }
    return HistoryEntryMapper.toDomain(entry);
  }
}
