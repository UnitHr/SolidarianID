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
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import * as Exceptions from '../exceptions';
import { QueryPaginationDto } from '../../../../../libs/common-lib/src/dto/query-pagination.dto';
import { CreateCommunityService } from './create-community.service';

@Controller('communities/creation-requests')
export class CreateCommunityController {
  constructor(
    private readonly createCommunityService: CreateCommunityService,
  ) {}

  @Get()
  async getCreateCommunityRequests(
    @Query() query: QueryPaginationDto,
    @Res() res: Response,
  ) {
    const { offset = 0, limit = 10 } = query;
    const results =
      await this.createCommunityService.getCreateCommunityRequests(
        offset,
        limit,
      );

    if (results.isFailure) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.json({ errors: { message: results.getValue } });
      res.send();
      return;
    }

    const data = results
      .getValue()
      .map((request) => ({ id: request.id.toString() }));

    const links = Utils.getPaginationLinks(
      'communities/creation-requests',
      offset,
      limit,
    );

    res.status(HttpStatus.OK);
    res.json({ data, links });
    res.send();
  }

  @Get(':id')
  async getCreateCommunityRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const result =
      await this.createCommunityService.getCreateCommunityRequest(id);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.CreateCommunityRequestNotFound:
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
      const request = result.value.getValue();

      res.status(HttpStatus.OK);
      res.json({
        data: {
          id: request.id.toString(),
          userId: request.userId,
          name: request.communityName,
          description: request.communityDescription,
          cause: {
            title: request.causeTitle,
            description: request.causeDescription,
            end: request.causeEndDate,
            ods: request.causeOds,
          },
          status: request.status,
          comment: request.comment,
        },
      });
      res.send();
    }
  }

  @Post(':id')
  async validateCreateCommunityRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() validateCommunityDto: ValidateCommunityDto,
    @Res() res: Response,
  ) {
    const result =
      await this.createCommunityService.validateCreateCommunityRequest(
        id,
        validateCommunityDto.status,
        validateCommunityDto.comment,
      );

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.CreateCommunityRequestNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
          return;
        case Exceptions.CommentIsMandatory:
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
      const newCommunity = result.value.getValue();

      if (!newCommunity) {
        res.status(HttpStatus.OK);
        res.send();
        return;
      }

      const location = `/communities/${newCommunity.id.toString()}`;
      res.status(HttpStatus.CREATED);
      res.location(location);
      res.send();
    }
  }
}
