import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  checkServer(): string {
    return 'Server is running!';
  }
}
