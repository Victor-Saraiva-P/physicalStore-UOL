import axios from 'axios';
import { ViaCepResponse } from '@interfaces/via-cep.interface';
import { BasicAdress } from '@interfaces/adress.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getAdressByPostalCode = async (postalCode: string) => {
  try {
    const response = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${postalCode}/json/`,
    );

    if (response.data.erro) {
      throw new HttpException('CEP inválido', HttpStatus.BAD_REQUEST);
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
        throw new HttpException('CEP inválido', HttpStatus.BAD_REQUEST);
      }

      if (error.code === 'ECONNRESET') {
        throw new HttpException(
          'Erro ao acessar o ViaCep',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

    throw error;
  }
};
