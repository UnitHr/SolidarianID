import {
  Body,
  Controller,
  Get,
  HttpStatus,
  // Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
// import { JwtService } from '@nestjs/jwt';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { CommunityService } from './community.service';
import * as Exceptions from '../exceptions';

@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    // private readonly jwtService: JwtService,
  ) {}

  @Post()
  async createCommunityRequest(
    // @Headers('authorization') authHeader: string,
    @Body() createCommunityDto: CreateCommunityDto,
    @Res() res: Response,
  ) {
    // const token = authHeader.split(' ')[1];
    // const payload = this.jwtService.decode(token);

    const result = await this.communityService.createCommunityRequest({
      userId: '123',
      communityName: createCommunityDto.name,
      communityDescription: createCommunityDto.description,
      causeTitle: createCommunityDto.cause.title,
      causeDescription: createCommunityDto.cause.description,
      causeEndDate: createCommunityDto.cause.end,
      causeOds: createCommunityDto.cause.ods,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.CommunityNameIsTaken:
          res.status(HttpStatus.CONFLICT);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
      }
    } else {
      const request = result.value;

      if (request.isFailure) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({ errors: { message: request.errorValue() } });
        return;
      }

      const location = `/communities/create-request/${request.getValue().id.toString()}`;
      res.status(HttpStatus.CREATED);
      res.location(location);
    }
  }

  @Get(':id')
  async getCommunity(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const result = await this.communityService.getCommunity(id);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.CommunityNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
      }
    } else {
      const community = result.value.getValue();

      res.status(HttpStatus.OK);
      res.json({
        data: {
          id: community.id.toString(),
          adminId: community.adminId,
          name: community.name,
          description: community.description,
          members: community.members,
          causes: community.causes,
        },
      });
    }
  }
}
