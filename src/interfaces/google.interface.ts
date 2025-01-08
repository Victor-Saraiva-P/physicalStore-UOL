export interface GoogleGeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}

export interface GoogleDistanceElement {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
}

export interface GoogleDistanceResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: GoogleDistanceElement[];
  }[];
  status: string;
}
