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
} from '@nestjs/common';
import { Response } from 'express';
import { ActionService } from './action.service';
import { UpdateActionDto } from '../dto/update-action.dto';
import { EconomicContributionDto } from '../dto/contributions/create-economic-contribution.dto';
import {
  CreateEconomicActionDto,
  CreateGoodsCollectionActionDto,
  CreateVolunteerActionDto,
} from '../dto/create-action.dto';
import { ContributionService } from './contribution.service';
import { GoodsContributionDto } from '../dto/contributions/create-goods-contribution.dto';
import { VolunteerContributionDto } from '../dto/contributions/create-volunteer-contribution.dto';
import { ActionMapper } from '../mapper/action.mapper';
import { QueryPaginationDto } from '../dto/query-pagination.dto';
import { PaginatedResponse } from '../dto/PaginatedResponse';
import { ActionDto } from '../dto/action.dto';

@Controller('actions')
export class ActionController {
  constructor(
    private readonly actionService: ActionService,
    private readonly contributionService: ContributionService,
  ) {}

  @Post('economic')
  async createEconomicAction(
    @Body() createActionDto: CreateEconomicActionDto,
    @Res() res: Response,
  ) {
    const { title, description, causeId, targetAmount } = createActionDto;

    const result = await this.actionService.createEconomicAction(
      title,
      description,
      causeId,
      targetAmount,
    );

    const locationUrl = `/actions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }

  @Post('goodsCollection')
  async createGoodsCollectionAction(
    @Body() createActionDto: CreateGoodsCollectionActionDto,
    @Res() res: Response,
  ) {
    const { title, description, causeId, goodType, quantity, unit } =
      createActionDto;

    const result = await this.actionService.createGoodsCollectionAction(
      title,
      description,
      causeId,
      goodType,
      quantity,
      unit,
    );

    const locationUrl = `/actions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }

  @Post('volunteer')
  async createVolunteerAction(
    @Body() createActionDto: CreateVolunteerActionDto,
    @Res() res: Response,
  ) {
    const { title, description, causeId, targetVolunteers, location, date } =
      createActionDto;

    const result = await this.actionService.createVolunteerAction(
      title,
      description,
      causeId,
      targetVolunteers,
      location,
      date,
    );

    const locationUrl = `/actions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }

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

  // TODO: find by filters

  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
    // @Res() res: Response,
  ) {
    const page = query.page || 1;
    const size = query.size || 10;

    const offset = (page - 1) * size;
    const limit = size;

    const { data, total } = await this.actionService.getPaginatedActions(
      offset,
      limit,
    );

    const paginatedResponse: PaginatedResponse<ActionDto> = {
      data: data.map((action) => ActionMapper.toDTO(action)),
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / size),
        currentPage: page,
        pageSize: size,
      },
    };

    return paginatedResponse;

    // res.status(HttpStatus.OK).json(paginatedResponse);
  }

  @Get('cause/:causeId')
  async findByCause(@Param('causeId') causeId: string) {
    const actions = await this.actionService.listActionsByCause(causeId);
    return actions.map(ActionMapper.toDTO);
  }

  @Patch(':actionId/contribute/economic')
  async makeEconomicContribution(
    @Param('actionId') actionId: string,
    @Body() contributionDto: EconomicContributionDto,
    @Res() res: Response,
  ) {
    const { userId, date, description, donatedAmount } = contributionDto;

    const result = await this.contributionService.makeEconomicContribution(
      userId,
      actionId,
      date,
      donatedAmount,
      description,
    );

    const locationUrl = `/actions/${actionId}/contributions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }

  @Patch(':actionId/contribute/goodsCollection')
  async makeGoodsCollectionContribution(
    @Param('actionId') actionId: string,
    @Body() contributionDto: GoodsContributionDto,
    @Res() res: Response,
  ) {
    const { userId, date, description, goodType, donatedQuantity, unit } =
      contributionDto;

    const result =
      await this.contributionService.makeGoodsCollectionContribution(
        userId,
        actionId,
        date,
        goodType,
        donatedQuantity,
        unit,
        description,
      );

    const locationUrl = `/actions/${actionId}/contributions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }

  @Patch(':actionId/contribute/volunteer')
  async makeVolunteerContribution(
    @Param('actionId') actionId: string,
    @Body() contributionDto: VolunteerContributionDto,
    @Res() res: Response,
  ) {
    const {
      userId,
      date,
      description,
      volunteerNumber,
      hoursContributed,
      task,
      location,
    } = contributionDto;

    const result = await this.contributionService.makeVolunteerContribution(
      userId,
      actionId,
      date,
      volunteerNumber,
      hoursContributed,
      task,
      location,
      description,
    );

    const locationUrl = `/actions/${actionId}/contributions/${result.id}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ id: result.id });
  }
}
