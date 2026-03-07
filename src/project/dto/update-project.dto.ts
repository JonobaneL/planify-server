import { PartialType, PickType } from '@nestjs/mapped-types';
import { Project } from '../entities/project.entity';

export class UpdateProjectDto extends PartialType(
  PickType(Project, ['name', 'description', 'archived', 'favorite']),
) {}
