import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Constants } from 'src/common/constants';
import { readFileSync } from 'fs';
@Injectable()
export class StatisticsService {
  async getDataByODS(token: string) {
    try {
      const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + '/ods',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
      /*
      const fileContent = readFileSync(
        '../frontend/src/modules/statistics/ods.json',
        'utf-8',
      );
      const data = JSON.parse(fileContent);
      return data;*/
    } catch (error) {
      console.error('Error fetching datas by ODS:', error);
      throw new Error('Failed to fetch datas by ods from the microservice');
    }
  }

  async getDataByCommunity(token: string) {
    try {
      const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + '/community',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
      /*
      const fileContent = readFileSync(
        '../frontend/src/modules/statistics/progress.json',
        'utf-8',
      );
      const data = JSON.parse(fileContent);
      return data;
      */
    } catch (error) {
      console.error('Error fetching datas by community', error);
      throw new Error(
        'Failed to fetch datas by community from the microservice',
      );
    }
  }
}
