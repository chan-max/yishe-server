import { Test, TestingModule } from '@nestjs/testing';
import { DreamController } from './dream.controller';
import { DreamService } from './dream.service';

describe('DreamController', () => {
  let controller: DreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DreamController],
      providers: [DreamService],
    }).compile();

    controller = module.get<DreamController>(DreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
