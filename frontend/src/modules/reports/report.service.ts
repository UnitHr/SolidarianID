import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { readFileSync } from 'fs';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ReportService {
  async getCommunities(token: string) {
    /* const response = await axios.get(Constants.STATISTICS_MS_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;*/
    const fileContent = readFileSync(
      '../frontend/src/modules/reports/communities.json',
      'utf-8',
    );
    const data = JSON.parse(fileContent);
    return data;
  }

  async getCommunityDetails(token: string, communityId: string) {
    const fileContent = readFileSync(
      '../frontend/src/modules/reports/community.json',
      'utf-8',
    );
    const data = JSON.parse(fileContent);
    return data;
  }
}
