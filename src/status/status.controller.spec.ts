import { Test, TestingModule } from '@nestjs/testing';
import { StatusesController } from './status.controller';
import { StatusesService } from './status.service';

describe('StatusesController', () => {
  let controller: StatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusesController],
      providers: [StatusesService],
    }).compile();

    controller = module.get<StatusesController>(StatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
