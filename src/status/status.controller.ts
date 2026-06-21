import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StatusesService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Status } from './entities/status.entity';
import { ErrorResponseDto } from '@common/dto/error.dto';
import { NoProperty } from './exceptions/statuses.exception';

@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new status' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Status,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Maximum statuses reached.',
    type: ErrorResponseDto,
    example: {
      code: 'MAX_STATUSES_REACHED',
      message: 'Cannot create more than 10 statuses of type "prioriry"',
      details: { maxAllowed: 10, type: 'type' },
      timestamp: '2026-06-21T19:45:12.345Z',
      path: '/statuses',
    },
  })
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusesService.create(createStatusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all statuses by type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of statuses returned successfully.',
    type: Status,
    isArray: true,
  })
  findAll(@Query('type') type: string) {
    return this.statusesService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one status by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status found successfully.',
    type: Status,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
    type: ErrorResponseDto,
    example: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed (uuid is expected)',
      details: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
      timestamp: '2026-06-21T19:45:12.345Z',
      path: '/statuses/xxx',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found.',
    type: ErrorResponseDto,
    example: {
      code: 'STATUS_NOT_FOUND',
      message: 'Status with id "xxx" not found',
      details: { id: 'xxx' },
      timestamp: '2026-06-21T19:45:12.345Z',
      path: '/statuses/xxx',
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a status by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No properties provided for update.',
    type: ErrorResponseDto,
    example: {
      code: 'NO_PROPERTIES_PROVIDED',
      message: 'No properties provided for update',
      timestamp: '2026-06-21T19:45:12.345Z',
      path: '/statuses/xxx',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found.',
    type: ErrorResponseDto,
    example: {
      code: 'STATUS_NOT_FOUND',
      message: 'Status with id "xxx" not found',
      details: { id: 'xxx' },
      timestamp: '2026-06-21T19:45:12.345Z',
      path: '/statuses/xxx',
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    if (Object.keys(updateStatusDto).length === 0) {
      throw new NoProperty();
    }
    return this.statusesService.update(id, updateStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a status by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Status removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Status not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.statusesService.remove(id);
  }
}
