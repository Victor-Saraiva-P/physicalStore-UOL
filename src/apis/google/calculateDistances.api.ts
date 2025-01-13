import axios, { AxiosError } from 'axios';
import { Coordinates } from '@classes/adress.interface';
import { GoogleDistanceResponse } from '@classes/google.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function calculateDistances(
  origin: Coordinates,
  destinations: { latitude: number; longitude: number }[],
): Promise<number[]> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new HttpException(
        'Chave da API do Google não configurada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!destinations.length) {
      throw new HttpException(
        'Lista de destinos está vazia',
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        'Nenhum resultado encontrado na resposta da API do Google',
        HttpStatus.BAD_REQUEST,
      );
    }

    return elements.map((element) => {
      if (element.status !== 'OK') {
        throw new HttpException(
          `Erro no cálculo de distância: ${element.status}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return element.distance.value;
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new HttpException(
        `Erro na requisição à API do Google: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    throw error;
  }
}
