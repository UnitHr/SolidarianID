import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommunityService } from './create-community.service';
import { CreateCommunityRequestRepository } from '../repo/create-community.repository';
import { CommunityRepository } from '../repo/community.repository';
import * as Domain from '../domain';
import { Status } from '../domain/Status';
import { Ods } from '../domain/Ods';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';

describe('CreateCommunityService', () => {
  let service: CreateCommunityService;

  const mockProps = {
    userId: 'f50e799b-7a27-4666-a831-bd7552c0632d',
    communityName: 'CommunityA',
    communityDescription: 'This is the description of the community',
    causeTitle: 'This is the title of the cause',
    causeDescription: 'This is the description of the cause',
    causeEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    causeOds: [Ods.NoPoverty, Ods.ZeroHunger],
  };

  const mockCreateCommunityRequest = Domain.CreateCommunityRequest.create(
    {
      userId: mockProps.userId,
      communityName: mockProps.communityName,
      communityDescription: mockProps.communityDescription,
      causeTitle: mockProps.causeTitle,
      causeDescription: mockProps.causeDescription,
      causeEndDate: Domain.CauseEndDate.create(
        mockProps.causeEndDate,
      ).getValue(),
      causeOds: mockProps.causeOds,
      status: Status.Pending,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommunityService,
        {
          provide: CreateCommunityRequestRepository,
          useValue: mockCreateCommunityRequestRepository,
        },
        {
          provide: CommunityRepository,
          useValue: mockCommunityRepository,
        },
      ],
    }).compile();

    service = module.get<CreateCommunityService>(CreateCommunityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
