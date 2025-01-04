import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Constants } from './common/constants';
import { readFileSync } from 'fs';
import { join } from 'path';
@Injectable()
export class AppService {
  async getCreateCommunityRequests(
    offset: number,
    limit: number,
    token: string,
  ) {
    try {
      // const response = await axios.get(
      //   Constants.COMMUNITY_MS_BASE_URL + '/creation-requests',
      //   {
      //     params: { offset, limit },
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );

      // Ruta al archivo JSON
      const filePath = join(__dirname, '../src', 'data.json');

      // Leer el archivo JSON
      const fileContent = readFileSync(filePath, 'utf-8');

      // Parsear el contenido a JSON
      const data = JSON.parse(fileContent);
      const total = 2;
      // Data and total
      //return { data: response.data.data, total: response.data.total };
      return { data, total };
    } catch (error) {
      console.error('Error fetching community requests:', error);
      // In case of error, return an empty array
      return { data: [], total: 0 };
    }
  }
  // Método para validar solicitudes
  // async validateRequests(requestIds: string[], token: string) {
  //   try {
  //     const status = 'approved';
  //     const body = { status };
  //     const response = await axios.post(
  //       Constants.COMMUNITY_MS_BASE_URL + '/creation-requests/' + requestId,
  //       {
  //         body,
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error al validar las solicitudes:', error);
  //     throw new Error('No se pudo validar las solicitudes');
  //   }
  // }

  // // Método para rechazar una solicitud
  // async rejectRequest(requestId: string, reason: string, token: string) {
  //   try {
  //     const status = 'denied';
  //     const body = { status, reason };
  //     const response = await axios.post(
  //       Constants.COMMUNITY_MS_BASE_URL + '/creation-requests/' + requestId,
  //       {
  //         body,
  //         headers: { Authorization: `Bearer ${token}` },
  //       },
  //     );
  //     return response.data; // Devuelve el resultado del rechazo
  //   } catch (error) {
  //     console.error('Error al rechazar la solicitud:', error);
  //     throw new Error('No se pudo rechazar la solicitud');
  //   }
  // }
}
