import { Test, TestingModule } from '@nestjs/testing';
import { ProductModelController } from './product_model.controller';
import { ProductModelService } from './product_model.service';

describe('ProductModelController', () => {
  let controller: ProductModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductModelController],
      providers: [ProductModelService],
    }).compile();

    controller = module.get<ProductModelController>(ProductModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
