import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { StoreSchema } from '@schemas/store.schema';
import mongoose from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';

describe('StoreService', () => {
  let service: StoreService;
  let mongoServer: MongoMemoryServer;

  // Stores para testar
  const storesToTest: CreateStoreDto[] = [
    {
      storeName: 'Loja 1',
      takeOutInStore: true,
      shippingTimeInDays: 2,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'LOJA',
      postalCode: '89860970',
      telephoneNumber: '(11) 91234-5678',
      emailAddress: 'contato@alpha.com',
    },
    {
      storeName: 'Loja 2',
      takeOutInStore: true,
      shippingTimeInDays: 5,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'LOJA',
      postalCode: '84033390',
      telephoneNumber: '(21) 98765-4321',
      emailAddress: 'vendas@beta.com',
    },
    {
      storeName: 'PDV 1',
      takeOutInStore: true,
      shippingTimeInDays: 3,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'PDV',
      postalCode: '29945300',
      telephoneNumber: '(31) 99876-5432',
      emailAddress: 'contato@gama.com',
    },
    {
      storeName: 'PDV 2',
      takeOutInStore: true,
      shippingTimeInDays: 1,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'PDV',
      postalCode: '85807170',
      telephoneNumber: '(41) 95555-4444',
      emailAddress: 'atendimento@delta.com',
    },
    {
      storeName: 'Loja que não permite retirada',
      takeOutInStore: false, // Não permite retirada na loja
      shippingTimeInDays: 1,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'LOJA',
      postalCode: '63047095',
      telephoneNumber: '(87) 9445-4444',
      emailAddress: 'atendimento@delta.com',
    },
  ];

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri), // Conecta ao MongoDB em memória
        MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
      ],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  afterAll(async () => {
    // Fecha a conexão e o servidor do MongoDB em memoria
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  // Cria as store antes dos testes
  beforeAll(async () => {
    for (const store of storesToTest) {
      await service.create(store);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
