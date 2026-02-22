import { OmitType } from '@nestjs/mapped-types';
import { Status } from '../entities/status.entity';

export class CreateStatusDto extends OmitType(Status, ['id']) {}
