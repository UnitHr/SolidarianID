import { IsString, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCauseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  communityId: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ each: true })
  ods: number[];
}
