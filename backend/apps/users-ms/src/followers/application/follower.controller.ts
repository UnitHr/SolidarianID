import {
  Controller,
  Get,
  Post,
  Param,
  UseFilters,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { FollowerService } from './follower.service';
import { FollowerMapper } from '../follower.mapper';
import { FollowerDomainExceptionFilter } from '../infra/filters/follower-domain-exception.filter';

@ApiTags('followers')
@Controller('users/:userId/followers')
@UseFilters(FollowerDomainExceptionFilter)
export class FollowersController {
  constructor(private readonly followerService: FollowerService) {}

  @ApiOperation({ summary: 'Follow a user' })
  @Post()
  async followUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @GetUserId() followerId: string,
    @Res() res: Response,
  ) {
    await this.followerService.followUser(userId, followerId);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: "Get a user's followers with pagination" })
  @Public()
  @Get()
  async getFollowers(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: QueryPaginationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = query;

    const { followers, total } = await this.followerService.getUserFollowers(
      userId,
      page,
      limit,
    );

    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    const response = new PaginatedResponseDto(
      followers.map(FollowerMapper.toDto),
      total,
      page,
      limit,
      baseUrl,
    );

    res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({ summary: "Count a user's followers" })
  @Public()
  @Get('count')
  async countFollowers(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    const count = await this.followerService.countUserFollowers(userId);
    res.status(HttpStatus.OK).json({ count });
  }
}
