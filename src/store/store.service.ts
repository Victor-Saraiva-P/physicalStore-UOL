import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreDocument } from '../schemas/store.schema';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { getCompleteAddressByZipCode } from '../utils/address.util';
import { CompleteAdress, Coordinates } from 'src/interfaces/adress.interface';
import {
  Response1,
  Response2,
} from 'src/store/storeInterfaces/storeResponses.interface';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { mapStoresWithDistances } from 'src/utils/storesDistanceMapper.util';
import { calcularPrecoPrazo } from 'src/apis/correios/precosPrazos.api';
import { Store1ComDistanceValue } from 'src/store/storeInterfaces/store1.interface';
import { Store2, MotoboyEntrega } from './storeInterfaces/store2.interface';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<StoreDocument>) {}

  async create(createStoreDto: CreateStoreDto): Promise<StoreDocument> {
    // obter o endereço completo pelo CEP
    const completeADress: CompleteAdress = await getCompleteAddressByZipCode(
      createStoreDto.postalCode,
    );

    // Padronizar o postalCode para o formato sem hífen (para evitar erros em apis)
    createStoreDto.postalCode = createStoreDto.postalCode.replace('-', '');

    const createdStore = new this.storeModel({
      ...createStoreDto,
      ...completeADress,
    });

    return createdStore.save();
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<StoreDocument> {
    const existingStore = await this.storeModel.findById(id);

    if (updateStoreDto.postalCode) {
      const completeAddress = await getCompleteAddressByZipCode(
        updateStoreDto.postalCode,
      );
      return this.storeModel.findByIdAndUpdate(
        id,
        { ...updateStoreDto, ...completeAddress },
        { new: true },
      );
    }

    return this.storeModel.findByIdAndUpdate(id, updateStoreDto, { new: true });
  }

  async remove(id: string): Promise<void> {
    const result = await this.storeModel.findByIdAndDelete(id);
  }

  async listAll(limit: number, offset: number): Promise<Response1> {
    const stores = await this.storeModel
      .find()
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.storeModel.countDocuments();

    const storeListResponse: Response1 = {
      stores,
      limit,
      offset,
      total,
    };

    return storeListResponse;
  }

  async storeByState(
    state: string,
    limit: number,
    offset: number,
  ): Promise<Response1> {
    const stores = await this.storeModel
      .find({ state })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.storeModel.countDocuments({ state });

    const storeListResponse: Response1 = {
      stores,
      limit,
      offset,
      total,
    };

    return storeListResponse;
  }

  async storeById(
    storeId: string,
    limit: number,
    offset: number,
  ): Promise<Response1> {
    const stores = await this.storeModel
      .find({ _id: storeId })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.storeModel.countDocuments({ _id: storeId });

    const storeListResponse: Response1 = {
      stores,
      limit,
      offset,
      total,
    };

    return storeListResponse;
  }

  async storeByCep(
    cep: string,
    limit: number,
    offset: number,
  ): Promise<Response2> {
    const origin: Coordinates = await getCompleteAddressByZipCode(cep).then(
      (completeAddress) => ({
        latitude: completeAddress.latitude,
        longitude: completeAddress.longitude,
      }),
    );
    const stores = await this.storeModel
      .find()
      .lean()
      .skip(offset)
      .limit(limit)
      .exec();

    // Adiciona distâncias e filtra lojas
    const storesWithDistances = (await mapStoresWithDistances(origin, stores))
      .filter(
        (store) =>
          // Filtra os PDV que estão muito longe e as que não fazem entrega
          !(store.type === 'PDV' && store.distance > 50) ||
          store.takeOutInStore !== false,
      )
      .sort((a, b) => a.distance - b.distance);

    // Calcula prazos e preços para cada loja
    const enrichedStores: Store1ComDistanceValue[] = await Promise.all(
      storesWithDistances.map((store: Store1ComDistanceValue) =>
        this.enrichStoreWithDeliveryDetails(store, cep),
      ),
    );

    // Formata lojas para resposta simplificada
    const storeSimplificadaByCep: Store2[] = enrichedStores.map((store) => ({
      name: store.storeName,
      city: store.city,
      postalCode: store.postalCode,
      type: store.type,
      distance: store.distance,
      value: store.value,
    }));

    return {
      stores: storeSimplificadaByCep.slice(offset, offset + limit),
      pins: enrichedStores.map((store) => ({
        position: {
          lat: store.latitude,
          lng: store.longitude,
        },
        title: store.storeName,
      })),
      limit,
      offset,
      total: storeSimplificadaByCep.length,
    };
  }

  // Função para calcular prazos e preços
  private async enrichStoreWithDeliveryDetails(
    store: Store1ComDistanceValue,
    cep: string,
  ): Promise<Store1ComDistanceValue> {
    if (store.distance <= 50) {
      // Entrega por motoboy
      store.value = [
        {
          prazo: MotoboyEntrega.prazo,
          price: MotoboyEntrega.price,
          description: MotoboyEntrega.description,
        },
      ];
    } else if (store.type === 'LOJA' && store.distance > 50) {
      // Frete via Correios
      const correiosResponse = await calcularPrecoPrazo(cep, store.postalCode);

      // Calcula prazos finais
      const prazoFinalSedex =
        store.shippingTimeInDays +
        parseInt(correiosResponse.sedex.prazo.match(/\d+/)[0]);
      const prazoFinalPac =
        store.shippingTimeInDays +
        parseInt(correiosResponse.pac.prazo.match(/\d+/)[0]);

      store.value = [
        {
          prazo: `${prazoFinalSedex} dias úteis`,
          price: correiosResponse.sedex.precoAgencia,
          description: correiosResponse.sedex.urlTitulo,
        },
        {
          prazo: `${prazoFinalPac} dias úteis`,
          price: correiosResponse.pac.precoAgencia,
          description: correiosResponse.pac.urlTitulo,
        },
      ];
    }

    return store;
  }
}
