import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { Utils } from '@common-lib/common-lib/common/utils';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { CommunityService } from './community.service';
import * as Exceptions from '../exceptions';

@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  async createCommunityRequest(
    // @Headers('authorization') authHeader: string,
    @Body() createCommunityDto: CreateCommunityDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Get the user ID from the request
    const userId = (req as any).user.sub.value;

    // Create the community request
    const result = await this.communityService.createCommunityRequest({
      userId,
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
        case Exceptions.InvalidDateProvided:
          res.status(HttpStatus.BAD_REQUEST);
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

      const location = `/communities/creation-requests/${request.getValue().id.toString()}`;
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
          res.send();
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
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
        },
      });
      res.send();
    }
  }

  @Public()
  @Get(':id/members')
  async getCommunityMembers(
    @Body() query: QueryPaginationDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { offset = 0, limit = 10 } = query;

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

      const links = Utils.getPaginationLinks(
        'communities/creation-requests',
        offset,
        limit,
      );

      const data = {
        id: community.id.toString(),
        members: community.members.slice(offset, offset + limit),
      };

      res.status(HttpStatus.OK);
      res.json({ data, links });
    }
  }

  @Public()
  @Get(':id/causes')
  async getCommunityCauses(
    @Body() query: QueryPaginationDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { offset = 0, limit = 10 } = query;

    // Get the community
    const result = await this.communityService.getCommunity(id);

    if (result.isLeft()) {
      const error = result.value;

      // Handle the error
      switch (error.constructor) {
        case Exceptions.CommunityNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
      }
    } else {
      // Return the community
      const community = result.value.getValue();

      const links = Utils.getPaginationLinks(
        'communities/creation-requests',
        offset,
        limit,
      );

      const data = {
        id: community.id.toString(),
        members: community.causes.slice(offset, offset + limit),
      };

      res.status(HttpStatus.OK);
      res.json({ data, links });
    }
  }
}
