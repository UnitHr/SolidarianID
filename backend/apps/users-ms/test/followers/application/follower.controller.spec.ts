import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { FollowersController } from '@users-ms/followers/application/follower.controller';
import { FollowerService } from '@users-ms/followers/application/follower.service';
import { UserService } from '@users-ms/users/application/user.service';
import { Follower } from '@users-ms/followers/domain';
import { FollowerMapper } from '@users-ms/followers/follower.mapper';
import { User } from '@users-ms/users/domain';
import { UserCannotFollowSelfError } from '@users-ms/followers/exceptions/user-cannot-follow-self.error';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';

describe('FollowersController', () => {
  let controller: FollowersController;
  let followerServiceMock: jest.Mocked<FollowerService>;
  let userServiceMock: jest.Mocked<UserService>;

  // Constants
  const USER_ID = 'user-id';
  const FOLLOWER_ID = 'follower-id';
  const FOLLOWER_NAME = 'Follower Name';
  const FOLLOWER_EMAIL = 'follower@example.com';

  beforeEach(async () => {
    followerServiceMock = {
      followUser: jest.fn(),
      getUserFollowers: jest.fn(),
      countUserFollowers: jest.fn(),
      isFollowing: jest.fn(),
    } as unknown as jest.Mocked<FollowerService>;

    userServiceMock = {
      getUserProfile: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowersController],
      providers: [
        { provide: FollowerService, useValue: followerServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    controller = module.get<FollowersController>(FollowersController);
  });

  describe('followUser', () => {
    it('should successfully follow a user and return 204 No Content', async () => {
      // Arrange
      const mockUser = {
        fullName: FOLLOWER_NAME,
        email: FOLLOWER_EMAIL,
      } as User;
      userServiceMock.getUserProfile.mockResolvedValueOnce(mockUser);
      followerServiceMock.followUser.mockResolvedValueOnce();

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // Act
      await controller.followUser(USER_ID, FOLLOWER_ID, responseMock);

      // Assert
      expect(followerServiceMock.followUser).toHaveBeenCalledWith(
        USER_ID,
        FOLLOWER_ID,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
      expect(responseMock.send).toHaveBeenCalled();
    });

    it('should propagate errors from FollowerService', async () => {
      // Arrange
      followerServiceMock.followUser.mockRejectedValueOnce(
        new UserCannotFollowSelfError(),
      );

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // Act & Assert
      await expect(
        controller.followUser(USER_ID, FOLLOWER_ID, responseMock),
      ).rejects.toThrow(UserCannotFollowSelfError);

      expect(followerServiceMock.followUser).toHaveBeenCalledWith(
        USER_ID,
        FOLLOWER_ID,
      );
    });
  });

  describe('getFollowers', () => {
    it('should return paginated followers and 200 OK with default pagination', async () => {
      // Arrange
      const mockFollowers = [
        {
          id: '1',
          followerId: FOLLOWER_ID,
          followedId: USER_ID,
        } as unknown as Follower,
        {
          id: '2',
          followerId: 'another-follower',
          followedId: USER_ID,
        } as unknown as Follower,
      ];

      const mockDtos = mockFollowers.map((follower) => ({
        followerId: follower.followerId.toString(),
        fullName: 'Mock Name',
        email: 'mock@example.com',
        followedAt: new Date(),
      }));

      jest
        .spyOn(FollowerMapper, 'toDto')
        .mockReturnValueOnce(mockDtos[0])
        .mockReturnValueOnce(mockDtos[1]);

      const total = 2;
      followerServiceMock.getUserFollowers.mockResolvedValueOnce({
        followers: mockFollowers,
        total,
      });

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reqMock = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('example.com'),
        path: '/users/user-id/followers',
      } as unknown as Request;

      const queryDto = new QueryPaginationDto();
      queryDto.page = PaginationDefaults.DEFAULT_PAGE;
      queryDto.limit = PaginationDefaults.DEFAULT_LIMIT;

      // Act
      await controller.getFollowers(USER_ID, queryDto, reqMock, responseMock);

      // Assert
      expect(followerServiceMock.getUserFollowers).toHaveBeenCalledWith(
        USER_ID,
        PaginationDefaults.DEFAULT_PAGE,
        PaginationDefaults.DEFAULT_LIMIT,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return paginated followers with custom pagination parameters', async () => {
      // Arrange
      const mockFollowers = [
        {
          id: '3',
          followerId: 'another-follower-2',
          followedId: USER_ID,
        } as unknown as Follower,
      ];

      const mockDto = {
        followerId: 'another-follower-2',
        fullName: 'Another Mock',
        email: 'another@example.com',
        followedAt: new Date(),
      };

      jest.spyOn(FollowerMapper, 'toDto').mockReturnValueOnce(mockDto);

      const total = 5;
      const page = 2;
      const limit = 1;
      followerServiceMock.getUserFollowers.mockResolvedValueOnce({
        followers: mockFollowers,
        total,
      });

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reqMock = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('example.com'),
        path: '/users/user-id/followers',
      } as unknown as Request;

      const queryDto = new QueryPaginationDto();
      queryDto.page = page;
      queryDto.limit = limit;

      // Act
      await controller.getFollowers(USER_ID, queryDto, reqMock, responseMock);

      // Assert
      expect(followerServiceMock.getUserFollowers).toHaveBeenCalledWith(
        USER_ID,
        page,
        limit,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return empty array with pagination info when no followers exist', async () => {
      // Arrange
      const total = 0;
      followerServiceMock.getUserFollowers.mockResolvedValueOnce({
        followers: [],
        total,
      });

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const reqMock = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('example.com'),
        path: '/users/user-id/followers',
      } as unknown as Request;

      const queryDto = new QueryPaginationDto();

      // Act
      await controller.getFollowers(USER_ID, queryDto, reqMock, responseMock);

      // Assert
      expect(followerServiceMock.getUserFollowers).toHaveBeenCalledWith(
        USER_ID,
        PaginationDefaults.DEFAULT_PAGE,
        PaginationDefaults.DEFAULT_LIMIT,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('countFollowers', () => {
    it('should return follower count and 200 OK', async () => {
      // Arrange
      followerServiceMock.countUserFollowers.mockResolvedValueOnce(5);

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Act
      await controller.countFollowers(USER_ID, responseMock);

      // Assert
      expect(followerServiceMock.countUserFollowers).toHaveBeenCalledWith(
        USER_ID,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({ count: 5 });
    });

    it('should return zero when no followers exist', async () => {
      // Arrange
      followerServiceMock.countUserFollowers.mockResolvedValueOnce(0);

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Act
      await controller.countFollowers(USER_ID, responseMock);

      // Assert
      expect(followerServiceMock.countUserFollowers).toHaveBeenCalledWith(
        USER_ID,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith({ count: 0 });
    });
  });
});
