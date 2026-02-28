import { IsOptional, IsString, Length, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  createdById: string;
}
