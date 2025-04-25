import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';
import { CreateUserInput } from '../inputs/create-user.input';

@Injectable()
export class UserService {
  private readonly usersMsUrl = envs.usersMsUrl;

  private readonly logger = new Logger(UserService.name);

  async getUserProfile(id: string) {
    this.logger.debug(`Fetching user profile for ID: ${id}`);
    const response = await axios.get(`${this.usersMsUrl}/${id}`);
    return response.data;
  }

  async countUserFollowing(id: string): Promise<number> {
    this.logger.debug(`Counting users that ${id} is following`);
    const response = await axios.get(
      `${this.usersMsUrl}/${id}/following/count`,
    );
    return response.data.count;
  }

  async countUserFollowers(id: string): Promise<number> {
    this.logger.debug(`Counting followers for user ${id}`);
    const response = await axios.get(
      `${this.usersMsUrl}/${id}/followers/count`,
    );
    return response.data.count;
  }

  async createUser(createUserInput: CreateUserInput): Promise<string> {
    this.logger.debug('Creating new user');
    const response = await axios.post(`${this.usersMsUrl}`, createUserInput);
    return response.data.id;
  }
}
