export interface Store {
  latitude: string;
  longitude: string;
  address: string;
  address2: string;
  address3: string;
  city: string;
  district: string;
  state: string;
  type: string;
}

export interface StoreListResponse {
  stores: Store[]; // Lista das lojas
  limit: number; // Quantidade máxima de itens por página
  offset: number; // Deslocamento (quantos resultados foram "pulados")
  total: number; // Total de lojas no banco
}

export interface StoreResponse {
  message: string;
  store: Store;
}
