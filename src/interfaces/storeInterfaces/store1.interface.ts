import { DeliveryValue } from './store2.interface';

import { ApiProperty } from '@nestjs/swagger';

export class Store1 {
  @ApiProperty({ example: 'Minha Loja', description: 'Nome da stores' })
  storeName: string;

  @ApiProperty({
    example: true,
    description: 'Indica se é possível retirar produtos na stores',
  })
  takeOutInStore: boolean;

  @ApiProperty({ example: 3, description: 'Tempo estimado de envio em dias' })
  shippingTimeInDays: number;

  @ApiProperty({ example: -23.55052, description: 'Latitude da stores' })
  latitude: number;

  @ApiProperty({ example: -46.633308, description: 'Longitude da stores' })
  longitude: number;

  @ApiProperty({
    example: 'Rua Exemplo, 123',
    description: 'Endereço principal da stores',
  })
  address: string;

  @ApiProperty({
    example: 'Complemento A',
    description: 'Endereço complementar 1',
  })
  address2: string;

  @ApiProperty({
    example: 'Complemento B',
    description: 'Endereço complementar 2',
  })
  address3: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade onde a stores está localizada',
  })
  city: string;

  @ApiProperty({
    example: 'Centro',
    description: 'Distrito onde a stores está localizada',
  })
  district: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado onde a stores está localizada',
  })
  state: string;

  @ApiProperty({
    example: 'Física',
    description: 'Tipo da stores (exemplo: Física ou Online)',
  })
  type: string;

  @ApiProperty({ example: '01000-000', description: 'CEP da stores' })
  postalCode: string;
}

export interface Store1ComDistance extends Store1 {
  distance: number;
}

export interface Store1ComDistanceValue extends Store1ComDistance {
  value: DeliveryValue[];
}
