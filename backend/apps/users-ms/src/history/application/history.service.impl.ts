import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { HistoryRepository } from '../history.repository';
import { History } from '../domain/History';
import { HistoryService } from './history.service';

@Injectable()
export class HistoryServiceImpl implements HistoryService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async createHistory(userId: string): Promise<string> {
    const history = History.create({
      userId: new UniqueEntityID(userId),
      entries: [],
    });
    await this.historyRepository.save(history);
    return history.id.toString();
  }

  async getHistoryByUserId(userId: string): Promise<History> {
    return this.historyRepository.findByUserId(userId);
  }

  async registerUserFollowed(
    userId: string,
    followedUserId: string,
  ): Promise<void> {
    const history = await this.historyRepository.findByUserId(userId);
    history.addEntryUserFollowed(followedUserId);
    await this.historyRepository.save(history);
  }

  async registerCommunityCreation(
    adminId: string,
    communityId: string,
  ): Promise<void> {
    const history = await this.historyRepository.findByUserId(adminId);
    history.addEntryCommunityCreation(communityId);
    await this.historyRepository.save(history);
  }

  async registerActionContribute(
    userId: string,
    actionId: string,
  ): Promise<void> {
    const history = await this.historyRepository.findByUserId(userId);
    history.addEntryActionContribute(actionId);
    await this.historyRepository.save(history);
  }
}
