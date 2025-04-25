import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';
import { CreateUserInput } from '../inputs/create-user.input';

@Injectable()
export class UserService {
  private readonly usersMsUrl = envs.usersMsUrl;

  async getUserProfile(id: string) {
    try {
      const response = await axios.get(`${this.usersMsUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  async countUserFollowing(id: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.usersMsUrl}/${id}/following/count`,
      );
      return response.data.count;
    } catch (error) {
      throw new Error(`Failed to count user following: ${error.message}`);
    }
  }

  async countUserFollowers(id: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.usersMsUrl}/${id}/followers/count`,
      );
      return response.data.count;
    } catch (error) {
      throw new Error(`Failed to count user followers: ${error.message}`);
    }
  }

  async createUser(createUserInput: CreateUserInput): Promise<string> {
    try {
      const response = await axios.post(`${this.usersMsUrl}`, createUserInput);
      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
