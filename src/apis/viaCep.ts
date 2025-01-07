import axios from 'axios';
import { ViaCepResponse } from '../interfaces/viaCep.interface';
import { BasicAdress } from 'src/interfaces/adress.interface';

export const getAdressByPostalCode = async (postalCode: string) => {
  const response = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${postalCode}/json/`,
  );

  const basicAdress: BasicAdress = {
    address: response.data.logradouro,
    district: response.data.bairro,
    city: response.data.localidade,
    state: response.data.uf,
    postalCode: response.data.cep,
  };

  return basicAdress;
};
