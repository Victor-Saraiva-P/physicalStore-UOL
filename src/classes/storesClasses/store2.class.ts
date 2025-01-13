import { ApiProperty } from '@nestjs/swagger';

export class DeliveryValue {
  @ApiProperty({
    example: 'PAC a encomenda economica dos Correios',
    description: 'Tipo de frete',
  })
  description: string;

  @ApiProperty({ example: 'R$ 58,20', description: 'Custo do frete em reais' })
  price: string;

  @ApiProperty({
    example: '9 dias úteis',
    description:
      'Tempo de entrega estimado em dias uteis (tempo de preparo + prazo de entrega)',
  })
  prazo: string;

  @ApiProperty({
    example: '04014',
    description: 'Código do produto (Aparece apenas para entregas do correio)',
    required: false,
  })
  codProdutoAgencia?: string;
}

export class Store2 {
  @ApiProperty({ example: 'Minha stores', description: 'Nome da stores' })
  name: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade onde a stores está localizada',
  })
  city: string;

  @ApiProperty({ example: '01000000', description: 'CEP da stores' })
  postalCode: string;

  @ApiProperty({
    example: 'LOJA',
    description: 'Tipo da stores (exemplo: LOJA ou PDV)',
  })
  type: string;

  @ApiProperty({
    example: 12.5,
    description: 'Distância da stores em quilômetros',
  })
  distance: number;

  @ApiProperty({
    type: [DeliveryValue],
    description: 'Lista de opções de entrega e seus valores',
  })
  value: DeliveryValue[];
}
