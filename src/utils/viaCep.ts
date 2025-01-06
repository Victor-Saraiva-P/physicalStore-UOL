import axios from 'axios';

// Interface que representa os dados retornados pela API ViaCEP
interface Endereco {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  erro?: boolean;
}

// Função para obter dados de endereço pelo CEP usando a API ViaCEP
export const getEnderecoViaPostalCode = async (postalCode: string) => {
  const response = await axios.get<Endereco>(
    `https://viacep.com.br/ws/${postalCode}/json/`,
  );

  const {
    logradouro: address,
    bairro: district,
    localidade: city,
    uf: state,
  } = response.data;

  return {
    address,
    district,
    city,
    state,
  };
};
