export interface BasicAdress {
  address: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CompleteAdress extends BasicAdress, Coordinates {}
