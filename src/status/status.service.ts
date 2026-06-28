import { Injectable, Logger } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PrismaService } from '../lib/prisma/prisma.service';

import { Prisma, Status } from '@generated/prisma/client';
import {
  MaxStatusesReachedException,
  StatusNotFound,
} from './exceptions/statuses.exception';

const MAX_STATUSES_PER_TYPE = 10;

// TODO: came up with order logic (lexorank)

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(StatusesService.name);

  constructor(private prisma: PrismaService) {}
  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const currentCount = await this.prisma.status.count({
      where: { type: createStatusDto.type },
    });

    if (currentCount >= MAX_STATUSES_PER_TYPE) {
      throw new MaxStatusesReachedException(
        MAX_STATUSES_PER_TYPE,
        createStatusDto.type,
      );
    }

    return this.prisma.status.create({
      data: createStatusDto,
    });
  }

  async findAll(type?: string): Promise<Status[]> {
    return this.prisma.status.findMany({
      where: type ? { type } : undefined,
    });
  }

  async findOne(id: string): Promise<Status> {
    const status = await this.prisma.status.findUnique({
      where: { id },
    });

    if (!status) {
      throw new StatusNotFound(id);
    }

    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status> {
    try {
      return await this.prisma.status.update({
        where: { id },
        data: updateStatusDto,
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2025') {
        // Prisma error code for record not found
        throw new StatusNotFound(id);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Status> {
    try {
      return await this.prisma.status.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2025') {
        // Prisma error code for record not found
        throw new StatusNotFound(id);
      }
      throw error;
    }
  }
}
