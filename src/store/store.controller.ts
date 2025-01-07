import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { Body } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import {
  StoreListResponse,
  StoreResponse,
} from 'src/interfaces/store.interface';
import { Store, StoreDocument } from 'src/schemas/store.schema';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto): Promise<StoreResponse> {
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
  ): Promise<StoreResponse> {
    const store = await this.storeService.update(id, updateStoreDto);
    return {
      message: 'Store Atualizada com sucesso',
      store,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
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

  @Get('state/:state')
  async getStoresByState(
    @Param('state') state: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<StoreListResponse> {
    return this.storeService.storeByState(state, Number(limit), Number(offset));
  }

  @Get(':id')
  async getStoreById(@Param('id') id: string): Promise<StoreResponse> {
    const store = await this.storeService.storeById(id);
    return {
      message: 'Store Encontrada com sucesso',
      store,
    };
  }
}
