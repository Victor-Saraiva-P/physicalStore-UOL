import { DeliveryValue } from './store2.interface';

export interface Store1 {
  storeName: string;
  takeOutInStore: boolean;
  shippingTimeInDays: number;
  latitude: number;
  longitude: number;
  address: string;
  address2: string;
  address3: string;
  city: string;
  district: string;
  state: string;
  type: string;
  postalCode: string;
}

export interface Store1ComDistance extends Store1 {
  distance: number;
}

export interface Store1ComDistanceValue extends Store1ComDistance {
  value: DeliveryValue[];
}
