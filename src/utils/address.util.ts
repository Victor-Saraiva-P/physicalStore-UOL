import { getAdressByPostalCode } from '@apis/viaCep/viaCep.api';
import { getCoordinatesByAddress } from '@apis/google/geocode.api';
import { CompleteAdress, Coordinates } from '@interfaces/adress.interface';

export const getCompleteAddressByZipCode = async (postalCode: string) => {
  // obter os dados de endereço pelo Postal code(CEP)
  const basicAdress = await getAdressByPostalCode(postalCode);

  // obter as coordenadas de latitude e longitude pelo endereço
  const coordinates: Coordinates = await getCoordinatesByAddress(basicAdress);

  // retornar o endereço completo
  const completeAddress: CompleteAdress = {
    ...basicAdress,
    ...coordinates,
  };

  return completeAddress;
};
