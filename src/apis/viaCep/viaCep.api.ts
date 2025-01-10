import axios from 'axios';
import { ViaCepResponse } from '@interfaces/via-cep.interface';
import { BasicAdress } from '@interfaces/adress.interface';

export const getAdressByPostalCode = async (postalCode: string) => {
  const cepRegex = /^[0-9]{8}$/;
  if (!cepRegex.test(postalCode)) {
    throw new Error('Invalid postal code format');
  }

  try {
    const response = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${postalCode}/json/`,
    );

    if (response.data.erro) {
      throw new Error('Cep inválido');
    }

    const basicAdress: BasicAdress = {
      address: response.data.logradouro,
      district: response.data.bairro,
      city: response.data.localidade,
      state: response.data.uf,
    };

    return basicAdress;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error('Cep inválido');
      }

      if (error.code === 'ECONNRESET') {
        throw new Error('Erro ao acessar o ViaCep');
      }
    }

    throw error;
  }
};
