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
import {
  Response2,
  Response1,
  ResponseCrud,
} from '@classes/storeClasses/storeResponses.class';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Stores')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova store' })
  @ApiBody({
    description: 'Dados para criar uma store',
    type: CreateStoreDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Loja criada com sucesso',
    type: ResponseCrud,
  })
  async create(@Body() createStoreDto: CreateStoreDto): Promise<ResponseCrud> {
    const store = await this.storeService.create(createStoreDto);
    return {
      message: 'Store Criada com sucesso',
      store,
    };
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Atualiza os dados de uma store' })
  @ApiParam({
    name: 'id',
    description: 'ID da store a ser atualizada',
    required: true,
  })
  @ApiBody({
    description: 'Dados para atualizar a store',
    type: CreateStoreDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Loja atualizada com sucesso',
    type: ResponseCrud,
  })
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: Partial<CreateStoreDto>,
  ): Promise<ResponseCrud> {
    const store = await this.storeService.update(id, updateStoreDto);
    return {
      message: 'Store Atualizada com sucesso',
      store,
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove uma store pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da store a ser removida',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Loja removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Store Removida com sucesso',
        },
      },
    },
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.storeService.remove(id);
    return {
      message: 'Store Removida com sucesso',
    };
  }

  @Get('listAll')
  @ApiOperation({ summary: 'Lista todas as stores' })
  @ApiQuery({
    name: 'limit',
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Offset para paginação',
    required: false,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de stores retornada com sucesso',
    type: Response1,
  })
  async listAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<Response1> {
    return this.storeService.listAll(Number(limit), Number(offset));
  }

  @Get('state/:state')
  @ApiOperation({ summary: 'Filtra stores por estado' })
  @ApiParam({
    name: 'state',
    description: 'Sigla do estado para filtrar',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Offset para paginação',
    required: false,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de stores filtrada por estado',
    type: Response1,
  })
  async getStoresByState(
    @Param('state') state: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<Response1> {
    return this.storeService.storeByState(state, Number(limit), Number(offset));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca store pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da store', required: true })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da store retornados com sucesso',
    type: Response1,
  })
  async getStoreById(@Param('id') id: string): Promise<Response1> {
    return this.storeService.storeById(id, 1, 0);
  }

  @Get('by-cep/:cep')
  @ApiOperation({
    summary: 'Busca stores próximas a um CEP e calcula sua entrega',
  })
  @ApiParam({
    name: 'cep',
    description: 'CEP para buscar stores próximas',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Quantidade de itens por página',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Offset para paginação',
    required: false,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Lojas próximas ao CEP retornadas com sucesso',
    type: Response2,
  })
  async getStoresByCep(
    @Param('cep') cep: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<Response2> {
    return this.storeService.storeByCep(cep, Number(limit), Number(offset));
  }
}
