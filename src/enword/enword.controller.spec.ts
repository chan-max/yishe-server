import { Test, TestingModule } from '@nestjs/testing';
import { EnwordController } from './enword.controller';
import { EnwordService } from './enword.service';

describe('EnwordController', () => {
  let controller: EnwordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnwordController],
      providers: [EnwordService],
    }).compile();

    controller = module.get<EnwordController>(EnwordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
