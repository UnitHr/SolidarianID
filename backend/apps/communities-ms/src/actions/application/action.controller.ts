import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateActionDto } from '../dto/create-action.dto';
import { ActionService } from './action.service';
import { UpdateActionDto } from '../dto/update-action.dto';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  async create(@Body() createActionDto: CreateActionDto) {
    const result = await this.actionService.createAction(createActionDto);
    return {
      id: result.id,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
    return this.actionService.updateAction(id, updateActionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionService.getActionDetails(id);
  }

  @Get('cause/:causeId')
  findByCause(@Param('causeId') causeId: string) {
    return this.actionService.listActionsByCause(causeId);
  }
}
