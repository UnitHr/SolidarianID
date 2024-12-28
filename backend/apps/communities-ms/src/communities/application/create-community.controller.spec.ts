// eslint-disable-next-line import/no-extraneous-dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateCommunityController } from './create-community.controller';
import { CreateCommunityService } from './create-community.service';
import * as Domain from '../domain';
import { Ods } from '../domain/Ods';
import { Status } from '../domain/Status';
import * as Exceptions from '../exceptions';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { left, right } from '@common-lib/common-lib/core/logic/Either';
import { Result } from '@common-lib/common-lib/core/logic/Result';

describe('CreateCommunityController', () => {
  let controller: CreateCommunityController;

  const mockUserId = 'ce16ca5e-7009-43da-acc8-36e355334069';
  const mockAdminId = '2c67f581-0a47-4f8e-a11e-5a9f73e47d23';

  const mockCreateCommunityDto = {
    name: 'Community Name',
    description: 'Community Description',
    cause: {
      title: 'Cause Title',
      description: 'Cause Description',
      end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      ods: [Ods.NoPoverty, Ods.ZeroHunger],
    },
  };

  const mockResponse = {
    status: jest.fn((x) => x),
    location: jest.fn((x) => x),
    json: jest.fn((x) => x),
  } as unknown as Response;

  const mockProps = {
    userId: mockUserId,
    communityName: mockCreateCommunityDto.name,
    communityDescription: mockCreateCommunityDto.description,
    causeTitle: mockCreateCommunityDto.cause.title,
    causeDescription: mockCreateCommunityDto.cause.description,
    causeEndDate: Domain.CauseEndDate.create(
      mockCreateCommunityDto.cause.end,
    ).getValue(),
    causeOds: mockCreateCommunityDto.cause.ods,
    status: Status.Pending,
  };

  const mockCreateCommunityRequest = Domain.CreateCommunityRequest.create(
    mockProps,
    new UniqueEntityID('5cec8c12-9950-4108-aea1-e1691019bfbc'),
  );

  const mockCreateCommunityRequests = [
    Domain.CreateCommunityRequest.create(
      mockProps,
      new UniqueEntityID('4b0ba582-80af-463e-9323-81cc967af545'),
    ),
    Domain.CreateCommunityRequest.create(
      mockProps,
      new UniqueEntityID('3f214d89-e74e-4b53-bd4f-72cf3f188ac5'),
    ),
  ];

  const mockCreateCommunityService = {
    getCreateCommunityRequest: jest.fn(),
    getCreateCommunityRequests: jest.fn(),
    validateCreateCommunityRequest: jest.fn(),
  };

  const mockCommunity = Domain.Community.create(
    {
      adminId: mockAdminId,
      name: 'Community name',
      description: 'Community description',
      members: [],
      causes: [],
    },
    new UniqueEntityID('4bd14b9b-c3ac-4dc4-ba46-902a62272dd5'),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateCommunityController],
      providers: [CreateCommunityService],
    })
      .overrideProvider(CreateCommunityService)
      .useValue(mockCreateCommunityService)
      .compile();

    controller = module.get<CreateCommunityController>(
      CreateCommunityController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCreateCommunityRequest', () => {
    it('should return the request', async () => {
      mockCreateCommunityService.getCreateCommunityRequest.mockReturnValue(
        right(Result.ok(mockCreateCommunityRequest)),
      );

      const result = await controller.getCreateCommunityRequest(
        mockCreateCommunityRequest.id.toString(),
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: {
          id: mockCreateCommunityRequest.id.toString(),
          userId: mockCreateCommunityRequest.userId,
          name: mockCreateCommunityRequest.communityName,
          description: mockCreateCommunityRequest.communityDescription,
          cause: {
            title: mockCreateCommunityRequest.causeTitle,
            description: mockCreateCommunityRequest.causeDescription,
            end: mockCreateCommunityRequest.causeEndDate,
            ods: mockCreateCommunityRequest.causeOds,
          },
          status: mockCreateCommunityRequest.status,
          comment: mockCreateCommunityRequest.comment,
        },
      });
    });

    it('should return a CreateCommunityRequestNotFound', async () => {
      const mockException = Exceptions.CreateCommunityRequestNotFound.create(
        mockCreateCommunityRequest.id.toString(),
      );
      mockCreateCommunityService.getCreateCommunityRequest.mockReturnValue(
        left(mockException),
      );

      const result = await controller.getCreateCommunityRequest(
        '9f74cae3-1fed-4852-9677-08ccc3dbf5f0',
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: { message: mockException.errorValue().message },
      });
    });
  });

  describe('getCreateCommunityRequests', () => {
    it('should return the requests', async () => {
      mockCreateCommunityService.getCreateCommunityRequests.mockReturnValue(
        Result.ok(mockCreateCommunityRequests),
      );
      const queryPaginationDto = { offset: 0, limit: 10 };

      const result = await controller.getCreateCommunityRequests(
        queryPaginationDto,
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockCreateCommunityRequests.map((request) => ({
          id: request.id.toString(),
        })),
        links: {
          next: 'communities/create-request?offset=10&limit=10',
        },
      });
    });
  });

  describe('validateCreateCommunityRequest', () => {
    it('should return the community', async () => {
      mockCreateCommunityService.validateCreateCommunityRequest.mockReturnValue(
        right(Result.ok(mockCommunity)),
      );
      const mockValidateDto = { status: Status.Approved };

      const result = await controller.validateCreateCommunityRequest(
        mockCreateCommunityRequest.id.toString(),
        mockValidateDto,
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.location).toHaveBeenCalledWith(
        `/communities/${mockCommunity.id.toString()}`,
      );
    });

    it('should return a CreateCommunityRequestNotFound', async () => {
      const mockException = Exceptions.CreateCommunityRequestNotFound.create(
        mockCreateCommunityRequest.id.toString(),
      );
      mockCreateCommunityService.validateCreateCommunityRequest.mockReturnValue(
        left(mockException),
      );
      const mockValidateDto = { status: Status.Approved };

      const result = await controller.validateCreateCommunityRequest(
        mockCreateCommunityRequest.id.toString(),
        mockValidateDto,
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: { message: mockException.errorValue().message },
      });
    });

    it('should return a CommentIsMandatory', async () => {
      const mockException = Exceptions.CommentIsMandatory.create();
      mockCreateCommunityService.validateCreateCommunityRequest.mockReturnValue(
        left(mockException),
      );
      const mockValidateDto = { status: Status.Denied };

      const result = await controller.validateCreateCommunityRequest(
        mockCreateCommunityRequest.id.toString(),
        mockValidateDto,
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: { message: mockException.errorValue().message },
      });
    });

    it('should return an HTTP 200 OK when the request is denied', async () => {
      mockCreateCommunityService.validateCreateCommunityRequest.mockReturnValue(
        right(Result.ok<void>()),
      );
      const mockValidateDto = { status: Status.Denied, comment: 'Comment' };

      const result = await controller.validateCreateCommunityRequest(
        mockCreateCommunityRequest.id.toString(),
        mockValidateDto,
        mockResponse,
      );

      expect(result);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
