import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Post,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  UseFilters,
  Query,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { CauseService } from './cause.service';
import { UpdateCauseDto } from '../dto/update-cause.dto';
import { CauseMapper } from '../cause.mapper';
import { CauseDomainExceptionFilter } from '../infra/filters/cause-domain-exception.filter';
import { FindCausesDto } from '../dto/find-causes.dto';
import { CreateActionDto } from '../dto/create-action.dto';

@Controller('causes')
@UseFilters(CauseDomainExceptionFilter)
export class CauseController {
  constructor(private readonly causeService: CauseService) {}

  @Public()
  @Get()
  async findAll(
    @Query() query: FindCausesDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const { ods, name, sortBy, sortDirection, page, limit } = query;

    const { data, total } = await this.causeService.getAllCauses(
      ods,
      name,
      sortBy,
      sortDirection,
      page,
      limit,
    );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data.map(CauseMapper.toDTO),
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK).json(response);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const cause = await this.causeService.getCause(id);

    const causeDto = CauseMapper.toDTO(cause);
    res.status(HttpStatus.OK).json(causeDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCauseDto: UpdateCauseDto,
    @Res() res: Response,
  ) {
    await this.causeService.updateCause(
      id,
      updateCauseDto.description,
      updateCauseDto.ods,
    );

    const locationUrl = `/causes/${id}`;
    res.status(HttpStatus.NO_CONTENT).location(locationUrl).send();
  }

  @Public()
  @Get(':id/actions')
  async getActions(
    @Param('id', ParseUUIDPipe) causeId: string,
    @Query() queryPagination: QueryPaginationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = queryPagination;

    const { data, total } = await this.causeService.getCauseActions(
      causeId,
      page,
      limit,
    );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data,
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK).json(response);
  }

  @Post(':id/actions')
  async createAction(
    @Body() createActionDto: CreateActionDto,
    @Param('id', ParseUUIDPipe) causeId: string,
    @Body('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    const { type, title, description, target, unit, goodType, location, date } =
      createActionDto;

    const createdBy = userId;

    const result = await this.causeService.addCauseAction(
      type,
      title,
      description,
      causeId,
      target,
      unit,
      createdBy,
      goodType,
      location,
      date,
    );

    const locationUrl = `/actions/${result}`;
    res.status(HttpStatus.CREATED).location(locationUrl).json({ id: result });
  }

  @Public()
  @Get(':id/supporters')
  async getSupporters(
    @Param('id', ParseUUIDPipe) causeId: string,
    @Query() queryPagination: QueryPaginationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = queryPagination;

    const { data, total } = await this.causeService.getCauseSupporters(
      causeId,
      page,
      limit,
    );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data,
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK).json(response);
  }

  @Post(':id/supporters')
  async addSupporter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    await this.causeService.addCauseSupporter(id, userId);

    const locationUrl = `/causes/${id}/supporters/${userId}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ causeId: id, userId });
  }
}
