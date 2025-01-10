import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { HistoryEntry } from '../domain/HistoryEntry';
import { HistoryEntryType } from '../domain/HistoryEntryType';
import { HistoryEntryRepository } from '../domain/history-entry.repository';
import { HistoryService, GetHistoryOptions } from './history.service';
import { EntryStatus } from '../domain/HistoryEntryStatus';

@Injectable()
export class HistoryServiceImpl implements HistoryService {
  constructor(
    private readonly historyEntryRepository: HistoryEntryRepository,
  ) {}

  async getUserHistory(
    userId: string,
    options?: GetHistoryOptions,
  ): Promise<{ entries: HistoryEntry[]; total: number }> {
    const { page = 1, limit = 10, type } = options ?? {};

    // TODO: review - this could be improved
    const [entries, total] = await Promise.all([
      type
        ? this.historyEntryRepository.findByUserIdAndType(
            userId,
            type,
            page,
            limit,
          )
        : this.historyEntryRepository.findByUserId(userId, page, limit),
      type
        ? this.historyEntryRepository.countByUserIdAndType(userId, type)
        : this.historyEntryRepository.countByUserId(userId),
    ]);

    return { entries, total };
  }

  async registerUserFollowed(
    userId: string,
    followedUserId: string,
    followedUserName?: string,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.USER_FOLLOWED,
      entityId: new UniqueEntityID(followedUserId),
      metadata: followedUserName ? { entityName: followedUserName } : undefined,
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerCommunityCreation(
    adminId: string,
    communityId: string,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(adminId),
      type: HistoryEntryType.COMMUNITY_ADMIN,
      entityId: new UniqueEntityID(communityId),
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerActionContribute(
    userId: string,
    actionId: string,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.ACTION_CONTRIBUTED,
      entityId: new UniqueEntityID(actionId),
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerJoinCommunityRequest(
    userId: string,
    communityId: string,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.JOIN_COMMUNITY_REQUEST_SENT,
      entityId: new UniqueEntityID(communityId),
      status: EntryStatus.PENDING,
    });

    await this.historyEntryRepository.save(entry);
  }

  private async archiveJoinCommunityPendingRequest(
    userId: string,
    communityId: string,
  ): Promise<void> {
    const pendingEntry =
      await this.historyEntryRepository.findByEntityIdTypeAndStatus(
        userId,
        communityId,
        HistoryEntryType.JOIN_COMMUNITY_REQUEST_SENT,
        EntryStatus.PENDING,
      );

    pendingEntry.status = EntryStatus.ARCHIVED;
    await this.historyEntryRepository.save(pendingEntry);
  }

  async registerJoinCommunityRequestRejected(
    userId: string,
    communityId: string,
  ): Promise<void> {
    await this.archiveJoinCommunityPendingRequest(userId, communityId);

    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.JOIN_COMMUNITY_REQUEST_REJECTED,
      entityId: new UniqueEntityID(communityId),
      status: EntryStatus.REJECTED,
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerUserJoinedCommunity(
    userId: string,
    communityId: string,
  ): Promise<void> {
    await this.archiveJoinCommunityPendingRequest(userId, communityId);

    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.JOINED_COMMUNITY,
      entityId: new UniqueEntityID(communityId),
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerCauseCreation(userId: string, causeId: string): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.CAUSE_CREATED,
      entityId: new UniqueEntityID(causeId),
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerCauseSupported(userId: string, causeId: string): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: HistoryEntryType.CAUSE_SUPPORTED,
      entityId: new UniqueEntityID(causeId),
    });

    await this.historyEntryRepository.save(entry);
  }
}
