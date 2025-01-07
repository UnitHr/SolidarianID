import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Constants } from 'src/common/constants';

@Injectable()
export class ValidationService {
  async getCreateCommunityRequests(page: number, limit: number, token: string) {
    try {
      const response = await axios.get(
        Constants.COMMUNITY_MS_BASE_URL + '/creation-requests/all',
        {
          params: {
            status: 'pending',
            page: page,
            limit: limit,
          },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return { data: response.data.data, pagination: response.data.meta };
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
