import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindCommunitiesDto extends QueryPaginationDto {
  @ApiProperty({
    description: 'Name of the community',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
