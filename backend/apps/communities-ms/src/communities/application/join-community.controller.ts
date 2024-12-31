import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Utils } from '@common-lib/common-lib/common/utils';
import { JoinCommunityService } from './join-community.service';
import { QueryPaginationDto } from '../../../../../libs/common-lib/src/dto/query-pagination.dto';
import * as Exceptions from '../exceptions';
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import { JoinCommunityDto } from '../dto/join-community.dto';

@Controller('communities/join-request')
export class JoinCommunityController {
  constructor(private readonly joinCommunityService: JoinCommunityService) {}

  @Post()
  async joinCommunityRequest(
    @Body()
    joinCommunityRequest: JoinCommunityDto,
    @Res() res: Response,
  ) {
    const result =
      await this.joinCommunityService.joinCommunityRequest(
        joinCommunityRequest,
      );

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.CommunityNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        case Exceptions.JoinCommunityRequestAlreadyExists:
          res.status(HttpStatus.CONFLICT);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        case Exceptions.UserIsAlreadyMember:
          res.status(HttpStatus.CONFLICT);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
      }
    } else {
      const request = result.value.getValue();

      const location = `/communities/join-request/${request.id.toString()}`;
      res.status(HttpStatus.CREATED);
      res.location(location);
    }
  }

  @Get()
  async getJoinCommunityRequests(
    @Query() query: QueryPaginationDto,
    @Res() res: Response,
  ) {
    const { offset = 0, limit = 10 } = query;
    const results = await this.joinCommunityService.getJoinCommunityRequests(
      offset,
      limit,
    );

    if (results.isFailure) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.json({ errors: { message: results.getValue } });
      return;
    }

    const data = results
      .getValue()
      .map((request) => ({ id: request.id.toString() }));

    const links = Utils.getPaginationLinks(
      'communities/join-request',
      offset,
      limit,
    );

    res.status(HttpStatus.OK);
    res.json({ data, links });
  }

  @Get(':id')
  async getJoinCommunityRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const result = await this.joinCommunityService.getJoinCommunityRequest(id);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.JoinCommunityRequestNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
      }
    } else {
      const request = result.value.getValue();

      res.status(HttpStatus.OK);
      res.json({
        data: {
          id: request.id.toString(),
          userId: request.userId,
          communityId: request.communityId,
          status: request.status,
          comment: request.comment,
        },
      });
    }
  }

  @Post(':id')
  async validateJoinCommunityRequest(
    // @Headers('authorization') authHeader: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() validateCommunityDto: ValidateCommunityDto,
    @Res() res: Response,
  ) {
    // const token = authHeader.split(' ')[1];
    // const payload = this.jwtService.decode(token);

    const result = await this.joinCommunityService.validateJoinCommunityRequest(
      id,
      validateCommunityDto.status,
      validateCommunityDto.comment,
    );

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.JoinCommunityRequestNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        case Exceptions.CommentIsMandatory:
          res.status(HttpStatus.BAD_REQUEST);
          res.json({ errors: { message: error.errorValue().message } });
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
      }
    } else {
      res.status(HttpStatus.CREATED);
    }
  }
}
