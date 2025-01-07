import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreDocument } from '../schemas/store.schema';
import { Model } from 'mongoose';
import { CreateStoreDto } from './dtos/create-store.dto';
import { getCompleteAddressByZipCode } from '../utils/address.utils';
import { CompleteAdress } from 'src/types/utilsTypes/CompleteAddress.type';
import { StoreListResponse } from 'src/types/basicTypes/store.type';
import { UpdateStoreDto } from './dtos/update-store.dto';

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

  async listAll(limit: number, offset: number): Promise<StoreListResponse> {
    const stores = await this.storeModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.storeModel.countDocuments();

    return {
      stores,
      limit,
      offset,
      total,
    };
  }
}
