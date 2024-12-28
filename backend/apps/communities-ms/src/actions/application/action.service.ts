import { Injectable } from '@nestjs/common';
import { ActionDto } from '../dto/action.dto';
import { CreateActionDto } from '../dto/create-action.dto';
import { UpdateActionDto } from '../dto/update-action.dto';

// TODO: addapt to DDD
@Injectable()
export abstract class ActionService {
  abstract createAction(
    createActionDto: CreateActionDto,
  ): Promise<{ id: string }>;

  abstract updateAction(
    id: string,
    updateActionDto: UpdateActionDto,
  ): Promise<void>;

  abstract getActionDetails(id: string): Promise<ActionDto>;

  abstract listActionsByCause(causeId: string): Promise<ActionDto[]>;
}
