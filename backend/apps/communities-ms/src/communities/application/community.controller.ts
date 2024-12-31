import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  HttpStatus,
  // Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { CommunityService } from './community.service';
import * as Exceptions from '../exceptions';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import * as jwt from 'jsonwebtoken'; 
import {envs} from '../../config';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { JwtPayload } from '@common-lib/common-lib/auth/payload';
import { userInfo } from 'os';

@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
  ) {}

  @Post()
  async createCommunityRequest(
    @Req() request: Request,
    @Body() createCommunityDto: CreateCommunityDto,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header

    // Create the community request
    const result = await this.communityService.createCommunityRequest({
      userId: '1',
      communityName: createCommunityDto.name,
      communityDescription: createCommunityDto.description,
      causeTitle: createCommunityDto.cause.title,
      causeDescription: createCommunityDto.cause.description,
      causeEndDate: createCommunityDto.cause.end,
      causeOds: createCommunityDto.cause.ods,
    });

    if (result.isLeft()) {
      const error = result.value;

      // Handle the error
      switch (error.constructor) {
        case Exceptions.CommunityNameIsTaken:
          res.status(HttpStatus.CONFLICT);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
      }
    } else {
      // Return the location of the created resource
      const request = result.value;

      if (request.isFailure) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({ errors: { message: request.errorValue() } });
        res.send();
        return;
      }

      const location = `/communities/create-request/${request.getValue().id.toString()}`;
      res.status(HttpStatus.CREATED);
      res.location(location);
      res.send();
    }
  }

  @Public()
  @Get(':id')
  async getCommunity(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    // Get the community
    const result = await this.communityService.getCommunity(id);

    if (result.isLeft()) {
      const error = result.value;

      // Handle the error
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
      // Return the community
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

  private getTokenPayload(req: Request) {
    return req.user as JwtPayload
  }
}
