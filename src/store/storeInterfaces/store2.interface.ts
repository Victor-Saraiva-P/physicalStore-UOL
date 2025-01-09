export interface Store2 {
  name: string;
  city: string;
  postalCode: string;
  type: string;
  distance: number;
  value: DeliveryValue[];
}

export interface DeliveryValue {
  prazo: string;
  codProdutoAgencia?: string; // Porque motoboy não tem código de produto
  price: string;
  description: string;
}
