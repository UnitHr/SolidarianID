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
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { CommunityService } from './community.service';
import * as Exceptions from '../exceptions';
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import { JoinCommunityService } from './join-community.service';
import { CreateCommunityService } from './create-community.service';
import { FindCommunitiesDto } from '../dto/find-communities.dto';
import { CommunityMapper } from '../mapper/CommunityMapper';
import { FindCreateCommunitiesDto } from '../dto/find-create-communities.dto';
import { CreateCommunityRequestMapper } from '../mapper/CreateCommunityRequestMapper';
import { JoinCommunityRequestMapper } from '../mapper/JoinCommunityRequestMapper';
import { CreateCauseDto } from '../dto/create-cause.dto';

@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly joinCommunityService: JoinCommunityService,
    private readonly createCommunityService: CreateCommunityService,
  ) {}

  @Post(':id/causes')
  async createCommunityCause(
    @Param('id', ParseUUIDPipe) communityId: string,
    @GetUserId() userId: string,
    @Body() createCause: CreateCauseDto,
    @Res() res,
  ) {
    // Get the community
    const result = await this.communityService.createCommunityCause(
      createCause.title,
      createCause.description,
      createCause.ods,
      createCause.end,
      communityId,
      userId,
    );

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
      const causeId = result.value;

      const location = `/causes/${causeId.getValue().toString()}`;
      res.status(HttpStatus.OK);
      res.location(location);
      res.send();
    }
  }

  @Post()
  async createCommunityRequest(
    @Body() createCommunityDto: CreateCommunityDto,
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
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
  @Get()
  async getCommunities(
    @Query() query: FindCommunitiesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { name, page, limit } = query;

    const { data, total } = await this.communityService.getCommunities(
      name,
      page,
      limit,
    );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data.length > 0 ? data.map(CommunityMapper.toDto) : [],
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK);
    res.json(response);
    res.send();
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
        data: CommunityMapper.toDto(community),
      });
      res.send();
    }
  }

  @Public()
  @Get(':id/members')
  async getCommunityMembers(
    @Body() query: QueryPaginationDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = query;

    const result = await this.communityService.getCommunityMembers(
      id,
      page,
      limit,
    );

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
      const { data, total } = result.value;
      // Build the base URL for the paginated response
      const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

      // Create the paginated response
      const response = new PaginatedResponseDto(
        data,
        total,
        page,
        limit,
        baseUrl,
      );

      // Send the response
      res.status(HttpStatus.OK);
      res.json(response);
      res.send();
    }
  }

  @Public()
  @Get(':id/causes')
  async getCommunityCauses(
    @Query() query: QueryPaginationDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = query;

    const result = await this.communityService.getCommunityCauses(
      id,
      page,
      limit,
    );

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
      const { data, total } = result.value;
      // Build the base URL for the paginated response
      const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

      // Create the paginated response
      const response = new PaginatedResponseDto(
        data,
        total,
        page,
        limit,
        baseUrl,
      );

      // Send the response
      res.status(HttpStatus.OK);
      res.json(response);
      res.send();
    }
  }

  @Post(':id/join-requests')
  async joinCommunityRequest(
    @Param('id', ParseUUIDPipe) communityId: string,
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
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

  @Get(':id/join-requests')
  async getJoinCommunityRequests(
    @Query() query: QueryPaginationDto,
    @Param('id', ParseUUIDPipe) communityId: string,
    @GetUserId() userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
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

    const { page, limit } = query;

    const { data, total } =
      await this.joinCommunityService.getJoinCommunityRequests(
        communityId,
        page,
        limit,
      );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data.length > 0 ? data.map(JoinCommunityRequestMapper.toDto) : [],
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK);
    res.json(response);
    res.send();
  }

  @Get(':id/join-requests/:reqId')
  async getJoinCommunityRequest(
    @Param('id', ParseUUIDPipe) communityId: string,
    @Param('reqId', ParseUUIDPipe) requestId: string,
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
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
        data: JoinCommunityRequestMapper.toDto(request),
      });
      res.send();
    }
  }

  @Post(':id/join-requests/:reqId')
  async validateJoinCommunityRequest(
    @Param('id', ParseUUIDPipe) communityId: string,
    @Param('reqId', ParseUUIDPipe) requestId: string,
    @Body() validateCommunityDto: ValidateCommunityDto,
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
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

  @Roles(Role.ADMIN)
  @Get('creation-requests/all')
  async getCreateCommunityRequests(
    @Req() req: Request,
    @Query() query: FindCreateCommunitiesDto,
    @Res() res: Response,
  ) {
    const { createdAt, status, page, limit } = query;

    const { data, total } =
      await this.createCommunityService.getCreateCommunityRequests(
        createdAt,
        status,
        page,
        limit,
      );

    // Build the base URL for the paginated response
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    // Create the paginated response
    const response = new PaginatedResponseDto(
      data.length > 0 ? data.map(CreateCommunityRequestMapper.toDto) : [],
      total,
      page,
      limit,
      baseUrl,
    );

    // Send the response
    res.status(HttpStatus.OK);
    res.json(response);
    res.send();
  }

  @Roles(Role.ADMIN)
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
        data: CreateCommunityRequestMapper.toDto(request),
      });
      res.send();
    }
  }

  @Roles(Role.ADMIN)
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
