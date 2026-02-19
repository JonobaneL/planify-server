import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Status } from '../entities/status.entity';

export class UpdateStatusDto extends PartialType(OmitType(Status, ['id'])) {}
