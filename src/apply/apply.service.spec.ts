import { Test, TestingModule } from '@nestjs/testing';
import { ApplyService } from './apply.service';

describe('ApplyService', () => {
  let service: ApplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplyService],
    }).compile();

    service = module.get<ApplyService>(ApplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
