import { Test, TestingModule } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';
import { CreateCommunityServiceImpl } from '../../../src/communities/application/create-community.service.impl';
import { CreateCommunityRequestRepository } from '../../../src/communities/repo/create-community.repository';
import { CommunityRepository } from '../../../src/communities/repo/community.repository';
import { CauseService } from '../../../src/causes/application/cause.service';

describe('CreateCommunityService', () => {
  let service: CreateCommunityServiceImpl;

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

  const mockEventPublisher = {
    mergeObjectContext: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommunityServiceImpl,
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
        {
          provide: EventPublisher,
          useValue: mockEventPublisher,
        },
      ],
    }).compile();

    service = module.get<CreateCommunityServiceImpl>(
      CreateCommunityServiceImpl,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
