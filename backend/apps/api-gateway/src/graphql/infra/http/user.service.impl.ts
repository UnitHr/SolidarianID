import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';
import { UserService } from '@api-gateway/graphql/application/user.service';
import { CreateUserInput } from '@api-gateway/graphql/models/inputs/create-user.input';

@Injectable()
export class UserServiceImpl implements UserService {
  private readonly usersMsUrl = envs.usersMsUrl;

  private readonly logger = new Logger(UserServiceImpl.name);

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
