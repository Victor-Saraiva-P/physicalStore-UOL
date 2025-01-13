import { getAdressByPostalCode } from '@apis/viaCep/viaCep.api';
import { getCoordinates } from '@apis/google/geocode.api';
import { CompleteAdress, Coordinates } from '@classes/adress.interface';

export const getCompleteAddressByPostalCode = async (postalCode: string) => {
  // Usa o via cep para obter o endereço básico
  // Usa o endereço básico com o googlep para obter as coordenadas
  // cep -> via cep -> endereço básico -> google -> coordenadas -> endereço completo (aumenta precisão)

  // obter os dados de endereço pelo Postal code(CEP)
  const basicAdress = await getAdressByPostalCode(postalCode);

  // obter as coordenadas de latitude e longitude pelo endereço
  const coordinates: Coordinates = await getCoordinates(basicAdress);

  // retornar o endereço completo
  const completeAddress: CompleteAdress = {
    ...basicAdress,
    ...coordinates,
  };

  return completeAddress;
};
