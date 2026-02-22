import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './lib/prisma/prisma.service';
import { StatusesModule } from './status/status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    StatusesModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
