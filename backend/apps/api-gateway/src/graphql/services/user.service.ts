import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';

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

  async getUserFollowers(userId: string, page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${this.usersMsUrl}/${userId}/followers?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user followers: ${error.message}`);
    }
  }

  async getUserFollowing(userId: string, page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${this.usersMsUrl}/${userId}/following?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user following: ${error.message}`);
    }
  }
}
