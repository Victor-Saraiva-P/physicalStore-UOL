export interface BasicAdress {
  address: string;
  district: string;
  city: string;
  state: string;
}

export class Coordinates {
  latitude: number;
  longitude: number;
}

export interface CompleteAdress extends BasicAdress, Coordinates {}
