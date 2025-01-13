import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

// Define o tipo para documentos de store
export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @ApiProperty({
    example: 'Minha Loja',
    description: 'Nome da loja',
    minLength: 3,
    maxLength: 100,
  })
  @Prop({
    required: [true, 'O nome da loja é obrigatório.'],
    type: String,
    minlength: [3, 'O nome da loja deve ter no mínimo 3 caracteres.'],
    maxlength: [100, 'O nome da loja deve ter no máximo 100 caracteres.'],
  })
  storeName: string;

  @ApiProperty({
    example: true,
    description: 'Indica se é possível retirar produtos na loja',
    default: true,
  })
  @Prop({
    type: Boolean,
    default: true,
  })
  takeOutInStore: boolean;

  @ApiProperty({
    example: 3,
    description: 'Tempo estimado de envio em dias',
    minimum: 1,
  })
  @Prop({
    required: [true, 'O tempo de entrega é obrigatório.'],
    type: Number,
    min: [1, 'O tempo de entrega deve ser um valor positivo.'],
  })
  shippingTimeInDays: number;

  @ApiProperty({
    example: -23.55052,
    description: 'Latitude da loja',
    required: true,
  })
  @Prop({
    type: Number,
    required: [true, 'A latitude é obrigatória.'],
  })
  latitude: number;

  @ApiProperty({
    example: -46.633308,
    description: 'Longitude da loja',
    required: true,
  })
  @Prop({
    type: Number,
    required: [true, 'A longitude é obrigatória.'],
  })
  longitude: number;

  @ApiProperty({
    example: 'Rua Exemplo, 123',
    description: 'Endereço principal da loja',
    required: true,
  })
  @Prop({
    type: String,
    required: [true, 'O endereço principal é obrigatório.'],
  })
  address: string;

  @ApiProperty({
    example: 'Complemento A',
    description: 'Endereço complementar 1',
    maxLength: 255,
  })
  @Prop({
    type: String,
    maxlength: [
      255,
      'O endereço complementar 1 pode ter no máximo 255 caracteres.',
    ],
  })
  address2: string;

  @ApiProperty({
    example: 'Complemento B',
    description: 'Endereço complementar 2',
    maxLength: 255,
  })
  @Prop({
    type: String,
    maxlength: [
      255,
      'O endereço complementar 2 pode ter no máximo 255 caracteres.',
    ],
  })
  address3: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade onde a loja está localizada',
    required: true,
  })
  @Prop({
    type: String,
    required: [true, 'A cidade é obrigatória.'],
  })
  city: string;

  @ApiProperty({
    example: 'Centro',
    description: 'Distrito onde a loja está localizada',
    required: true,
  })
  @Prop({
    type: String,
    required: [true, 'O distrito é obrigatório.'],
  })
  district: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado onde a loja está localizada',
    required: true,
  })
  @Prop({
    type: String,
    required: [true, 'O estado é obrigatório.'],
  })
  state: string;

  @ApiProperty({
    example: 'PDV',
    description: 'Tipo da loja (exemplo: PDV ou LOJA)',
    enum: ['PDV', 'LOJA'],
    required: true,
  })
  @Prop({
    type: String,
    required: [true, 'O tipo da loja é obrigatório.'],
    enum: {
      values: ['PDV', 'LOJA'],
      message: 'O tipo da loja deve ser "PDV" ou "LOJA".',
    },
  })
  type: string;

  @ApiProperty({
    example: 'Brasil',
    description: 'País onde a loja está localizada',
    default: 'Brasil',
  })
  @Prop({
    type: String,
    default: 'Brasil',
  })
  country: string;

  @ApiProperty({
    example: '01000000',
    description: 'CEP da loja no formato 12345678',
    required: true,
    pattern: '^\\d{8}$',
  })
  @Prop({
    type: String,
    required: [true, 'O CEP é obrigatório.'],
    match: [/^\d{8}$/, 'O CEP deve estar no formato 12345678.'],
  })
  postalCode: string;

  @ApiProperty({
    example: '(11) 98765-4321',
    description: 'Telefone da loja no formato (99) 99999-9999',
    pattern: '^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$',
  })
  @Prop({
    type: String,
    match: [
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'O telefone deve estar no formato (99) 99999-9999.',
    ],
  })
  telephoneNumber: string;

  @ApiProperty({
    example: 'exemplo@store.com',
    description: 'E-mail de contato da loja',
    pattern: '.+@.+\\..+',
  })
  @Prop({
    type: String,
    match: [/.+@.+\..+/, 'O e-mail deve ser válido.'],
  })
  emailAddress: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Middleware para normalizar o CEP
StoreSchema.pre('save', function (next) {
  if (this.postalCode) {
    this.postalCode = this.postalCode.replace(/\D/g, '');
  }
  next();
});

StoreSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate() as any;
  if (update && update.postalCode) {
    update.postalCode = update.postalCode.replace(/\D/g, '');
  }
  next();
});
