import { Test, TestingModule } from '@nestjs/testing';
import { KeyvalueService } from './keyvalue.service';

describe('KeyvalueService', () => {
  let service: KeyvalueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyvalueService],
    }).compile();

    service = module.get<KeyvalueService>(KeyvalueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
