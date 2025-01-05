import { CommunitiesCausesByOds } from '../domain';

export abstract class CommunitiesCausesByOdsService {
  abstract getAll(): Promise<CommunitiesCausesByOds[]>;
}
