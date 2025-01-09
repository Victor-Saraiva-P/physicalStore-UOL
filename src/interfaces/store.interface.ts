// Interface principal para Store
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

// Interfaces relacionadas à Store com distância e prazos
export interface Store1ComDistance extends Store1 {
  distance: number;
}

export interface Store1ComDistanceValue extends Store1ComDistance {
  value: DeliveryValue[];
}

export interface Store2 {
  name: string;
  city: string;
  postalCode: string;
  type: string;
  distance: number;
  value: DeliveryValue[];
}

// Interfaces para respostas de listagens e detalhes
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

// Interface relacionada a Pins
export interface PinMaps {
  position: {
    lat: number;
    lng: number;
  };
  title: Store2['name'];
}

// Interface para valores de prazos e preços
export interface DeliveryValue {
  prazo: string;
  codProdutoAgencia?: string; // Porque motoboy não tem código de produto
  price: string;
  description: string;
}
