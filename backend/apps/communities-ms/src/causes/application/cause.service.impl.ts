import { Injectable } from '@nestjs/common';
import { CauseRepository } from '../cause.repository';
import { CauseService } from './cause.service';
import { Cause } from '../domain';

@Injectable()
export class CauseServiceImpl implements CauseService {
  constructor(private readonly causeRepository: CauseRepository) {}

  getAllCauses(): Promise<Cause[]> {
    return this.causeRepository.findAll();
  }

  getCause(id: string): Promise<Cause> {
    return this.causeRepository.findById(id);
  }

  async updateCause(
    id: string,
    description?: string,
    ods?: number[],
  ): Promise<void> {
    // Find the existing cause by ID
    const existingCause = await this.causeRepository.findById(id);

    // Update optional fields if provided
    existingCause.description = description ?? existingCause.description;
    existingCause.ods = ods ?? existingCause.ods;

    // Update the changes in the repository
    await this.causeRepository.update(existingCause);
  }

  async getCauseActions(id: string): Promise<string[]> {
    const cause = await this.getCause(id);
    return cause.actions;
  }

  async getCauseSupporters(id: string): Promise<string[]> {
    const cause = await this.getCause(id);
    return cause.supporters;
  }

  async addCauseSupporter(id: string, userId: string): Promise<void> {
    const cause = await this.getCause(id);
    cause.addSupporter(userId);
    await this.causeRepository.update(cause);
  }

  async createCauseAction(id: string, description: string): Promise<void> {
    // TODO: Implement this method
  }
}
