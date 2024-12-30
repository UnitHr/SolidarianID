import { Test, TestingModule } from '@nestjs/testing';
import { CreateCommunityService } from '../../../src/communities/application/create-community.service';
import { CreateCommunityRequestRepository } from '../../../src/communities/repo/create-community.repository';
import { CommunityRepository } from '../../../src/communities/repo/community.repository';

describe('CreateCommunityService', () => {
  let service: CreateCommunityService;

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
