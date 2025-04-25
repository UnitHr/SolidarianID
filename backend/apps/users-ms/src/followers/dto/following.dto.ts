import { ApiProperty } from '@nestjs/swagger';

export class FollowingDto {
  @ApiProperty({ description: 'ID of the followed user' })
  followedUserId: string;

  @ApiProperty({ description: 'Full name of the followed user' })
  fullName: string;

  @ApiProperty({ description: 'Email of the followed user' })
  email: string;

  @ApiProperty({ description: 'Date when the user was followed' })
  followedAt: Date;
}
