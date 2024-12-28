export class ActionDto {
  id: string;

  status: 'pending' | 'in_progress' | 'completed';

  type: string;

  title: string;

  description: string;

  causeId: string;

  targetAmount?: number;

  currentAmount?: number;

  foodType?: string;

  quantity?: number;

  unit?: string;

  collectQuantity?: number;

  targetVolunteers?: number;

  currentVolunteers?: number;

  location?: string;

  date?: Date;
}
