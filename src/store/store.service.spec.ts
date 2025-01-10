import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { getModelToken } from '@nestjs/mongoose';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getModelToken('Store'),
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            listAll: jest.fn(),
            storeByState: jest.fn(),
            storeById: jest.fn(),
            storeByCep: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
