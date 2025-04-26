import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';
import { CreateUserInput } from '../models/inputs/create-user.input';

@Injectable()
export class UserService {
  private readonly usersMsUrl = envs.usersMsUrl;

  private readonly logger = new Logger(UserService.name);

  async getUserProfile(id: string) {
    const response = await axios.get(`${this.usersMsUrl}/${id}`);
    return response.data;
  }

  async countUserFollowing(id: string): Promise<number> {
    const response = await axios.get(
      `${this.usersMsUrl}/${id}/following/count`,
    );
    return response.data.count;
  }

  async countUserFollowers(id: string): Promise<number> {
    const response = await axios.get(
      `${this.usersMsUrl}/${id}/followers/count`,
    );
    return response.data.count;
  }

  async createUser(createUserInput: CreateUserInput): Promise<string> {
    const response = await axios.post(`${this.usersMsUrl}`, createUserInput);
    return response.data.id;
  }
}
