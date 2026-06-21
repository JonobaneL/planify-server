import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './lib/prisma/prisma.service';
import { StatusesModule } from './status/status.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    StatusesModule,
    ProjectModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
