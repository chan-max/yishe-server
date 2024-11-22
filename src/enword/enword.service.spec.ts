import { Test, TestingModule } from '@nestjs/testing';
import { EnWordsService } from './enword.service';

describe('EnwordService', () => {
  let service: EnWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnWordsService],
    }).compile();

    service = module.get<EnWordsService>(EnWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
