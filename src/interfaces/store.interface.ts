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
}

export interface StoreComDistancePrazo {
  name: string;
  city: string;
  postalCode: string;
  type: string;
  distance: string;
  value: {
    prazo: string;
    codProdutoAgencia?: string;
    price: string;
    description: string;
  };
}

export interface StoreListResponse {
  stores: Store[];
  limit: number; 
  offset: number;
  total: number;
}

export interface StoreDistanceListResponse {
  stores: StoreComDistancePrazo[];
  pints: Pins[];
  limit: number; 
  offset: number;
  total: number;
}

export interface StoreResponse {
  message: string;
  store: Store;
}

export interface Pins {
  position: {
    lat: number;
    lng: number;
  };

  title: StoreComDistancePrazo['name'];
}
