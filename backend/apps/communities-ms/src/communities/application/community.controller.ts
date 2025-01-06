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
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { Utils } from '@common-lib/common-lib/common/utils';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { CommunityService } from './community.service';
import * as Exceptions from '../exceptions';
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import { JoinCommunityService } from './join-community.service';
import { CreateCommunityService } from './create-community.service';

@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly joinCommunityService: JoinCommunityService,
    private readonly createCommunityService: CreateCommunityService,
  ) {}

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
        causes: community.causes.slice(offset, offset + limit),
      };

      res.status(HttpStatus.OK);
      res.json({ data, links });
    }
  }

  @Post(':id/join-requests')
  async joinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) communityId: string,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const userId = (req as any).user.sub.value;

    const result = await this.joinCommunityService.joinCommunityRequest(
      userId,
      communityId,
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

      const location = `/communities/${communityId}/join-requests/${request.id.toString()}`;
      res.status(HttpStatus.CREATED);
      res.location(location);
      res.send();
    }
  }

  @Roles(Role.ADMIN)
  @Get(':id/join-requests')
  async getJoinCommunityRequests(
    @Req() req: Request,
    @Query() query: QueryPaginationDto,
    @Param('id', ParseUUIDPipe) communityId: string,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const userId = (req as any).user.sub.value;

    // Check if the user is an admin of the community
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(
      userId,
      communityId,
    );

    if (isCommunityAdmin === false) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        errors: {
          message: `The user with ID ${userId} is not an admin of the community with ID ${communityId}.`,
        },
      });
      res.send();
      return;
    }

    // Call the service to get the requests
    const { offset = 0, limit = 10 } = query;
    const results = await this.joinCommunityService.getJoinCommunityRequests(
      communityId,
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
      `communities/${communityId}/join-requests`,
      offset,
      limit,
    );

    res.status(HttpStatus.OK);
    res.json({ data, links });
    res.send();
  }

  @Roles(Role.ADMIN)
  @Get(':id/join-requests/:reqId')
  async getJoinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) communityId: string,
    @Param('reqId', ParseUUIDPipe) requestId: string,
    @Res() res: Response,
  ) {
    // Extract the token from the authorization header
    const userId = (req as any).user.sub.value;

    // Check if the user is an admin of the community
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(
      userId,
      communityId,
    );

    if (isCommunityAdmin === false) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        errors: {
          message: `The user with ID ${userId} is not an admin of the community with ID ${communityId}.`,
        },
      });
      res.send();
      return;
    }

    // Call the service to get the request
    const result =
      await this.joinCommunityService.getJoinCommunityRequest(requestId);

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

  @Roles(Role.ADMIN)
  @Post(':id/join-requests/:reqId')
  async validateJoinCommunityRequest(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) communityId: string,
    @Param('reqId', ParseUUIDPipe) requestId: string,
    @Body() validateCommunityDto: ValidateCommunityDto,
    @Res() res: Response,
  ) {
    // Check if the user is an admin of the community
    const userId = (req as any).user.sub.value;
    const isCommunityAdmin = await this.joinCommunityService.isCommunityAdmin(
      userId,
      communityId,
    );

    if (isCommunityAdmin === false) {
      res.status(HttpStatus.UNAUTHORIZED);
      res.json({
        errors: {
          message: `The user with ID ${userId} is not an admin of the community with ID ${communityId}.`,
        },
      });
      res.send();
      return;
    }

    // Call the service to accept the request
    const result = await this.joinCommunityService.validateJoinCommunityRequest(
      requestId,
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

  @Get('creation-requests')
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

  @Get('creation-requests/:id')
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

  @Post('creation-requests/:id')
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
