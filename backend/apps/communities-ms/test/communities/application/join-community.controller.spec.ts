// eslint-disable-next-line import/no-extraneous-dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';
import { JoinCommunityController } from '../../../src/communities/application/join-community.controller';
import { JoinCommunityService } from '../../../src/communities/application/join-community.service';
import * as Domain from '../../../src/communities/domain';
import { Status } from '../../../src/communities/domain/Status';
import * as Exceptions from '../../../src/communities/exceptions';

describe('JoinCommunityController', () => {
  const mockJoinCommunityRequest = Domain.JoinCommunityRequest.create(
    {
      userId: 'ce16ca5e-7009-43da-acc8-36e355334069',
      communityId: '2c67f581-0a47-4f8e-a11e-5a9f73e47d23',
      status: Status.Pending,
    },
    new UniqueEntityID('5cec8c12-9950-4108-aea1-e1691019bfbc'),
  );

  const mockJoinCommunityRequests = [
    Domain.JoinCommunityRequest.create(
      {
        userId: 'ce16ca5e-7009-43da-acc8-36e355334069',
        communityId: '2c67f581-0a47-4f8e-a11e-5a9f73e47d23',
        status: Status.Pending,
      },
      new UniqueEntityID('4b0ba582-80af-463e-9323-81cc967af545'),
    ),
    Domain.JoinCommunityRequest.create(
      {
        userId: 'ce16ca5e-7009-43da-acc8-36e355334069',
        communityId: '2c67f581-0a47-4f8e-a11e-5a9f73e47d23',
        status: Status.Pending,
      },
      new UniqueEntityID('4b0ba582-80af-463e-9323-81cc967af545'),
    ),
  ];

  const mockResponse = {
    status: jest.fn((x) => x),
    location: jest.fn((x) => x),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const mockJoinCommunityService = {
    getJoinCommunityRequest: jest.fn(),
    getJoinCommunityRequests: jest.fn(),
    acceptJoinCommunityRequest: jest.fn(),
    joinCommunityRequest: jest.fn(),
  };

  let controller: JoinCommunityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoinCommunityController],
      providers: [JoinCommunityService],
    })
      .overrideProvider(JoinCommunityService)
      .useValue(mockJoinCommunityService)
      .compile();

    controller = module.get<JoinCommunityController>(JoinCommunityController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getJoinCommunityRequest', () => {
    it('should return the request', async () => {
      mockJoinCommunityService.getJoinCommunityRequest.mockReturnValue(
        right(Result.ok(mockJoinCommunityRequest)),
      );

      const result = await controller.getJoinCommunityRequest(
        mockJoinCommunityRequest.id.toString(),
        mockResponse,
      );

      expect(result).toBeDefined();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: {
          id: mockJoinCommunityRequest.id.toString(),
          userId: mockJoinCommunityRequest.userId,
          communityId: mockJoinCommunityRequest.communityId,
          status: mockJoinCommunityRequest.status,
          comment: mockJoinCommunityRequest.comment,
        },
      });
    });

    it('should return a JoinCommunityRequestNotFound', async () => {
      const mockException = Exceptions.JoinCommunityRequestNotFound.create(
        mockJoinCommunityRequest.id.toString(),
      );
      mockJoinCommunityService.getJoinCommunityRequest.mockReturnValue(
        left(mockException),
      );

      const result = await controller.getJoinCommunityRequest(
        mockJoinCommunityRequest.id.toString(),
        mockResponse,
      );

      expect(result).toBeUndefined();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: { message: mockException.errorValue().message },
      });
    });

    describe('getJoinCommunityRequests', () => {
      it('should return the requests', async () => {
        mockJoinCommunityService.getJoinCommunityRequests.mockReturnValue(
          Result.ok(mockJoinCommunityRequests),
        );

        const result = await controller.getJoinCommunityRequests(
          { offset: 0, limit: 10 },
          mockResponse,
        );

        expect(result).toBeDefined();
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
        expect(mockResponse.json).toHaveBeenCalledWith({
          data: mockJoinCommunityRequests.map((request) => ({
            id: request.id.toString(),
          })),
          links: {
            next: 'communities/join-request?offset=10&limit=10',
          },
        });
      });
    });

    describe('acceptJoinCommunityRequest', () => {
      it('should accept the request', async () => {
        mockJoinCommunityService.acceptJoinCommunityRequest.mockReturnValue(
          right(Result.ok<void>()),
        );
        const mockValidateDto = { status: Status.Approved };

        const result = await controller.acceptJoinCommunityRequest(
          mockJoinCommunityRequest.id.toString(),
          mockValidateDto,
          mockResponse,
        );

        expect(result).toBeDefined();
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      });

      it('should denied the request', async () => {
        mockJoinCommunityService.acceptJoinCommunityRequest.mockReturnValue(
          right(Result.ok<void>()),
        );
        const mockValidateDto = { status: Status.Denied, comment: 'Comment' };

        const result = await controller.acceptJoinCommunityRequest(
          mockJoinCommunityRequest.id.toString(),
          mockValidateDto,
          mockResponse,
        );

        expect(result).toBeDefined();
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      });

      it('should return a JoinCommunityRequestNotFound', async () => {
        const mockException = Exceptions.JoinCommunityRequestNotFound.create(
          mockJoinCommunityRequest.id.toString(),
        );
        mockJoinCommunityService.acceptJoinCommunityRequest.mockReturnValue(
          left(mockException),
        );
        const mockValidateDto = { status: Status.Approved };

        const result = await controller.acceptJoinCommunityRequest(
          mockJoinCommunityRequest.id.toString(),
          mockValidateDto,
          mockResponse,
        );

        expect(result).toBeUndefined();
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        expect(mockResponse.json).toHaveBeenCalledWith({
          errors: { message: mockException.errorValue().message },
        });
      });

      it('should return a CommentIsMandatory exception', async () => {
        const mockException = Exceptions.CommentIsMandatory.create();
        mockJoinCommunityService.acceptJoinCommunityRequest.mockReturnValue(
          left(mockException),
        );
        const mockValidateDto = { status: Status.Denied };

        const result = await controller.acceptJoinCommunityRequest(
          mockJoinCommunityRequest.id.toString(),
          mockValidateDto,
          mockResponse,
        );

        expect(result).toBeUndefined();
        expect(mockResponse.status).toHaveBeenCalledWith(
          HttpStatus.BAD_REQUEST,
        );
        expect(mockResponse.json).toHaveBeenCalledWith({
          errors: { message: mockException.errorValue().message },
        });
      });
    });
  });
});
