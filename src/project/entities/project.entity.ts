import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class Project {
  @IsUUID()
  id: string;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  archived: boolean;

  @IsUUID()
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}
