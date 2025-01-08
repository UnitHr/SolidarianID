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
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { HistoryService } from '@users-ms/history/application/history.service';
import { HistoryMapper } from '@users-ms/history/history.mapper';
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
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const followerId = req['user']?.sub.value;

    await this.usersService.followUser(id, followerId);

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
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const history = await this.historyService.getHistoryByUserId(id);

    res.status(HttpStatus.OK).json(HistoryMapper.toDto(history));
  }
}
