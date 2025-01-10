import axios, { AxiosError } from 'axios';
import { PrecoPrazoResponse } from '@interfaces/correios.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

export const calcularPrecoPrazo = async (
  cepOrigem: string,
  cepDestino: string,
): Promise<PrecoPrazoResponse> => {
  try {
    const response = await axios.post<PrecoPrazoResponse>(
      'https://www.correios.com.br/@@precosEPrazosView',
      {
        cepOrigem,
        cepDestino,
        comprimento: '20',
        largura: '15',
        altura: '10',
      },
    );

    const pracoPrazoResponse: PrecoPrazoResponse = {
      sedex: response.data[0],
      pac: response.data[1],
    };
    return pracoPrazoResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new HttpException(
        `Erro na requisição aos Correios: ${error.message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    throw error;
  }
};
