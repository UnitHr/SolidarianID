import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envs } from '@api-gateway/config';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';

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

  async getUserFollowers(
    userId: string,
    page = PaginationDefaults.DEFAULT_PAGE,
    limit = PaginationDefaults.DEFAULT_LIMIT,
  ) {
    try {
      const response = await axios.get(
        `${this.usersMsUrl}/${userId}/followers?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user followers: ${error.message}`);
    }
  }

  async getUserFollowing(
    userId: string,
    page = PaginationDefaults.DEFAULT_PAGE,
    limit = PaginationDefaults.DEFAULT_LIMIT,
  ) {
    try {
      const response = await axios.get(
        `${this.usersMsUrl}/${userId}/following?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user following: ${error.message}`);
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
}
