import {
  Controller,
  Get,
  Post,
  Param,
  UseFilters,
  Res,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
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

  @ApiOperation({ summary: "Get a user's followers" })
  @Public()
  @Get()
  async getFollowers(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Res() res: Response,
  ) {
    const followers = await this.followerService.getUserFollowers(userId);
    res.status(HttpStatus.OK).json(followers.map(FollowerMapper.toDto));
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
