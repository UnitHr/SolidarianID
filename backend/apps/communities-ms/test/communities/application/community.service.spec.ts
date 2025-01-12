// eslint-disable-next-line import/no-extraneous-dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { CommunityServiceImpl } from '../../../src/communities/application/community.service.impl';
import { CreateCommunityRequestRepository } from '../../../src/communities/repo/create-community.repository';
import { StatusRequest } from '../../../src/communities/domain/StatusRequest';
import * as Domain from '../../../src/communities/domain';
import { ODSEnum } from '../../../../../libs/common-lib/src/common/ods';
import { CommunityRepository } from '../../../src/communities/repo/community.repository';
import * as Exceptions from '../../../src/communities/exceptions';
import { CauseService } from '../../../src/causes/application/cause.service';

describe('CommunityService', () => {
  let service: CommunityServiceImpl;
  const causeEndDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days in the future
  const mockProps = {
    userId: 'f50e799b-7a27-4666-a831-bd7552c0632d',
    communityName: 'CommunityA',
    communityDescription: 'This is the description of the community',
    causeTitle: 'This is the title of the cause',
    causeDescription: 'This is the description of the cause',
    causeEndDate,
    causeOds: [ODSEnum.NoPoverty, ODSEnum.ZeroHunger],
  };

  const mockCreateCommunityRequest = Domain.CreateCommunityRequest.create(
    {
      userId: mockProps.userId,
      communityName: mockProps.communityName,
      communityDescription: mockProps.communityDescription,
      causeTitle: mockProps.causeTitle,
      causeDescription: mockProps.causeDescription,
      causeEndDate,
      causeOds: mockProps.causeOds,
      status: StatusRequest.PENDING,
      createdAt: new Date(),
    },
    new UniqueEntityID('5ee7a693-a93e-4b6d-bd7e-4bafd1046db3'),
  );

  const mockCommunity = Domain.Community.create(
    {
      adminId: '45a9b29c-c428-4ff8-a0ca-91b9f334faae',
      name: 'CommunityA',
      description: 'This is the description of the community',
      members: [],
      causes: [],
    },
    new UniqueEntityID('ae6bd5eb-aa53-4247-8c2c-c7fa7373ac68'),
  );

  const mockCreateCommunityRequestRepository = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  const mockCommunityRepository = {
    save: jest.fn(),
    findByName: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  const mockCauseService = {
    createCause: jest.fn(),
    getCause: jest.fn(),
    updateCause: jest.fn(),
    getAllCauses: jest.fn(),
    validateCauseEndDate: jest.fn(),
    getCauseSupporters: jest.fn(),
    addCauseSupporter: jest.fn(),
    getCauseActions: jest.fn(),
    addCauseAction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityServiceImpl,
        {
          provide: CreateCommunityRequestRepository,
          useValue: mockCreateCommunityRequestRepository,
        },
        {
          provide: CommunityRepository,
          useValue: mockCommunityRepository,
        },
        {
          provide: CauseService,
          useValue: mockCauseService,
        },
      ],
    }).compile();

    service = module.get<CommunityServiceImpl>(CommunityServiceImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCommunityRequest', () => {
    it('should return the created community request', async () => {
      mockCreateCommunityRequestRepository.save.mockReturnValue(
        mockCreateCommunityRequest,
      );
      mockCommunityRepository.findByName.mockReturnValue(null);
      mockCauseService.validateCauseEndDate.mockReturnValue(true);

      const result = await service.createCommunityRequest(mockProps);

      expect(result.value.getValue()).toEqual(mockCreateCommunityRequest);
      expect(mockCreateCommunityRequestRepository.save).toHaveBeenCalled();
    });

    it('should return a CommunityNameIsTaken error', async () => {
      mockCommunityRepository.findByName.mockReturnValue(mockCommunity);

      const result = await service.createCommunityRequest(mockProps);

      expect(result.value).toEqual(
        Exceptions.CommunityNameIsTaken.create(mockProps.communityName),
      );
      expect(mockCommunityRepository.findByName).toHaveBeenCalled();
    });
  });

  describe('getCommunity', () => {
    it('should return the community', async () => {
      mockCommunityRepository.findById.mockReturnValue(mockCommunity);

      const result = await service.getCommunity(mockCommunity.id.toString());

      expect(result.value.getValue()).toEqual(mockCommunity);
      expect(mockCommunityRepository.findById).toHaveBeenCalled();
    });

    it('should return a CommunityNotFound error', async () => {
      mockCommunityRepository.findById.mockReturnValue(null);

      const result = await service.getCommunity(mockCommunity.id.toString());

      expect(result.value).toEqual(
        Exceptions.CommunityNotFound.create(mockCommunity.id.toString()),
      );
      expect(mockCommunityRepository.findById).toHaveBeenCalled();
    });
  });
});
