import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Utils } from '@common-lib/common-lib/common/utils';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import { JoinCommunityService } from './join-community.service';
import { QueryPaginationDto } from '../../../../../libs/common-lib/src/dto/query-pagination.dto';
import * as Exceptions from '../exceptions';
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import { JoinCommunityDto } from '../dto/join-community.dto';

@Controller('communities/join-requests')
export class JoinCommunityController {
  constructor(private readonly joinCommunityService: JoinCommunityService) {}

  @Post()
  async joinCommunityRequest(
    @Req() req: Request,
    @Body()
    joinCommunityDto: JoinCommunityDto,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const userId = (req as any).user.sub.value;

    const result = await this.joinCommunityService.joinCommunityRequest(
      userId,
      joinCommunityDto.communityId,
    );

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case Exceptions.CommunityNotFound:
          res.status(HttpStatus.NOT_FOUND);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
          return;
        case Exceptions.JoinCommunityRequestAlreadyExists:
          res.status(HttpStatus.CONFLICT);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
          return;
        case Exceptions.UserIsAlreadyMember:
          res.status(HttpStatus.CONFLICT);
          res.json({ errors: { message: error.errorValue().message } });
          res.send();
          return;
        case Exceptions.JoinCommunityRequestDenied:
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
      const request = result.value.getValue();

      const location = `/communities/join-requests/${request.id.toString()}`;
      res.status(HttpStatus.CREATED);
      res.location(location);
      res.send();
    }
  }

  @Roles(Role.Admin)
  @Get('')
  async getJoinCommunityRequests(
    @Req() req: Request,
    @Query() query: QueryPaginationDto,
    @Body() joinCommunityDto: JoinCommunityDto,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const userId = (req as any).user.sub.value;

    // Check if the user is an admin of the community
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(
      userId,
      joinCommunityDto.communityId,
    );

    if (isCommunityAdmin.isLeft()) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        errors: { message: isCommunityAdmin.value.errorValue().message },
      });
      res.send();
      return;
    }

    // Call the service to get the requests
    const { offset = 0, limit = 10 } = query;
    const results = await this.joinCommunityService.getJoinCommunityRequests(
      offset,
      limit,
    );

    // Return the error
    if (results.isFailure) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.json({ errors: { message: results.getValue } });
      res.send();
      return;
    }

    // Return the requests
    const data = results
      .getValue()
      .map((request) => ({ id: request.id.toString() }));

    const links = Utils.getPaginationLinks(
      'communities/join-requests',
      offset,
      limit,
    );

    res.status(HttpStatus.OK);
    res.json({ data, links });
    res.send();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getJoinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const userId = (req as any).user.sub.value;

    // Check if the user is an admin of the community
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(
      userId,
      id,
    );

    if (isCommunityAdmin.isLeft()) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        errors: { message: isCommunityAdmin.value.errorValue().message },
      });
      res.send();
      return;
    }

    // Call the service to get the request
    const result = await this.joinCommunityService.getJoinCommunityRequest(id);

    if (result.isLeft()) {
      const error = result.value;

      // Return the error
      switch (error.constructor) {
        case Exceptions.JoinCommunityRequestNotFound:
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

      // Return the request
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
      res.send();
    }
  }

  @Roles(Role.Admin)
  @Post(':id')
  async validateJoinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() validateCommunityDto: ValidateCommunityDto,
    @Res() res: Response,
  ) {
    // Check if the user is an admin of the community
    const userId = (req as any).user.sub.value;
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(
      userId,
      id,
    );

    if (isCommunityAdmin.isLeft()) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        errors: { message: isCommunityAdmin.value.errorValue().message },
      });
      res.send();
      return;
    }

    // Call the service to accept the request
    const result = await this.joinCommunityService.validateJoinCommunityRequest(
      id,
      validateCommunityDto.status,
      validateCommunityDto.comment,
    );

    if (result.isLeft()) {
      const error = result.value;

      // Return the error
      switch (error.constructor) {
        case Exceptions.JoinCommunityRequestNotFound:
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
      // Return the success
      res.status(HttpStatus.CREATED);
      res.send();
    }
  }
}
