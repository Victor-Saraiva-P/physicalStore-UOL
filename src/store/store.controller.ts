import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import {
  Response2,
  Response1,
  ResponseCrud,
} from '@storeInterfaces/storeResponses.interface';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto): Promise<ResponseCrud> {
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
  ): Promise<ResponseCrud> {
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
  ): Promise<Response1> {
    return this.storeService.listAll(Number(limit), Number(offset));
  }

  @Get('state/:state')
  async getStoresByState(
    @Param('state') state: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<Response1> {
    return this.storeService.storeByState(state, Number(limit), Number(offset));
  }

  @Get(':id')
  async getStoreById(
    @Param('id') id: string,
    @Query('limit') limit: number = 1,
    @Query('offset') offset: number = 0,
  ): Promise<Response1> {
    return this.storeService.storeById(id, Number(limit), Number(offset));
  }

  @Get('by-cep/:cep')
  async getStoresByCep(
    @Param('cep') cep: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): // adicionar tipo de de response
  Promise<Response2> {
    return this.storeService.storeByCep(cep, Number(limit), Number(offset));
  }
}
