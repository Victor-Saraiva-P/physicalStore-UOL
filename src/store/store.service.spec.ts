import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { StoreSchema } from '@schemas/store.schema';
import mongoose from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';

// Stores para testar
const storesToTest: CreateStoreDto[] = [
  {
    storeName: 'Loja 1 - BA',
    takeOutInStore: true,
    shippingTimeInDays: 2,
    address2: 'Endereço Adicinal 2',
    address3: 'Endereço Adicinal 3',
    type: 'LOJA',
    postalCode: '41338250',
    telephoneNumber: '(11) 91234-5678',
    emailAddress: 'contato@alpha.com',
  },
  {
    storeName: 'PDV 1 - MA',
    takeOutInStore: true,
    shippingTimeInDays: 3,
    address2: 'Endereço Adicinal 2',
    address3: 'Endereço Adicinal 3',
    type: 'PDV',
    postalCode: '99034310',
    telephoneNumber: '(31) 99876-5432',
    emailAddress: 'contato@gama.com',
  },
];

describe('StoreService CRUD', () => {
  let service: StoreService;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
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

  // Cria Stores para testar
  beforeAll(async () => {
    for (const store of storesToTest) {
      await service.create(store);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Testando create', async () => {
    const newStore: CreateStoreDto = {
      storeName: 'Store de Teste de create',
      takeOutInStore: true,
      shippingTimeInDays: 3,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'LOJA',
      postalCode: '93534230',
      telephoneNumber: '(11) 91234-5678',
      emailAddress: 'teste@store.com',
    };

    // Chama o método create do serviço
    const createdStore = await service.create(newStore);

    // Verifica se o retorno do método contém os dados extras gerados pelo viaCep
    expect(createdStore).toBeDefined();
    expect(createdStore.id).toBeDefined();
    expect(createdStore.address).toBeDefined();
    expect(createdStore.district).toBeDefined();
    expect(createdStore.city).toBeDefined();
    expect(createdStore.state).toBeDefined();
    expect(createdStore.latitude).toBeDefined();
    expect(createdStore.longitude).toBeDefined();

    // Verifica se a store foi salva no banco
    const savedStore = await service.storeById(createdStore.id, 100, 0);
    expect(savedStore.stores[0].storeName).toBe(createdStore.storeName);
    expect(savedStore.stores[0].postalCode).toBe(createdStore.postalCode);

    // exclui a store recém criada
    await service.remove(createdStore.id);
  });

  it('Testando update', async () => {
    // cria uma store para atualizar os dados
    const newStore: CreateStoreDto = {
      storeName: 'Store de Teste',
      shippingTimeInDays: 3,
      type: 'LOJA',
      postalCode: '93534230',
    };
    // Salva nova store
    const storeToUpdate = await service.create(newStore);

    // Dados para atualização
    const updateData = {
      storeName: 'Nome da store atualizado',
      shippingTimeInDays: 7,
      postalCode: '75910033',
    };

    // Chama o método update do serviço
    const updatedStore = await service.update(storeToUpdate.id, updateData);

    // Verifica se os dados foram atualizados corretamente
    expect(updatedStore).toBeDefined();
    expect(updatedStore.storeName).toBe(updateData.storeName);
    expect(updatedStore.shippingTimeInDays).toBe(updateData.shippingTimeInDays);
    expect(updatedStore.postalCode).toBe(updateData.postalCode);

    // Verifica se as coordenadas foram atualizadas e é diferente das coordenadas originais
    expect(updatedStore.latitude).not.toBe(storeToUpdate.latitude);
    expect(updatedStore.longitude).not.toBe(storeToUpdate.longitude);

    // exclui a store recém criada
    await service.remove(updatedStore.id);
  });

  it('Testando remove', async () => {
    // cria uma store para atualizar os dados
    const newStore: CreateStoreDto = {
      storeName: 'Store de Teste',
      shippingTimeInDays: 3,
      type: 'LOJA',
      postalCode: '93534230',
    };
    // Salva nova store
    const storeToDelete = await service.create(newStore);

    // Chama o método delete do serviço
    await service.remove(storeToDelete.id);

    // Verifica se a store foi realmente deletada
    const tryFindRemovedStore = await service.storeById(
      storeToDelete.id,
      100,
      0,
    );
    expect(tryFindRemovedStore.total).toBe(0); // A store deletada não deve estar na lista
  });

  it('Testando listar todas as lojas', async () => {
    // Chama o método listAll do serviço
    const allStores = await service.listAll(100, 0);

    // Verifica se todas as stores criadas estão na lista
    expect(allStores.total).toBe(storesToTest.length);

    for (const store of storesToTest) {
      const foundStore = allStores.stores.find(
        (s) => s.storeName === store.storeName,
      );
      expect(foundStore).toBeDefined();
    }
  });

  it('testando achar uma loja pelo id', async () => {
    // Cria as stores para testar
    const newStore: CreateStoreDto = {
      storeName: 'Store de Teste de storeById',
      takeOutInStore: true,
      shippingTimeInDays: 3,
      address2: 'Endereço Adicinal 2',
      address3: 'Endereço Adicinal 3',
      type: 'LOJA',
      postalCode: '68906834',
      telephoneNumber: '(11) 91234-5678',
      emailAddress: 'teste@store.com',
    };
    const storeToFind = await service.create(newStore);

    // Chama o método listAllById do serviço
    const foundedStore = await service.storeById(storeToFind.id, 100, 0);

    // Verifica se todas as stores criadas estão na lista
    expect(foundedStore.total).toBe(1);
    expect(foundedStore.stores[0].storeName).toBe(
      'Store de Teste de storeById',
    );

    // Deleta a store criada
    await service.remove(storeToFind.id);
  });

  it('testando listar lojas pelo estado', async () => {
    // Chama o método listAllByState do serviço
    const allStores = await service.storeByState('RS', 100, 0);

    // Verifica se todas as stores criadas estão na lista
    expect(allStores.total).toBe(1);

    for (const store of allStores.stores) {
      expect(store.state).toBe('RS');
    }
  });

  // TESTES DE CEP
  it('deve retornar as duas stores e suas devidas informações', async () => {
    const allStores = await service.storeByCep('99052530', 100, 0);

    // Verifica se todas as stores criadas estão na lista
    expect(allStores.total).toBe(2);

    // Verifica se todas as stores tem o nome da 1, 2 e 3 das criadas no beforeAll
    expect(allStores.stores[0].name).toBe('PDV 1 - MA');
    expect(allStores.stores[1].name).toBe('Loja 1 - BA');

    // verifica se o primeiro a entrega é de motoboy (pois pertence a mesma cidade)
    // E o segundo por ser distante é de correios
    expect(allStores.stores[0].value[0].description).toBe('Motoboy');
    expect(allStores.stores[1].value[0].description).toBe(
      'Sedex a encomenda expressa dos Correios',
    );
    expect(allStores.stores[1].value[1].description).toBe(
      'PAC a encomenda economica dos Correios',
    );

    // Verifica se os pins foram criados criados corretamente
    expect(allStores.pins[0].position.lat).toBeDefined();
    expect(allStores.pins[0].position.lng).toBeDefined();
    expect(allStores.pins[1].position.lat).toBeDefined();
    expect(allStores.pins[1].position.lng).toBeDefined();

    expect(allStores.pins[0].title).toBe('PDV 1 - MA');
    expect(allStores.pins[1].title).toBe('Loja 1 - BA');

    // Verifica se existe a distancia
    expect(allStores.stores[0].distance).toBeDefined();
    expect(allStores.stores[1].distance).toBeDefined();
  });

  it('deve retornar apenas a loja por correios', async () => {
    const allStores = await service.storeByCep('88370340', 100, 0);

    // Verifica se todas as stores criadas estão na lista
    expect(allStores.total).toBe(1);

    // Verifica se todas as stores tem o nome da 1, 2 e 3 das criadas no beforeAll
    expect(allStores.stores[0].name).toBe('Loja 1 - BA');
    expect(allStores.stores[0].type).toBe('LOJA');

    // Verifica se por ser distante é de correios
    expect(allStores.stores[0].value[0].description).toBe(
      'Sedex a encomenda expressa dos Correios',
    );
    expect(allStores.stores[0].value[1].description).toBe(
      'PAC a encomenda economica dos Correios',
    );
  });

  it('deve retornar apenas a loja por motoboy', async () => {
    const allStores = await service.storeByCep('40436760', 100, 0);

    // Verifica se todas as stores criadas estão na lista
    expect(allStores.total).toBe(1);

    // Verifica se todas as stores tem o nome da 1, 2 e 3 das criadas no beforeAll
    expect(allStores.stores[0].name).toBe('Loja 1 - BA');
    expect(allStores.stores[0].type).toBe('LOJA');

    // Verifica se por ser distante é de correios
    expect(allStores.stores[0].value[0].description).toBe('Motoboy');
  });
});
