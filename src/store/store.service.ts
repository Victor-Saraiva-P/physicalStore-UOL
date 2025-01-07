import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreDocument } from '../schemas/store.schema';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { getCompleteAddressByZipCode } from '../utils/address.utils';
import { CompleteAdress } from 'src/types/utilsTypes/CompleteAddress.type';

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
}
