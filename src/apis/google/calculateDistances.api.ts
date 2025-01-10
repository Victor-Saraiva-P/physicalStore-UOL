import axios, { AxiosError } from 'axios';
import { Coordinates } from '@interfaces/adress.interface';
import { GoogleDistanceResponse } from '@interfaces/google.interface';

export async function calculateDistances(
  origin: Coordinates,
  destinations: { latitude: number; longitude: number }[],
): Promise<number[]> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Chave da API do Google não configurada');
    }

    if (!destinations.length) {
      throw new Error('Lista de destinos está vazia');
    }

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
      throw new Error('Nenhum resultado encontrado na resposta da API do Google');
    }

    return elements.map((element) => {
      if (element.status !== 'OK') {
        throw new Error(`Erro no cálculo de distância: ${element.status}`);
      }
      return element.distance.value;
    });

  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erro na requisição à API do Google: ${error.message}`);
    }
    throw error;
  }
}
