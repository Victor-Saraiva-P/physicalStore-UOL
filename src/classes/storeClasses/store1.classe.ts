import { DeliveryValue } from './store2.class';

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
    example: 'PDV',
    description: 'Tipo da stores (exemplo: PDV ou LOJA)',
  })
  type: string;

  @ApiProperty({
    example: 'Brasil',
    description: 'País onde a stores está localizada',
    default: 'Brasil',
  })
  country: string;

  @ApiProperty({
    example: '01000000',
    description: 'CEP da stores no formato 12345678',
  })
  postalCode: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Telefone da stores no formato (99) 99999-9999',
  })
  telephoneNumber: string;

  @ApiProperty({
    example: 'exemplo@store.com',
    description: 'E-mail de contato da stores',
  })
  emailAddress: string;
}

export interface Store1ComDistance extends Store1 {
  distance: number;
}

export interface Store1ComDistanceValue extends Store1ComDistance {
  value: DeliveryValue[];
}
