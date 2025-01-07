import axios from 'axios';
import { ViaCepAddress } from '../interfaces/viaCepAddress.interface';
import { BasicAdress } from 'src/types/basicTypes/BasicAddress.interface';

export const getAdressByPostalCode = async (postalCode: string) => {
  const response = await axios.get<ViaCepAddress>(
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
