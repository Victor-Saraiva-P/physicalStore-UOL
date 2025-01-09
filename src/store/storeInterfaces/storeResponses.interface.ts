import { Store1 } from './store1.interface';
import { Store2 } from './store2.interface';

export interface Response1 {
  stores: Store1[];
  limit: number;
  offset: number;
  total: number;
}

export interface Response2 {
  stores: Store2[];
  pins: PinMaps[];
  limit: number;
  offset: number;
  total: number;
}

export interface ResponseCrud {
  message: string;
  store: Store1;
}

export interface PinMaps {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
}
