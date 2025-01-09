import axios from 'axios';
import { GoogleGeocodeResponse } from '@interfaces/google.interface';
import { BasicAdress, Coordinates } from '@interfaces/adress.interface';

export const getCoordinatesByAddress = async (
  // Usei o BasicAdress ao inves de só o cep, porque deixa o googleGeocode mais acertivo por não depender só do cep
  basicAdress: BasicAdress,
) => {
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
