import axios from 'axios';
import { Coordinates } from '@interfaces/adress.interface';
import { GoogleDistanceResponse } from '@interfaces/google.interface';

export async function calculateDistances(
  origin: Coordinates,
  destinations: { latitude: number; longitude: number }[],
): Promise<number[]> {
  const destinationCoordinates = destinations
    .map((dest) => `${dest.latitude},${dest.longitude}`)
    .join('|');

  const response = await axios.get<GoogleDistanceResponse>(
    'https://maps.googleapis.com/maps/api/distancematrix/json',
    {
      params: {
        origins: `${origin.latitude},${origin.longitude}`,
        destinations: destinationCoordinates,
        key: process.env.GOOGLE_API_KEY,
      },
    },
  );

  const elements = response.data.rows[0]?.elements;

  if (!elements || elements.length === 0) {
    throw new Error('Erro ao calcular distâncias com a API do Google');
  }

  return elements.map((element) => element.distance.value);
}
