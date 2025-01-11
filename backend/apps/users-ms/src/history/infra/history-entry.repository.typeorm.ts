import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { HistoryEntry as DomainHistoryEntry } from '../domain/HistoryEntry';
import { ActivityType } from '../domain/ActivityType';
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

  async findByUserIdEntityIdTypeAndStatus(
    userId: string,
    entityId: string,
    type: ActivityType,
    status: EntryStatus,
  ): Promise<DomainHistoryEntry> {
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

  async findByUserIdWithFilters(
    userId: string,
    type?: ActivityType,
    status?: EntryStatus,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<DomainHistoryEntry[]> {
    const query = this.historyEntryRepository
      .createQueryBuilder('history_entry')
      .where('history_entry.userId = :userId', { userId });

    if (type) {
      query.andWhere('history_entry.type = :type', { type });
    }

    if (status) {
      query.andWhere('history_entry.status = :status', { status });
    }

    const entries = await query
      .orderBy('history_entry.timestamp', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return entries.map(HistoryEntryMapper.toDomain);
  }

  async countByUserIdWithFilters(
    userId: string,
    type?: ActivityType,
    status?: EntryStatus,
  ): Promise<number> {
    const query = this.historyEntryRepository
      .createQueryBuilder('history_entry')
      .where('history_entry.userId = :userId', { userId });

    if (type) {
      query.andWhere('history_entry.type = :type', { type });
    }

    if (status) {
      query.andWhere('history_entry.status = :status', { status });
    }

    return query.getCount();
  }

  async existsUserJoinCommunityRequestWithAdmin(
    userId: string,
    JOIN_COMMUNITY_REQUEST_SENT: ActivityType,
    adminId: string,
  ): Promise<boolean> {
    const entry = await this.historyEntryRepository.findOne({
      where: {
        userId,
        type: JOIN_COMMUNITY_REQUEST_SENT,
        metadata: { adminId },
      },
    });

    return !!entry;
  }
}
