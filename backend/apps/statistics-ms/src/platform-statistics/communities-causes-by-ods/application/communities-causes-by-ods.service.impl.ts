import { Injectable } from '@nestjs/common';
import { CommunitiesCausesByOdsService } from './communities-causes-by-ods.service';
import CommunitiesCausesByOdsRepository from '../infra/communities-causes-by-ods.repository.cassandra';
import { CommunitiesCausesByOds } from '../domain';

@Injectable()
export class CommunitiesCausesByOdsServiceImpl
  implements CommunitiesCausesByOdsService
{
  constructor(
    private readonly communitiesCausesByOdsRepository: CommunitiesCausesByOdsRepository,
  ) {}

  getAll(): Promise<CommunitiesCausesByOds[]> {
    return this.communitiesCausesByOdsRepository.findAllEntities();
  }
}
