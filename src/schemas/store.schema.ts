import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define o tipo para documentos de loja
export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({
    required: [true, 'O nome da loja é obrigatório.'],
    type: String,
    minlength: [3, 'O nome da loja deve ter no mínimo 3 caracteres.'],
    maxlength: [100, 'O nome da loja deve ter no máximo 100 caracteres.'],
  })
  storeName: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  takeOutInStore: boolean; // Assume que o produto está sempre disponível

  @Prop({
    required: [true, 'O tempo de entrega é obrigatório.'],
    type: Number,
    min: [1, 'O tempo de entrega deve ser um valor positivo.'],
  })
  shippingTimeInDays: number;

  @Prop({
    type: Number,
    required: [true, 'A latitude é obrigatória.'],
  })
  latitude: number;

  @Prop({
    type: Number,
    required: [true, 'A longitude é obrigatória.'],
  })
  longitude: number;

  @Prop({
    type: String,
    required: [true, 'O endereço principal é obrigatório.'],
  })
  address: string;

  @Prop({
    type: String,
    maxlength: [255, 'O endereço 2 pode ter no máximo 255 caracteres.'],
  })
  address2: string;

  @Prop({
    type: String,
    maxlength: [255, 'O endereço 3 pode ter no máximo 255 caracteres.'],
  })
  address3: string;

  @Prop({
    type: String,
    required: [true, 'A cidade é obrigatória.'],
  })
  city: string;

  @Prop({
    type: String,
    required: [true, 'O distrito é obrigatório.'],
  })
  district: string;

  @Prop({
    type: String,
    required: [true, 'O estado é obrigatório.'],
  })
  state: string;

  @Prop({
    type: String,
    required: [true, 'O tipo da loja é obrigatório.'],
    enum: {
      values: ['PDV', 'LOJA'],
      message: 'O tipo da loja deve ser "PDV" ou "LOJA".',
    },
  })
  type: string;

  @Prop({
    type: String,
    default: 'Brasil',
  })
  country: string;

  @Prop({
    type: String,
    required: [true, 'O CEP é obrigatório.'],
    match: [/^\d{8}$/, 'O CEP deve estar no formato 12345678.'],
  })
  postalCode: string;

  @Prop({
    type: String,
    match: [
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'O telefone deve estar no formato (99) 99999-9999.',
    ],
  })
  telephoneNumber: string;

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
    this.postalCode = this.postalCode.replace('-', '');
  }
  next();
});
