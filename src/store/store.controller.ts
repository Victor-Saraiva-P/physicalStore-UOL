import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Body } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { StoreListResponse } from 'src/types/basicTypes/store.type';

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

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const store = await this.storeService.update(id, updateStoreDto);
    return {
      message: 'Store Atualizada com sucesso',
      store,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    await this.storeService.remove(id);
    return {
      message: 'Store Removida com sucesso',
    };
  }

  @Get('listAll')
  async listAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<StoreListResponse> {
    return this.storeService.listAll(Number(limit), Number(offset));
  }
}
