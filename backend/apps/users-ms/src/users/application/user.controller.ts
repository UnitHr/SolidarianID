import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseFilters,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  Req,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { PaginatedResponseDto } from '@common-lib/common-lib/dto/paginated-response.dto';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { HistoryService } from '@users-ms/history/application/history.service';
import { HistoryEntryMapper } from '@users-ms/history/history-entry.mapper';
import { FindHistoryDto } from '@users-ms/history/dto/find-history.dto';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDomainExceptionFilter } from '../infra/filters/user-domain-exception.filter';
import { UserMapper } from '../user.mapper';

@Controller('users')
@UseFilters(UserDomainExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly historyService: HistoryService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const userId = await this.usersService.createUser(
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.birthDate,
      createUserDto.email,
      createUserDto.password,
      createUserDto.bio,
      createUserDto.showAge,
      createUserDto.showEmail,
      createUserDto.role,
    );

    const locationUrl = `/users/${userId}`;
    res.status(HttpStatus.CREATED).location(locationUrl).json({ id: userId });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    await this.usersService.updateUser(
      id,
      updateUserDto.email,
      updateUserDto.bio,
    );

    const locationUrl = `/users/${id}`;
    res.status(HttpStatus.NO_CONTENT).location(locationUrl).send();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const user = await this.usersService.getUserProfile(id);

    const userDto = UserMapper.toProfileDto(user);
    res.status(HttpStatus.OK).json(userDto);
  }

  @Post(':id/followers')
  async follow(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserId() userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.usersService.followUser(id, userId);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const followers = await this.usersService.getUserFollowers(id);

    res.status(HttpStatus.OK).json(followers.map(UserMapper.toProfileDto));
  }

  // TODO: Review this endpoint, only the history owner and community admins should be able to see this
  @Get(':id/history')
  async getHistory(
    @Param('id', ParseUUIDPipe) historyOwner: string,
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
      ))
    ) {
      res
        .status(HttpStatus.FORBIDDEN)
        .json({
          message: `You are not allowed to see the history of user: ${historyOwner}`,
        })
        .send();
      return;
    }

    const {
      type,
      status,
      page = PaginationDefaults.DEFAULT_PAGE,
      limit = PaginationDefaults.DEFAULT_LIMIT,
    } = query;

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
