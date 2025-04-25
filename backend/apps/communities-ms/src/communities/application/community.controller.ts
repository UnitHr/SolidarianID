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
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from '@common-lib/common-lib/auth/roles.guard';
import { DomainError } from '@common-lib/common-lib/core/exceptions';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { CreateCommunityDto } from '../dto/create-community.dto';
import * as Exceptions from '../exceptions';
import { ValidateCommunityDto } from '../dto/validate-community.dto';
import { FindCommunitiesDto } from '../dto/find-communities.dto';
import { CommunityMapper } from '../mapper/CommunityMapper';
import { FindCreateCommunitiesDto } from '../dto/find-create-communities.dto';
import { CreateCommunityRequestMapper } from '../mapper/CreateCommunityRequestMapper';
import { JoinCommunityRequestMapper } from '../mapper/JoinCommunityRequestMapper';
import { CreateCauseDto } from '../dto/create-cause.dto';
import { CommunityService } from './community.service';
import { JoinCommunityService } from './join-community.service';
import { CreateCommunityService } from './create-community.service';

@Controller('communities')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly joinCommunityService: JoinCommunityService,
    private readonly createCommunityService: CreateCommunityService,
  ) {}

  @ApiExcludeEndpoint()
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
      this.handleError(error, res);
      return;
    }
    // Return the community
    const causeId = result.value;

    const location = `/causes/${causeId.getValue().toString()}`;
    res.status(HttpStatus.CREATED);
    res.location(location);
    res.end();
  }

  @ApiExcludeEndpoint()
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
      this.handleError(error, res);
      return;
    }
    // Return the location of the created resource
    const request = result.value;

    const location = `/communities/creation-requests/${request.getValue().id.toString()}`;
    res.status(HttpStatus.CREATED);
    res.location(location);
    res.end();
  }

  @ApiOperation({ summary: 'Get all communities, sort and filter' })
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
    res.end();
  }

  @ApiExcludeEndpoint()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('creation-requests')
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
    res.end();
  }

  @Get('managed-communities')
  async getManagedCommunities(
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
    const result = await this.communityService.getManagedCommunities(userId);

    if (result.isLeft()) {
      const error = result.value;
      this.handleError(error, res);
      return;
    }

    const communities = result.value.getValue();

    res.status(HttpStatus.OK);
    res.json({
      data: communities.map((community) => community.id.toString()),
    });
    res.end();
  }

  @ApiOperation({ summary: 'Get details of a specific community by id' })
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
      this.handleError(error, res);
      return;
    }
    // Return the community
    const community = result.value.getValue();

    res.status(HttpStatus.OK);
    res.json({
      data: CommunityMapper.toDto(community),
    });
    res.end();
  }

  @ApiExcludeEndpoint()
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
      this.handleError(error, res);
      return;
    }
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
    res.end();
  }

  @ApiExcludeEndpoint()
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
      this.handleError(error, res);
      return;
    }
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
    res.end();
  }

  @ApiExcludeEndpoint()
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
      this.handleError(error, res);
      return;
    }
    const request = result.value.getValue();

    const location = `/communities/${communityId}/join-requests/${request.id.toString()}`;
    res.status(HttpStatus.CREATED);
    res.location(location);
    res.end();
  }

  @ApiExcludeEndpoint()
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
      res.end();
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
    res.end();
  }

  @ApiExcludeEndpoint()
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
      res.end();
      return;
    }

    // Call the service to get the request
    const result =
      await this.joinCommunityService.getJoinCommunityRequest(requestId);

    if (result.isLeft()) {
      const error = result.value;
      this.handleError(error, res);
      return;
    }
    const request = result.value.getValue();

    // Return the request
    res.status(HttpStatus.OK);
    res.json({
      data: JoinCommunityRequestMapper.toDto(request),
    });
    res.end();
  }

  @ApiExcludeEndpoint()
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
      res.end();
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
      this.handleError(error, res);
      return;
    }
    // Return the success
    res.status(HttpStatus.CREATED);
    res.end();
  }

  @ApiExcludeEndpoint()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('creation-requests/:id')
  async getCreateCommunityRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const result =
      await this.createCommunityService.getCreateCommunityRequest(id);

    if (result.isLeft()) {
      const error = result.value;
      this.handleError(error, res);
      return;
    }

    const request = result.value.getValue();

    res.status(HttpStatus.OK);
    res.json({
      data: CreateCommunityRequestMapper.toDto(request),
    });
    res.end();
  }

  @ApiExcludeEndpoint()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
      this.handleError(error, res);
      return;
    }

    const newCommunity = result.value.getValue();

    if (!newCommunity) {
      res.status(HttpStatus.OK);
      res.end();
      return;
    }

    const location = `/communities/${newCommunity.id.toString()}`;
    res.status(HttpStatus.CREATED);
    res.location(location);
    res.end();
  }

  private handleError(error: Result<DomainError>, res: Response) {
    switch (error.constructor) {
      case Exceptions.CommunityNotFound:
        res.status(HttpStatus.NOT_FOUND);
        break;
      case Exceptions.CommunityNameIsTaken:
      case Exceptions.JoinCommunityRequestAlreadyExists:
      case Exceptions.UserIsAlreadyMember:
      case Exceptions.JoinCommunityRequestDenied:
        res.status(HttpStatus.CONFLICT);
        break;
      case Exceptions.InvalidDateProvided:
      case Exceptions.CommentIsMandatory:
        res.status(HttpStatus.BAD_REQUEST);
        break;
      case Exceptions.CreateCommunityRequestNotFound:
      case Exceptions.JoinCommunityRequestNotFound:
        res.status(HttpStatus.NOT_FOUND);
        break;
      case Exceptions.UserDoNotManageCommunities:
        res.status(HttpStatus.NOT_FOUND);
        break;
      default:
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.json({ errors: { message: error.errorValue().message } });
    res.end();
  }
}
