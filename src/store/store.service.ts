import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreDocument } from '../schemas/store.schema';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { getEnderecoViaPostalCode } from 'src/utils/viaCep';
import { getCoordenadasPorEndereco } from 'src/utils/geocodingGoogle';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Store') private storeModel: Model<StoreDocument>) {}

  async create(createStoreDto: CreateStoreDto): Promise<StoreDocument> {
    // obter os dados de endereço pelo Posta code(CEP)
    const { address, district, city, state } = await getEnderecoViaPostalCode(
      createStoreDto.postalCode,
    );

    // obter as coordenadas de latitude e longitude pelo endereço
    const { latitude, longitude } = await getCoordenadasPorEndereco(
      address,
      district,
      city,
      state,
    );

    const createdStore = new this.storeModel({
      ...createStoreDto,
      address,
      district,
      city,
      state,
      latitude,
      longitude
    });

    return createdStore.save();
  }
}
