import { Module } from '@nestjs/common';
import { StatusesService } from './status.service';
import { StatusesController } from './status.controller';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService, PrismaService],
})
export class StatusesModule {}
