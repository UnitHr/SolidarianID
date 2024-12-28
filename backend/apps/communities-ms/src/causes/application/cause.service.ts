import { CauseDto } from '../dto/cause.dto';

export abstract class CauseService {
  abstract createCause(
    title: string,
    description: string,
    communityId: string,
    ods: number[],
  ): Promise<{ id: string }>;

  abstract updateCause(
    id: string,
    description?: string,
    ods?: number[],
  ): Promise<void>;

  abstract getCauseDetails(id: string): Promise<CauseDto>;

  abstract listCausesByCommunity(communityId: string): Promise<CauseDto[]>;
}
