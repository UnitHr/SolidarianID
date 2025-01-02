import { IsUUID } from 'class-validator';

export class userIdDto {
  @IsUUID()
  userId: string;
}
