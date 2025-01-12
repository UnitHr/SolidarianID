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
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@common-lib/common-lib/auth/decorator/public.decorator';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDomainExceptionFilter } from '../infra/filters/user-domain-exception.filter';
import { UserMapper } from '../user.mapper';

@Controller('users')
@UseFilters(UserDomainExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @ApiExcludeEndpoint()
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
    );

    const locationUrl = `/users/${userId}`;
    res.status(HttpStatus.CREATED).location(locationUrl).json({ id: userId });
  }

  @ApiExcludeEndpoint()
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

  @ApiOperation({ summary: "Get a user's public profile" })
  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const user = await this.usersService.getUserProfile(id);

    const userDto = UserMapper.toProfileDto(user);
    res.status(HttpStatus.OK).json(userDto);
  }

  @ApiExcludeEndpoint()
  @Post(':id/followers')
  async follow(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUserId() userId: string,
    @Res() res: Response,
  ) {
    await this.usersService.followUser(id, userId);

    res.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiExcludeEndpoint()
  @Get(':id/followers')
  async getFollowers(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const followers = await this.usersService.getUserFollowers(id);

    res.status(HttpStatus.OK).json(followers.map(UserMapper.toProfileDto));
  }
}
