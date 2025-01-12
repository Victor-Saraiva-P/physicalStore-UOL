import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreDocument } from '@schemas/store.schema';
import { CreateStoreDto } from './dtos/create-store.dto';
import { getCompleteAddressByZipCode } from '@utils/address.util';
import { mapStoresWithDistances } from '@utils/storesDistanceMapper.util';
import { calcularPrecoPrazo } from '@apis/correios/precosPrazos.api';
import { CompleteAdress, Coordinates } from '@interfaces/adress.interface';
import {
  Response1,
  Response2,
} from '@storeInterfaces/storeResponses.interface';
import { Store1ComDistanceValue } from '@storeInterfaces/store1.interface';
import { Store2, MotoboyEntrega } from '@storeInterfaces/store2.interface';
import { getCoordinates } from '@apis/google/geocode.api';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<StoreDocument>) {}

  async create(createStoreDto: CreateStoreDto): Promise<StoreDocument> {
    // obter o endereço completo pelo CEP
    const completeADress: CompleteAdress = await getCompleteAddressByZipCode(
      createStoreDto.postalCode,
    );

    const createdStore = new this.storeModel({
      ...createStoreDto,
      ...completeADress,
    });

    return createdStore.save();
  }

  async update(
    id: string,
    updateStoreDto: Partial<CreateStoreDto>,
  ): Promise<StoreDocument> {
    const existingStore = await this.storeModel.findById(id);

    if (!existingStore) {
      throw new HttpException('Store não encontrada', HttpStatus.NOT_FOUND);
    }

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
    if (!result) {
      throw new HttpException('Store não encontrada', HttpStatus.NOT_FOUND);
    }
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
    const FormatedState = state.toUpperCase();
    const stores = await this.storeModel
      .find({ state: FormatedState })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.storeModel.countDocuments({
      state: FormatedState,
    });

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
    // Obtém as coordenadas do CEP informado
    const origin: Coordinates = await getCoordinates(cep);

    // Recupera todas as stores do banco
    const allStores = await this.storeModel.find().lean().exec();

    // Adiciona distâncias às stores e aplica os filtros e ordena
    const storesWithDistances = (
      await mapStoresWithDistances(origin, allStores)
    )
      .filter(
        (store) =>
          store.takeOutInStore !== false &&
          (store.type !== 'PDV' || store.distance <= 50),
      )
      .sort((a, b) => a.distance - b.distance);

    // Aplica paginação após o cálculo das distâncias (usando o limit para mostrar as stores mais proximas)
    const paginatedStores = storesWithDistances.slice(offset, offset + limit);

    // Calcula prazos e preços para cada store paginada
    const enrichedStores: Store1ComDistanceValue[] = await Promise.all(
      paginatedStores.map((store: Store1ComDistanceValue) =>
        this.enrichStoreWithDeliveryDetails(store, cep),
      ),
    );

    // Formata Stores para a Store2 (para encaixar no response da rota)
    const storeSimplificadaByCep: Store2[] = enrichedStores.map((store) => ({
      name: store.storeName,
      city: store.city,
      postalCode: store.postalCode,
      type: store.type,
      distance: store.distance,
      value: store.value,
    }));

    return {
      stores: storeSimplificadaByCep,
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
          prazo: `${MotoboyEntrega.prazo + store.shippingTimeInDays} dias úteis`,
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
          codProdutoAgencia: correiosResponse.sedex.codProdutoAgencia,
        },
        {
          prazo: `${prazoFinalPac} dias úteis`,
          price: correiosResponse.pac.precoAgencia,
          description: correiosResponse.pac.urlTitulo,
          codProdutoAgencia: correiosResponse.pac.codProdutoAgencia,
        },
      ];
    }

    return store;
  }
}
