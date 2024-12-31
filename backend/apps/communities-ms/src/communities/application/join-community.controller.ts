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
import { JoinCommunityService } from './join-community.service';
import { QueryPaginationDto } from '../dto/query-pagination.dto';
import * as Exceptions from '../exceptions';
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import { JoinCommunityDto } from '../dto/join-community.dto';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import * as jwt from 'jsonwebtoken'; 
import { envs } from '@communities-ms/config';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';

@Controller('communities/join-request')
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
    const payload = this.getTokenPayload(req);

    const result =
      await this.joinCommunityService.joinCommunityRequest(payload.sub.toString(), joinCommunityDto.communityId);

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

  @Roles(Role.Admin)
  @Get('')
  async getJoinCommunityRequests(
    @Req() req: Request,
    @Query() query: QueryPaginationDto,
    @Body() joinCommunityDto: JoinCommunityDto,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const payload = this.getTokenPayload(req);
    
    // Check if the user is an admin of the community
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(payload.sub.toString(), joinCommunityDto.communityId);

    if(isCommunityAdmin.isLeft()) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({ errors: { message: isCommunityAdmin.value.errorValue().message } });
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
      return;
    }

    // Return the requests
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

  @Roles(Role.Admin)
  @Get(':id')
  async getJoinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const payload = this.getTokenPayload(req);
    
    // Check if the user is an admin of the community
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(payload.sub.toString(), id);

    if(isCommunityAdmin.isLeft()) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({ errors: { message: isCommunityAdmin.value.errorValue().message } });
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
          return;
        default:
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.json({ errors: { message: error.errorValue().message } });
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
    }
  }

  @Roles(Role.Admin)
  @Post(':id')
  async acceptJoinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() validateCommunityDto: ValidateCommunityDto,
    @Res() res: Response,
  ) {
    // Check if the user is an admin of the community
    const payload = this.getTokenPayload(req);
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(payload.sub.toString(), id);

    if(isCommunityAdmin.isLeft()) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({ errors: { message: isCommunityAdmin.value.errorValue().message } });
      return;
    }

    // Call the service to accept the request
    const result = await this.joinCommunityService.acceptJoinCommunityRequest(
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
      // Return the success
      res.status(HttpStatus.CREATED);
    }
  }

  private getTokenPayload(req: Request): {sub: UniqueEntityID, email: string, roles: string} {
    // Extract the token from the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, envs.jwtSecret) as unknown as {sub: UniqueEntityID, email: string, roles: string};
  }
}
