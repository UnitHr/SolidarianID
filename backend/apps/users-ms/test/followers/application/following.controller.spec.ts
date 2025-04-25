import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FollowerService } from '@users-ms/followers/application/follower.service';
import { Follower } from '@users-ms/followers/domain';
import { FollowerMapper } from '@users-ms/followers/follower.mapper';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { FollowingController } from '@users-ms/followers/application/following.controller';

describe('FollowingController', () => {
  let controller: FollowingController;
  let followerServiceMock: jest.Mocked<FollowerService>;

  // Constants
  const USER_ID = 'user-id';
  const FOLLOWED_ID = 'followed-id';
  const FOLLOWED_NAME = 'Followed Name';
  const FOLLOWED_EMAIL = 'followed@example.com';

  beforeEach(async () => {
    followerServiceMock = {
      getUserFollowing: jest.fn(),
      countUserFollowing: jest.fn(),
    } as unknown as jest.Mocked<FollowerService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowingController],
      providers: [{ provide: FollowerService, useValue: followerServiceMock }],
    }).compile();

    controller = module.get<FollowingController>(FollowingController);
  });

  describe('getUserFollowing', () => {
    it('should return paginated following users and 200 OK with default pagination', async () => {
      // Arrange
      const mockFollowing = [
        {
          id: '1',
          followerId: USER_ID,
          followedId: FOLLOWED_ID,
          followedFullName: FOLLOWED_NAME,
          followedEmail: FOLLOWED_EMAIL,
        } as unknown as Follower,
        {
          id: '2',
          followerId: USER_ID,
          followedId: 'another-followed',
          followedFullName: 'Another Name',
          followedEmail: 'another@example.com',
        } as unknown as Follower,
      ];

      const mockDtos = mockFollowing.map((following) => ({
        followedUserId: following.followedId.toString(),
        fullName: following.followedFullName,
        email: following.followedEmail,
        followedAt: new Date(),
      }));

      jest
        .spyOn(FollowerMapper, 'toFollowingDto')
        .mockReturnValueOnce(mockDtos[0])
        .mockReturnValueOnce(mockDtos[1]);

      const total = 2;
      followerServiceMock.getUserFollowing.mockResolvedValueOnce({
        following: mockFollowing,
        total,
      });

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reqMock = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('example.com'),
        path: '/users/user-id/following',
      } as unknown as Request;

      const queryDto = new QueryPaginationDto();
      queryDto.page = PaginationDefaults.DEFAULT_PAGE;
      queryDto.limit = PaginationDefaults.DEFAULT_LIMIT;

      // Act
      await controller.getUserFollowing(
        USER_ID,
        queryDto,
        reqMock,
        responseMock,
      );

      // Assert
      expect(followerServiceMock.getUserFollowing).toHaveBeenCalledWith(
        USER_ID,
        PaginationDefaults.DEFAULT_PAGE,
        PaginationDefaults.DEFAULT_LIMIT,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return paginated following with custom pagination parameters', async () => {
      // Arrange
      const mockFollowing = [
        {
          id: '3',
          followerId: USER_ID,
          followedId: 'third-followed',
          followedFullName: 'Third User',
          followedEmail: 'third@example.com',
        } as unknown as Follower,
      ];

      const mockDto = {
        followedUserId: 'third-followed',
        fullName: 'Third User',
        email: 'third@example.com',
        followedAt: new Date(),
      };

      jest.spyOn(FollowerMapper, 'toFollowingDto').mockReturnValueOnce(mockDto);

      const total = 5;
      const page = 2;
      const limit = 1;
      followerServiceMock.getUserFollowing.mockResolvedValueOnce({
        following: mockFollowing,
        total,
      });

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reqMock = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('example.com'),
        path: '/users/user-id/following',
      } as unknown as Request;

      const queryDto = new QueryPaginationDto();
      queryDto.page = page;
      queryDto.limit = limit;

      // Act
      await controller.getUserFollowing(
        USER_ID,
        queryDto,
        reqMock,
        responseMock,
      );

      // Assert
      expect(followerServiceMock.getUserFollowing).toHaveBeenCalledWith(
        USER_ID,
        page,
        limit,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return empty array with pagination info when user is not following anyone', async () => {
      // Arrange
      const total = 0;
      followerServiceMock.getUserFollowing.mockResolvedValueOnce({
        following: [],
        total,
      });

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reqMock = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('example.com'),
        path: '/users/user-id/following',
      } as unknown as Request;

      const queryDto = new QueryPaginationDto();

      // Act
      await controller.getUserFollowing(
        USER_ID,
        queryDto,
        reqMock,
        responseMock,
      );

      // Assert
      expect(followerServiceMock.getUserFollowing).toHaveBeenCalledWith(
        USER_ID,
        PaginationDefaults.DEFAULT_PAGE,
        PaginationDefaults.DEFAULT_LIMIT,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
