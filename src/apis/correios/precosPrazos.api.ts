import axios, { AxiosError } from 'axios';
import { PrecoPrazoResponse } from '@interfaces/correios.interface';

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

    if (!response.data || !Array.isArray(response.data) || response.data.length < 2) {
      throw new Error('Resposta inválida dos Correios');
    }

    const pracoPrazoResponse: PrecoPrazoResponse = {
      sedex: response.data[0],
      pac: response.data[1],
    };
    return pracoPrazoResponse;

  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Erro na requisição aos Correios: ${error.message}`);
    }
    throw error;
  }
};
