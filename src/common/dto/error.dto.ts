import { ApiProperty } from '@nestjs/swagger';

export class ErrorDetailsDto {
  @ApiProperty({ example: '5dae8c79-407b-4219-a744-920d372440de' })
  id?: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 'CODE_EXAMPLE' })
  code!: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  })
  message!: string;

  @ApiProperty({ type: ErrorDetailsDto, required: false })
  details?: ErrorDetailsDto;

  @ApiProperty({ example: '2026-06-21T19:45:12.345Z' })
  timestamp!: string;

  @ApiProperty({ example: '/example' })
  path!: string;
}
