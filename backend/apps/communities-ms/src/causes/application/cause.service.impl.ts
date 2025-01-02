import { Injectable, Logger } from '@nestjs/common';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseRepository } from '../cause.repository';
import { CauseService } from './cause.service';
import { Cause, CauseEndDate } from '../domain';

@Injectable()
export class CauseServiceImpl implements CauseService {
  constructor(private readonly causeRepository: CauseRepository) {}

  logger = new Logger(CauseServiceImpl.name);

  getAllCauses(): Promise<Cause[]> {
    return this.causeRepository.findAll();
  }

  async createCause(
    title: string,
    description: string,
    ods: ODSEnum[],
    endDate: Date,
    communityId: string,
    createdBy: string,
  ): Promise<string> {
    // Create a new cause
    const cause = Cause.create({
      title,
      description,
      ods,
      endDate: CauseEndDate.create(endDate),
      communityId,
      createdBy,
    });

    // Create the new cause and save it
    const savedCause = await this.causeRepository.save(cause);

    // Return the ID of the newly created cause
    return savedCause.id.toString();
  }

  validateCauseEndDate(endDate: Date): boolean {
    try {
      CauseEndDate.create(endDate);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  getCause(id: string): Promise<Cause> {
    return this.causeRepository.findById(id);
  }

  async updateCause(
    id: string,
    description?: string,
    ods?: ODSEnum[],
  ): Promise<void> {
    // Find the existing cause by ID
    const existingCause = await this.causeRepository.findById(id);

    // Update optional fields if provided
    existingCause.description = description ?? existingCause.description;
    existingCause.ods = ods ?? existingCause.ods;

    // Update the changes in the repository
    await this.causeRepository.save(existingCause);
  }

  async getCauseSupporters(id: string): Promise<string[]> {
    const cause = await this.getCause(id);
    return cause.supportersIds;
  }

  async addCauseSupporter(id: string, userId: string): Promise<void> {
    const cause = await this.getCause(id);
    cause.addSupporter(userId);
    await this.causeRepository.save(cause);
  }

  async getCauseActions(id: string): Promise<string[]> {
    const cause = await this.getCause(id);
    return cause.actionsIds;
  }

  async addCauseAction(): Promise<void> {
    // TODO: Implement this method
  }
}
