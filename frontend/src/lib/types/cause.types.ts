import { ODSEnum } from '../../utils/ods';

export type CauseDetails = {
  id: string;
  title: string;
  description: string;
};

export interface CreateCausePayload {
  title: string;
  description: string;
  end: string; // ISO string
  ods: ODSEnum[];
}
