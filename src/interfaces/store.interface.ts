// Interface principal para Store
export interface Store {
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
export interface StoreComDistance extends Store {
  distance: number;
}

export interface StoreComDistanceValue extends StoreComDistance {
  value: DeliveryValueList;
}

export interface StoreSimplificadaByCep {
  name: string;
  city: string;
  postalCode: string;
  type: string;
  distance: number;
  value: DeliveryValueList;
}

// Interfaces para respostas de listagens e detalhes
export interface StoreListResponse {
  stores: Store[];
  limit: number;
  offset: number;
  total: number;
}

export interface StoreByCepListResponse {
  stores: StoreSimplificadaByCep[];
  pins: Pin[];
  limit: number;
  offset: number;
  total: number;
}

export interface StoreResponse {
  message: string;
  store: Store;
}

// Interface relacionada a Pins
export interface Pin {
  position: {
    lat: number;
    lng: number;
  };
  title: StoreSimplificadaByCep['name'];
}

// Interface para valores de prazos e preços
export interface DeliveryValue {
  prazo: string;
  codProdutoAgencia?: string;
  price: string;
  description: string;
}

// Tipos relacionados a listas
export type StoreList = Store[];
export type StoreComDistanceList = StoreComDistance[];
export type DeliveryValueList = DeliveryValue[];
export type StoreComDistanceValueList = StoreComDistanceValue[];
