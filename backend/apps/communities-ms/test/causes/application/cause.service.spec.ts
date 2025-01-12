import { CauseSortBy, SortDirection } from '@common-lib/common-lib/common/enum';
import { ActionService } from '@communities-ms/actions/application/action.service';
import { CauseServiceImpl } from '@communities-ms/causes/application/cause.service.impl';
import { CauseRepository } from '@communities-ms/causes/cause.repository';
import { EventPublisher } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';

describe('CauseService', () => {
  let service: CauseServiceImpl;

  const fileContent = readFileSync(
    '../backend/apps/communities-ms/test/causes/application/data.json',
    'utf-8',
  );

  const data = JSON.parse(fileContent);
  const mockCauseRepository = {
    findAll: jest.fn(),
    countDocuments: jest.fn(),
  };
  const mockActionService = {
    createAction: jest.fn(),
  };

  const mockEventPublisher = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CauseServiceImpl,
        {
          provide: CauseRepository,
          useValue: mockCauseRepository,
        },
        {
          provide: ActionService,
          useValue: mockActionService,
        },
        {
          provide: EventPublisher,
          useValue: mockEventPublisher,
        },
      ],
    }).compile();

    service = module.get<CauseServiceImpl>(CauseServiceImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCauses', () => {
    it('should return all causes in ascending order', async () => {
      const sortedData = [...data.data].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      mockCauseRepository.findAll.mockResolvedValueOnce(sortedData);

      const result = await service.getAllCauses(
        undefined,
        undefined,
        CauseSortBy.TITLE,
        SortDirection.ASC,
      );

      expect(result.data).toEqual(sortedData);
    });

    it('should return all causes in descending order', async () => {
      const sortedData = [...data.data].sort((a, b) =>
        b.title.localeCompare(a.title),
      );
      mockCauseRepository.findAll.mockResolvedValueOnce(sortedData);

      const result = await service.getAllCauses(
        undefined,
        undefined,
        CauseSortBy.TITLE,
        SortDirection.DESC,
      );

      expect(result.data).toEqual(sortedData);
    });

    it('should maintain consistency between ascending and descending order', async () => {
      const sortedAsc = [...data.data].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      const sortedDesc = [...sortedAsc].reverse();

      mockCauseRepository.findAll
        .mockResolvedValueOnce(sortedAsc)
        .mockResolvedValueOnce(sortedDesc);

      const ascResult = await service.getAllCauses(
        undefined,
        undefined,
        CauseSortBy.TITLE,
        SortDirection.ASC,
      );

      const descResult = await service.getAllCauses(
        undefined,
        undefined,
        CauseSortBy.TITLE,
        SortDirection.DESC,
      );

      expect(ascResult.data).toEqual(sortedAsc);
      expect(descResult.data).toEqual(sortedDesc);
    });

    it('should be idempotent when applying the same filter and order', async () => {
      const sortedData = [...data.data].sort((a, b) =>
        a.title.localeCompare(b.title),
      );
      mockCauseRepository.findAll.mockResolvedValue(sortedData);

      const firstCall = await service.getAllCauses(
        undefined,
        undefined,
        CauseSortBy.TITLE,
        SortDirection.ASC,
      );

      const secondCall = await service.getAllCauses(
        undefined,
        undefined,
        CauseSortBy.TITLE,
        SortDirection.ASC,
      );

      expect(firstCall).toEqual(secondCall);
      expect(mockCauseRepository.findAll).toHaveBeenCalledTimes(2);
    });
  });
});
