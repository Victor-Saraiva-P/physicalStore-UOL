import { Controller, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { Body } from '@nestjs/common';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    const store = await this.storeService.create(createStoreDto);
    return {
      message: 'Store Criada com sucesso',
      store,
    };
  }
}
