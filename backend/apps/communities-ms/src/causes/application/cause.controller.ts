import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CauseService } from './cause.service';
import { CreateCauseDto } from '../dto/create-cause.dto';
import { UpdateCauseDto } from '../dto/update-cause.dto';

@Controller('causes')
export class CauseController {
  constructor(private readonly causeService: CauseService) {}

  // TODO: Return Location header with the URL of the newly created cause
  @Post()
  create(@Body() createCauseDto: CreateCauseDto) {
    return this.causeService.createCause(
      createCauseDto.title,
      createCauseDto.description,
      createCauseDto.communityId,
      createCauseDto.ods,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCauseDto: UpdateCauseDto) {
    return this.causeService.updateCause(
      id,
      updateCauseDto.description,
      updateCauseDto.ods,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.causeService.getCauseDetails(id);
  }

  @Get('community/:communityId')
  findByCommunity(@Param('communityId') communityId: string) {
    return this.causeService.listCausesByCommunity(communityId);
  }
}
