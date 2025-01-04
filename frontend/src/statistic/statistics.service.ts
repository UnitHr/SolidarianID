import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { cp, readFileSync } from 'fs';
import { join } from 'path';
import { Constants } from 'src/common/constants';

@Injectable()
export class StatisticsService {
  async getCommunitiesCausesByODS(token: string) {
    try {
      /**   const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + '/communities-causes-by-ods',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
      */
      // Ruta al archivo JSON
      const filePath = join(process.cwd(), 'src', 'statistic', 'datas.json');

      // Leer el archivo JSON
      const fileContent = readFileSync(filePath, 'utf-8');

      // Parsear el contenido a JSON
      const data = JSON.parse(fileContent);
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        'Error fetching community and cause statistics by ODS:',
        error,
      );
      throw new Error(
        'Failed to fetch community and causes statistics from the microservice',
      );
    }
  }

  async getSupportsByODS(token: string) {
    try {
      /**   const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + '/communities-causes-by-ods',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
      */
      const filePath = join(process.cwd(), 'src', 'statistic', 'piechard.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      return data;
    } catch (error) {
      console.error(
        'Error fetching community and cause statistics by ODS:',
        error,
      );
      throw new Error(
        'Failed to fetch community and causes statistics from the microservice',
      );
    }
  }

  async getSupportsByCommunity(token: string) {
    try {
      /**   const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + '/communities-causes-by-ods',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
      */

      const filePath = join(process.cwd(), 'src', 'statistic', 'piechart.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        'Error fetching community and cause statistics by ODS:',
        error,
      );
      throw new Error(
        'Failed to fetch community and causes statistics from the microservice',
      );
    }
  }

  async getActionsProgressByCommunity(token: string) {
    try {
      /**   const response = await axios.get(
        Constants.STATISTICS_MS_BASE_URL + '/communities-causes-by-ods',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
      */
      const filePath = join(process.cwd(), 'src', 'statistic', 'progreso.json');
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      console.log(data);
      return data;
    } catch (error) {
      console.error(
        'Error fetching community and cause statistics by ODS:',
        error,
      );
      throw new Error(
        'Failed to fetch community and causes statistics from the microservice',
      );
    }
  }
}
