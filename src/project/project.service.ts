import { Injectable, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ProjectNotFound } from './exceptions/project.exception';
import { Project } from '@generated/prisma/client';
import slugify from 'slugify';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(private readonly prisma: PrismaService) {}
  create(createProjectDto: CreateProjectDto) {
    const baseSlug = slugify(createProjectDto.name, {
      lower: true,
      strict: true,
    });
    const slug = `${baseSlug}-${Date.now()}`;
    return this.prisma.project.create({
      data: { ...createProjectDto, slug },
    });
  }

  findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new ProjectNotFound(id);
    }
    return project;
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  getMembers(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      select: {
        members: true,
      },
    });
  }

  addMember(id: string, userId: string) {
    return this.prisma.project.update({
      where: { id },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
  }

  removeMember(id: string, userId: string) {
    return this.prisma.project.update({
      where: { id },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });
  }
}
