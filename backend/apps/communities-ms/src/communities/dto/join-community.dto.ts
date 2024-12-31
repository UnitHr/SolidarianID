import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinCommunityDto {
  @IsUUID('4', { message: 'The community ID must be a valid UUID' })
  @IsNotEmpty({ message: 'The community ID cannot be empty' })
  communityId: string;
}
