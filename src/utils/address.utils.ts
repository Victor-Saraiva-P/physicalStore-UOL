import { getAdressByPostalCode } from 'src/apis/viaCep';
import { getCoordinatesByAddress } from 'src/apis/geocodingGoogle';
import { Coordinates } from 'src/types/basicTypes/Coordinates.type';
import { CompleteAdress } from 'src/types/utilsTypes/CompleteAddress.type';

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
