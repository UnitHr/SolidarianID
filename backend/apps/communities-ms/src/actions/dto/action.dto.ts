export class ActionDto {
  id: string;

  status: string;

  type: string;

  title: string;

  description: string;

  causeId: string;

  target: number;

  unit: string;

  achieved: number;

  foodType?: string;

  location?: string;

  date?: Date;
}
