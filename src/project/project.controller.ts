import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(
    @Query('createdBy') createdBy?: string,
    @Query('members') members?: string,
    @Query('archived') archived?: boolean,
    @Query('name') name?: string,
  ) {
    return this.projectService.findAll({
      createdBy,
      members,
      archived,
      name,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.remove(id);
  }

  @Get(':id/members')
  getMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.getMembers(id);
  }

  @Put(':id/members/:memberId')
  addMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.projectService.addMember(id, memberId);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.projectService.removeMember(id, memberId);
  }
}
