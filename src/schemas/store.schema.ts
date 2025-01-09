import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define o tipo para documentos de loja
export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop()
  storeName: string;

  @Prop({ default: true })
  takeOutInStore: boolean; // Assumir que o produto está sempre disponivel

  @Prop()
  shippingTimeInDays: number;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  address: string;

  @Prop()
  address2: string;

  @Prop()
  address3: string;

  @Prop()
  city: string;

  @Prop()
  district: string;

  @Prop()
  state: string;

  @Prop({ enum: ['PDV', 'LOJA'] })
  type: string;

  @Prop({ default: 'Brasil' })
  country: string;

  @Prop()
  postalCode: string;

  @Prop()
  telephoneNumber: string;

  @Prop()
  emailAddress: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
