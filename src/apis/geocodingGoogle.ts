import axios from 'axios';
import { GoogleGeocodeResponse } from '../types/apisTypes/GoogleGeocodeResponse.type';
import { BasicAdress } from 'src/types/basicTypes/BasicAddress.type';
import { Coordinates } from 'src/types/basicTypes/Coordinates.type';

export const getCoordinatesByAddress = async (basicAdress: BasicAdress) => {
  const enderecoCompleto = Object.values(basicAdress).join(', ');

  const { data } = await axios.get<GoogleGeocodeResponse>(
    'https://maps.googleapis.com/maps/api/geocode/json',
    {
      params: {
        address: enderecoCompleto,
        region: 'br',
        key: process.env.GOOGLE_API_KEY,
      },
    },
  );

  // coloca o resultado da api nas constantes de latitude e longitude
  const coordinates: Coordinates = {
    latitude: data.results[0].geometry.location.lat,
    longitude: data.results[0].geometry.location.lng,
  };
  return coordinates;
};
