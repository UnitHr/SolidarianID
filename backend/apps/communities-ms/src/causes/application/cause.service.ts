import { Cause } from '../domain';

export abstract class CauseService {
  abstract getAllCauses(): Promise<Cause[]>;

  abstract getCause(id: string): Promise<Cause>;

  abstract updateCause(
    id: string,
    description?: string,
    ods?: number[],
  ): Promise<void>;

  abstract getCauseActions(id: string): Promise<string[]>;

  abstract createCauseAction(id: string, description: string): Promise<void>;

  abstract getCauseSupporters(id: string): Promise<string[]>;

  abstract addCauseSupporter(id: string, userId: string): Promise<void>;
}
