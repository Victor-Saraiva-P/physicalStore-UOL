import axios from 'axios';
import { GoogleGeocodeResponse } from '@interfaces/google.interface';
import { BasicAdress, Coordinates } from '@interfaces/adress.interface';

export const getCoordinates = async (
  address:
    | string // Ou cep
    | BasicAdress, // Ou um endereço completo
): Promise<Coordinates> => {
  let formattedAddress: string;

  if (typeof address === 'string') {
    formattedAddress = address;
  } else {
    formattedAddress = Object.values(address).join(', ');
  }

  const { data } = await axios.get<GoogleGeocodeResponse>(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address: formattedAddress,
        region: 'br',
        key: process.env.GOOGLE_API_KEY,
      },
    },
  );

  const coordinates: Coordinates = {
    latitude: data.results[0].geometry.location.lat,
    longitude: data.results[0].geometry.location.lng,
  };
  return coordinates;
};
