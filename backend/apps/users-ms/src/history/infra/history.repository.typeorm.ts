import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions';
import { HistoryRepository } from '../history.repository';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { HistoryMapper } from '../history.mapper';

@Injectable()
export class HistoryRepositoryTypeOrm extends HistoryRepository {
  constructor(
    @InjectRepository(Persistence.History)
    private readonly historyRepository: TypeOrmRepository<Persistence.History>,
  ) {
    super();
  }

  save(entity: Domain.History): Promise<Domain.History> {
    return this.historyRepository
      .save(HistoryMapper.toPersistence(entity))
      .then((history) => HistoryMapper.toDomain(history));
  }

  async findById(id: string): Promise<Domain.History> {
    const history = await this.historyRepository.findOneBy({ id });
    if (!history) {
      throw new EntityNotFoundError(`History with id ${id} not found`);
    }
    return HistoryMapper.toDomain(history);
  }

  async findByUserId(userId: string): Promise<Domain.History> {
    const history = await this.historyRepository.findOneBy({ userId });
    if (!history) {
      throw new EntityNotFoundError(`History with userId ${userId} not found`);
    }
    return HistoryMapper.toDomain(history);
  }
}
