import axios, { AxiosError } from 'axios';
import { GoogleGeocodeResponse } from '@interfaces/google.interface';
import { BasicAdress, Coordinates } from '@interfaces/adress.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getCoordinates = async (
  address: string | BasicAdress,
): Promise<Coordinates> => {
  try {
    let formattedAddress: string;

    if (typeof address === 'string') {
      formattedAddress = address;
    } else {
      formattedAddress = Object.values(address).join(', ');
    }

    if (!process.env.GOOGLE_API_KEY) {
      throw new HttpException(
        'Google API key não configurada',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

    if (!data.results || data.results.length === 0) {
      throw new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND);
    }

    const coordinates: Coordinates = {
      latitude: data.results[0].geometry.location.lat,
      longitude: data.results[0].geometry.location.lng,
    };
    return coordinates;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new HttpException(
        `Erro na requisição ao Google Geocoding: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    throw error;
  }
};
