import axios from 'axios';
import { ViaCepResponse } from '@interfaces/via-cep.interface';
import { BasicAdress } from '@interfaces/adress.interface';

export const getAdressByPostalCode = async (postalCode: string) => {
  const response = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${postalCode}/json/`,
  );

  const basicAdress: BasicAdress = {
    address: response.data.logradouro,
    district: response.data.bairro,
    city: response.data.localidade,
    state: response.data.uf,
  };

  return basicAdress;
};
