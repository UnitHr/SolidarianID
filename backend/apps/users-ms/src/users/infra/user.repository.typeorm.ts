import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository as TypeOrmRepository } from 'typeorm/repository/Repository';
import { UserMapper } from '../user.mapper';
import * as Persistence from './persistence';
import * as Domain from '../domain';
import { UserRepository } from '../user.repository';

// TODO:  review the null return pattern, maybe use a Result type or exceptions
@Injectable()
export class UserRepositoryTypeOrm extends UserRepository {
  constructor(
    @InjectRepository(Persistence.User)
    private readonly userRepository: TypeOrmRepository<Persistence.User>,
  ) {
    super();
  }

  async findById(id: string): Promise<Domain.User> {
    const user = await this.userRepository.findOneBy({ id });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<Domain.User> {
    const user = await this.userRepository.findOneBy({ email });
    return user ? UserMapper.toDomain(user) : null;
  }

  save = (entity: Domain.User): Promise<Domain.User> => {
    return this.userRepository
      .save(UserMapper.toPersistence(entity))
      .then((user) => UserMapper.toDomain(user));
  };

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
