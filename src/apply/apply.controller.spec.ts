import { Test, TestingModule } from '@nestjs/testing';
import { ApplyController } from './apply.controller';

describe('ApplyController', () => {
  let controller: ApplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplyController],
    }).compile();

    controller = module.get<ApplyController>(ApplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
