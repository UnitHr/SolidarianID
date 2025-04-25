import {
  Controller,
  Get,
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
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { FollowerService } from './follower.service';
import { FollowerMapper } from '../follower.mapper';
import { FollowerDomainExceptionFilter } from '../infra/filters/follower-domain-exception.filter';

@ApiTags('following')
@Controller('users/:userId/following')
@UseFilters(FollowerDomainExceptionFilter)
export class FollowingController {
  constructor(private readonly followerService: FollowerService) {}

  @ApiOperation({
    summary: 'Get users that a user is following with pagination',
  })
  @Public()
  @Get()
  async getUserFollowing(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: QueryPaginationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { page, limit } = query;

    const { following, total } = await this.followerService.getUserFollowing(
      userId,
      page,
      limit,
    );

    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    const response = new PaginatedResponseDto(
      following.map(FollowerMapper.toFollowingDto),
      total,
      page,
      limit,
      baseUrl,
    );

    res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({ summary: 'Get the count of users that a user is following' })
  @Public()
  @Get('count')
  async getFollowingCount(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    const count = await this.followerService.countUserFollowing(userId);
    res.status(HttpStatus.OK).json({ count });
  }
}
