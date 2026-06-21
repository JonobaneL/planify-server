import { OmitType } from '@nestjs/swagger';
import { Status } from '../entities/status.entity';

export class CreateStatusDto extends OmitType(Status, ['id']) {}
