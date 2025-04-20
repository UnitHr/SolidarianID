import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EventPublisher } from '@nestjs/cqrs';
import { HistoryEntry } from '../domain/HistoryEntry';
import { ActivityType } from '../domain/ActivityType';
import { HistoryEntryRepository } from '../history-entry.repository';
import { HistoryService } from './history.service';
import { EntryStatus } from '../domain/HistoryEntryStatus';

@Injectable()
export class HistoryServiceImpl implements HistoryService {
  constructor(
    private readonly historyEntryRepository: HistoryEntryRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  private async saveEntryAndNotify(entry: HistoryEntry): Promise<void> {
    const savedEntry = await this.historyEntryRepository.save(entry);
    this.eventPublisher.mergeObjectContext(savedEntry);
    savedEntry.commit();
  }

  async getUserHistory(
    userId: string,
    type?: ActivityType,
    status?: EntryStatus,
    page?: number,
    limit?: number,
  ): Promise<{ entries: HistoryEntry[]; total: number }> {
    const [entries, total] = await Promise.all([
      this.historyEntryRepository.findByUserIdWithFilters(
        userId,
        type,
        status,
        page,
        limit,
      ),
      this.historyEntryRepository.countByUserIdWithFilters(
        userId,
        type,
        status,
      ),
    ]);

    return { entries, total };
  }

  async registerUserFollowed(
    userId: string,
    followedUserId: string,
    timestamp: Date,
    followedUserName?: string,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.USER_FOLLOWED,
      entityId: new UniqueEntityID(followedUserId),
      entityName: followedUserName,
      timestamp,
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerCommunityCreation(
    adminId: string,
    communityId: string,
    timestamp: Date,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(adminId),
      type: ActivityType.COMMUNITY_ADMIN,
      entityId: new UniqueEntityID(communityId),
      timestamp,
    });

    await this.saveEntryAndNotify(entry);
  }

  async registerActionContribute(
    userId: string,
    actionId: string,
    timestamp: Date,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.ACTION_CONTRIBUTED,
      entityId: new UniqueEntityID(actionId),
      timestamp,
    });

    await this.saveEntryAndNotify(entry);
  }

  async registerJoinCommunityRequest(
    userId: string,
    communityId: string,
    communityAdminId: string,
    timestamp: Date,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.JOIN_COMMUNITY_REQUEST_SENT,
      entityId: new UniqueEntityID(communityId),
      adminId: communityAdminId,
      status: EntryStatus.PENDING,
      timestamp,
    });

    await this.historyEntryRepository.save(entry);
  }

  private async archiveJoinCommunityPendingRequest(
    userId: string,
    communityId: string,
  ): Promise<void> {
    const pendingEntry =
      await this.historyEntryRepository.findByUserIdEntityIdTypeAndStatus(
        userId,
        communityId,
        ActivityType.JOIN_COMMUNITY_REQUEST_SENT,
        EntryStatus.PENDING,
      );

    pendingEntry.status = EntryStatus.ARCHIVED;
    await this.historyEntryRepository.save(pendingEntry);
  }

  async registerJoinCommunityRequestRejected(
    userId: string,
    communityId: string,
    timestamp: Date,
  ): Promise<void> {
    await this.archiveJoinCommunityPendingRequest(userId, communityId);

    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.JOIN_COMMUNITY_REQUEST_REJECTED,
      entityId: new UniqueEntityID(communityId),
      status: EntryStatus.REJECTED,
      timestamp,
    });

    await this.historyEntryRepository.save(entry);
  }

  async registerUserJoinedCommunity(
    userId: string,
    communityId: string,
    timestamp: Date,
  ): Promise<void> {
    await this.archiveJoinCommunityPendingRequest(userId, communityId);

    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.JOINED_COMMUNITY,
      entityId: new UniqueEntityID(communityId),
      timestamp,
    });

    await this.saveEntryAndNotify(entry);
  }

  async registerCauseCreation(
    userId: string,
    causeId: string,
    timestamp: Date,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.CAUSE_CREATED,
      entityId: new UniqueEntityID(causeId),
      timestamp,
    });

    await this.saveEntryAndNotify(entry);
  }

  async registerCauseSupported(
    userId: string,
    causeId: string,
    timestamp: Date,
  ): Promise<void> {
    const entry = HistoryEntry.create({
      userId: new UniqueEntityID(userId),
      type: ActivityType.CAUSE_SUPPORTED,
      entityId: new UniqueEntityID(causeId),
      timestamp,
    });

    await this.saveEntryAndNotify(entry);
  }

  async userHasJoinCommunityRequestWithAdmin(
    userId: string,
    adminId: string,
  ): Promise<boolean> {
    return this.historyEntryRepository.existsUserJoinCommunityRequestWithAdmin(
      userId,
      ActivityType.JOIN_COMMUNITY_REQUEST_SENT,
      adminId,
    );
  }
}
