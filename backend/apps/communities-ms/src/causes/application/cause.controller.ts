import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CauseService } from './cause.service';
import { UpdateCauseDto } from '../dto/update-cause.dto';
import { CauseMapper } from '../cause.mapper';

@Controller('causes')
export class CauseController {
  constructor(private readonly causeService: CauseService) {}

  @Get()
  async findAll() {
    const causes = await this.causeService.getAllCauses();
    return causes.map(CauseMapper.toDTO);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const cause = await this.causeService.getCause(id);
    return CauseMapper.toDTO(cause);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCauseDto: UpdateCauseDto,
  ) {
    return this.causeService.updateCause(
      id,
      updateCauseDto.description,
      updateCauseDto.ods,
    );
  }

  @Get(':id/actions')
  getActions(@Param('id', ParseUUIDPipe) id: string) {
    return this.causeService.getCauseActions(id);
  }

  // TODO: Review later
  @Post(':id/actions')
  createAction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() action: { description: string },
  ) {
    return this.causeService.createCauseAction(id, action.description);
  }

  @Get(':id/supporters')
  getSupporters(@Param('id', ParseUUIDPipe) id: string) {
    return this.causeService.getCauseSupporters(id);
  }

  @Post(':id/supporters')
  addSupporter(@Param('id') id: string, @Body() userId: string) {
    return this.causeService.addCauseSupporter(id, userId);
  }
}
