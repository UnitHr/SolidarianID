import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
  Query,
  UseFilters,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { ActionService } from './action.service';
import { UpdateActionDto } from '../dto/update-action.dto';
import * as Mapper from '../mapper';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { ActionDomainExceptionFilter } from '../infra/filters/action-domain-exception.filter';
import { FindActionsDto } from '../dto/find-actions.dto';

@Controller('actions')
@UseFilters(ActionDomainExceptionFilter)
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @ApiOperation({ summary: 'Get all actions, sort and filter' })
  @Public()
  @Get()
  async findAll(
    @Query() query: FindActionsDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { name, status, sortBy, sortDirection, page, limit } = query;

    const { data, total } = await this.actionService.getAllActions(
      name,
      status,
      sortBy,
      sortDirection,
      page,
      limit,
    );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    const response = new PaginatedResponseDto(
      data.map(Mapper.ActionMapper.toDTO),
      total,
      page,
      limit,
      baseUrl,
    );

    res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({ summary: 'Get details of a specific action by id' })
  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const action = await this.actionService.getActionDetails(id);

    const actionDto = Mapper.ActionMapper.toDTO(action);
    res.status(HttpStatus.OK).json(actionDto);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActionDto: UpdateActionDto,
    @Res() res: Response,
  ) {
    const { title, description, target } = updateActionDto;

    await this.actionService.updateAction(id, title, description, target);
    const locationUrl = `/actions/${id}`;
    res.status(HttpStatus.NO_CONTENT).location(locationUrl).send();
  }

  @ApiExcludeEndpoint()
  @Post(':id/contributions')
  async makeContribution(
    @Param('id', ParseUUIDPipe) actionId: string,
    @Body() contributionDto: CreateContributionDto,
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
    const { date, amount, unit } = contributionDto;

    const result = await this.actionService.makeContribution(
      userId,
      actionId,
      date,
      amount,
      unit,
    );

    const locationUrl = `/actions/${actionId}/contributions/${result}`;
    res.status(HttpStatus.CREATED).location(locationUrl).json({ id: result });
  }

  @ApiExcludeEndpoint()
  @Get(':id/contributions')
  async getContributions(
    @Param('id', ParseUUIDPipe) actionId: string,
    @Query() queryPagination: QueryPaginationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = queryPagination;

    const { data, total } = await this.actionService.getContributions(
      actionId,
      page,
      limit,
    );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data.map(Mapper.ContributionMapper.toDTO),
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK).json(response);
  }
}
