import { ApiProperty } from '@nestjs/swagger';
import { Store1 } from './store1.interface';
import { Store2 } from './store2.interface';
import { Store } from '@schemas/store.schema';

export class PinMaps {
  @ApiProperty({
    example: { lat: -23.55052, lng: -36.4414787 },
    description: 'Latitude e longitude da store',
  })
  position: {
    lat: number;
    lng: number;
  };

  @ApiProperty({
    example: 'Minha Store',
    description: 'Título ou nome do store',
  })
  title: string;
}

export class Response1 {
  @ApiProperty({ type: Store1, description: 'Lista de stores retornadas' })
  stores: Store1[];

  @ApiProperty({ example: 1, description: 'Número máximo de itens por página' })
  limit: number;

  @ApiProperty({ example: 0, description: 'Offset para paginação' })
  offset: number;

  @ApiProperty({ example: 1, description: 'Total de itens disponíveis' })
  total: number;
}

export class Response2 {
  @ApiProperty({ type: [Store2], description: 'Lista de stores retornadas' })
  stores: Store2[];

  @ApiProperty({
    type: [PinMaps],
    description: 'Lista de pins para exibição em mapas',
  })
  pins: PinMaps[];

  @ApiProperty({ example: 1, description: 'Número máximo de itens por página' })
  limit: number;

  @ApiProperty({ example: 0, description: 'Offset para paginação' })
  offset: number;

  @ApiProperty({ example: 10, description: 'Total de itens disponíveis' })
  total: number;
}

export class ResponseCrud {
  @ApiProperty({
    description: 'Mensagem de status da operação',
  })
  message: string;

  @ApiProperty({ description: 'Detalhes da store criada' })
  store: Store;
}
