import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import ODS from '@common-lib/common-lib/common/ods';
import { CauseRepository } from '../cause.repository';
import { Cause } from '../domain';
import { CauseService } from './cause.service';
import { CauseMapper } from '../cause.mapper';
import { CauseDto } from '../dto/cause.dto';

@Injectable()
export class CauseServiceImpl implements CauseService {
  constructor(private readonly causeRepository: CauseRepository) {}

  async createCause(
    title: string,
    description: string,
    communityId: string,
    ods: number[],
  ): Promise<{ id: string }> {
    // Check if a cause with the same title already exists in the community
    const existingCauses =
      await this.causeRepository.findByCommunityId(communityId);
    const causeWithTitle = existingCauses.find(
      (cause) => cause.title === title,
    );
    if (causeWithTitle) {
      throw new ConflictException(
        'A cause with this title already exists in the community',
      );
    }

    // Validate ODS
    CauseServiceImpl.validateOds(ods);

    // Create the new cause
    const cause = Cause.create({
      title,
      description,
      communityId,
      ods,
    });

    // Save the new cause in the repository
    const savedCause = await this.causeRepository.save(cause);

    return { id: savedCause.id.toString() };
  }

  async updateCause(
    id: string,
    description?: string,
    ods?: number[],
  ): Promise<void> {
    // Find the existing cause by ID
    const existingCause = await this.causeRepository.findById(id);
    if (!existingCause) {
      throw new NotFoundException('Cause not found');
    }

    // Update optional fields if provided
    if (description) {
      existingCause.description = description;
    }
    if (ods) {
      CauseServiceImpl.validateOds(ods); // Validate the ODS before updating
      existingCause.ods = ods;
    }

    // Update the changes in the repository
    await this.causeRepository.update(existingCause);
  }

  async getCauseDetails(id: string): Promise<CauseDto> {
    // Find the cause by ID
    const cause = await this.causeRepository.findById(id);
    if (!cause) {
      throw new NotFoundException('Cause not found');
    }

    // Convert the cause to DTO and return it
    return CauseMapper.toDTO(cause);
  }

  async listCausesByCommunity(communityId: string): Promise<CauseDto[]> {
    // Find all causes associated with the community
    const causes = await this.causeRepository.findByCommunityId(communityId);

    if (!causes || causes.length === 0) {
      throw new NotFoundException('No causes found for the given community ID');
    }

    // Map the entities to DTOs
    return causes.map(CauseMapper.toDTO);
  }

  private static validateOds(ods: number[]): void {
    // Check for duplicates in the provided ODS array
    const uniqueOds = new Set(ods);
    if (uniqueOds.size !== ods.length) {
      throw new ConflictException('Duplicate ODS IDs are not allowed');
    }

    // Check if all ODS IDs are valid
    // TODO: Revisar si el ID es valido en el emun ODS
    ods.forEach((odsId) => {
      if (!ODS[odsId]) {
        throw new ConflictException(`ODS ID ${odsId} is not valid`);
      }
    });
  }
}
