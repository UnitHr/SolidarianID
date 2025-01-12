import {
  Controller,
  Get,
  Patch,
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
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { NotificationService } from './notification.service';
import { NotificationMapper } from '../notification.mapper';

@Controller('users/:userId/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: QueryPaginationDto,
    @GetUserId() requestingUserId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (requestingUserId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this user notifications',
      );
    }

    const { page, limit } = query;

    const { notifications, total } =
      await this.notificationService.getUserNotifications(userId, page, limit);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;

    const response = new PaginatedResponseDto(
      notifications.map(NotificationMapper.toDto),
      total,
      page,
      limit,
      baseUrl,
    );

    res.status(HttpStatus.OK).json(response);
  }

  @Patch(':notificationId')
  async markNotificationAsRead(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
    @Res() res: Response,
  ) {
    await this.notificationService.markAsRead(userId, notificationId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
