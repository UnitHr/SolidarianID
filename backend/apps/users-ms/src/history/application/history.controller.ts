import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  ParseUUIDPipe,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { ApiExcludeController } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistoryEntryMapper } from '../history-entry.mapper';
import { FindHistoryDto } from '../dto/find-history.dto';
import { FollowerService } from '@users-ms/followers/application/follower.service';

@ApiExcludeController()
@Controller('users/:userId/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService,
    private readonly followerService: FollowerService,
  ) {}

  @Get()
  async getHistory(
    @Param('userId', ParseUUIDPipe) historyOwner: string,
    @GetUserId() userId: string,
    @Query() query: FindHistoryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (
      historyOwner !== userId &&
      !(await this.historyService.userHasJoinCommunityRequestWithAdmin(
        historyOwner,
        userId,
      )) &&
      !(await this.followerService.isFollowing(historyOwner, userId))
    ) {
      throw new ForbiddenException(
        `You are not allowed to see the history of user: ${historyOwner}`,
      );
    }

    const { type, status, page, limit } = query;

    const { entries, total } = await this.historyService.getUserHistory(
      historyOwner,
      type,
      status,
      page,
      limit,
    );

    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    const response = new PaginatedResponseDto(
      entries.map(HistoryEntryMapper.toDto),
      total,
      page,
      limit,
      baseUrl,
    );

    res.status(HttpStatus.OK).json(response);
  }
}
