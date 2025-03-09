import { Test, TestingModule } from '@nestjs/testing';
import { KeyvalueController } from './keyvalue.controller';
import { KeyvalueService } from './keyvalue.service';

describe('KeyvalueController', () => {
  let controller: KeyvalueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyvalueController],
      providers: [KeyvalueService],
    }).compile();

    controller = module.get<KeyvalueController>(KeyvalueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
