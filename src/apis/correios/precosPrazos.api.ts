import axios from 'axios';
import { PrecoPrazoResponse } from '../../interfaces/correios.interface';

export const calcularPrecoPrazo = async (
  cepOrigem: string,
  cepDestino: string,
): Promise<PrecoPrazoResponse> => {
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
  return pracoPrazoResponse; // Retorna a lista de opções de preço e prazo
};
