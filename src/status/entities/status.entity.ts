import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Status {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: 'Critical' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ example: '#ffffff' })
  @IsString()
  @IsNotEmpty()
  color!: string;

  @ApiProperty({ example: 'priority' })
  @IsString()
  @IsNotEmpty()
  type!: string;
}
