import { ApiProperty } from '@nestjs/swagger';

export class FollowerDto {
  @ApiProperty({ description: 'ID of the follower' })
  followerId: string;

  @ApiProperty({ description: 'Full name of the follower' })
  fullName: string;

  @ApiProperty({ description: 'Email of the follower' })
  email: string;

  @ApiProperty({ description: 'Date when the user started following' })
  followedAt: Date;
}
