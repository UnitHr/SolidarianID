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
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { userIdDto } from '@common-lib/common-lib/dto/user-id.dto';
import { CauseService } from './cause.service';
import { UpdateCauseDto } from '../dto/update-cause.dto';
import { CauseMapper } from '../cause.mapper';

@Controller('causes')
export class CauseController {
  constructor(private readonly causeService: CauseService) {}

  @Public()
  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    const causes = await this.causeService.getAllCauses();

    const causesDto = causes.map(CauseMapper.toDTO);
    res.status(HttpStatus.OK).json(causesDto);
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
  getActions(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const actionsIds = this.causeService.getCauseActions(id);

    res.status(HttpStatus.OK).json(actionsIds);
  }

  // TODO: Implement this method
  @Post(':id/actions')
  async createAction() {
    return this.causeService.addCauseAction();
  }

  @Public()
  @Get(':id/supporters')
  getSupporters(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const supportersIds = this.causeService.getCauseSupporters(id);

    res.status(HttpStatus.OK).json(supportersIds);
  }

  @Post(':id/supporters')
  async addSupporter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userDto: userIdDto,
    @Res() res: Response,
  ) {
    await this.causeService.addCauseSupporter(id, userDto.userId);

    const locationUrl = `/causes/${id}/supporters/${userDto.userId}`;
    res
      .status(HttpStatus.CREATED)
      .location(locationUrl)
      .json({ causeId: id, userId: userDto.userId });
  }
}
