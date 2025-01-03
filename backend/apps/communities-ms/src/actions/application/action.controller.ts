import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { ActionService } from './action.service';
import { UpdateActionDto } from '../dto/update-action.dto';
import { CreateActionDto } from '../dto/create-action.dto';
import { ActionMapper } from '../mapper/action.mapper';
import { QueryPaginationDto } from '../dto/query-pagination.dto';
import { PaginatedResponse } from '@common-lib/common-lib/dto/paginated-response.dto';
import { ActionDto } from '../dto/action.dto';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { ActionDomainExceptionFilter } from '../infra/filters/action-domain-exception.filter';

@Controller('actions')
@UseFilters(ActionDomainExceptionFilter)
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Public()
  @Post()
  async createAction(
    @Body() createActionDto: CreateActionDto,
    @Res() res: Response,
  ) {
    const {
      type,
      title,
      description,
      causeId,
      target,
      unit,
      goodType,
      location,
      date,
    } = createActionDto;

    const result = await this.actionService.createAction(
      type,
      title,
      description,
      causeId,
      target,
      unit,
      goodType,
      location,
      date,
    );

    const locationUrl = `/actions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
    @Res() res: Response,
  ) {
    await this.actionService.updateAction(id, updateActionDto);
    const locationUrl = `/actions/${id}`;
    res.status(HttpStatus.NO_CONTENT).location(locationUrl).send();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const action = await this.actionService.getActionDetails(id);

    res.status(HttpStatus.OK).json([action]);
  }

  @Public()
  @Get()
  async findAll(@Query() query: QueryPaginationDto) {
    const page = query.page || 1;
    const size = query.size || 10;

    const offset = (page - 1) * size;
    const limit = size;

    const { data, total } = await this.actionService.getPaginatedActions(
      offset,
      limit,
    );

    const paginatedResponse = new PaginatedResponse(
      data.map((action) => ActionMapper.toDTO(action)),
      total,
      page,
      size,
    );

    return paginatedResponse;
  }

  @Get('cause/:causeId')
  async findByCause(@Param('causeId') causeId: string) {
    const actions = await this.actionService.listActionsByCause(causeId);
    return actions.map(ActionMapper.toDTO);
  }

  @Public()
  @Patch(':actionId/contribute')
  async makeContribution(
    @Param('actionId') actionId: string,
    @Body() contributionDto: CreateContributionDto,
    @Res() res: Response,
  ) {
    const { userId, date, amount, unit } = contributionDto;

    const result = await this.actionService.makeContribution(
      userId,
      actionId,
      date,
      amount,
      unit,
    );

    const locationUrl = `/actions/${actionId}/contributions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }
}
