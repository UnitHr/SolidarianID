import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionRepository } from '../action.repository';
import { ActionFactory } from '../domain/ActionFactory';
import { ActionDto } from '../dto/action.dto';
import { ActionMapper } from '../action.mapper';
import { CreateActionDto } from '../dto/create-action.dto';
import { ActionProps } from '../domain/Action';

// TODO: Error handling; duplicate check
@Injectable()
export class ActionServiceImpl implements ActionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  async createAction(
    createActionDto: CreateActionDto,
  ): Promise<{ id: string }> {
    const action = ActionFactory.createAction(
      createActionDto.type,
      createActionDto,
    );
    const savedAction = await this.actionRepository.save(action);

    return { id: savedAction.id.toString() };
  }

  async updateAction(
    id: string,
    updateActionDto: CreateActionDto,
  ): Promise<void> {
    const action = await this.actionRepository.findById(id);
    if (!action) {
      throw new NotFoundException('Action not found');
    }
    action.update(updateActionDto as unknown as ActionProps);
    await this.actionRepository.update(action);
  }

  async getActionDetails(id: string): Promise<ActionDto> {
    const action = await this.actionRepository.findById(id);
    if (!action) {
      throw new NotFoundException('Action not found');
    }

    return ActionMapper.toDTO(action);
  }

  async listActionsByCause(causeId: string): Promise<ActionDto[]> {
    const actions = await this.actionRepository.findByCauseId(causeId);
    if (!actions || actions.length === 0) {
      throw new NotFoundException('No actions found for this cause');
    }

    return actions.map(ActionMapper.toDTO);
  }
}
