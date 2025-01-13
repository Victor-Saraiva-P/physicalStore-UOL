import { calculateDistances } from '@apis/google/calculateDistances.api';
import { Coordinates } from '@classes/adress.interface';
import {
  Store1ComDistance,
  Store1,
} from '@classes/storesClasses/store1.classe';

export async function mapStoresWithDistances(
  origin: Coordinates,
  stores: Store1[],
): Promise<Store1ComDistance[]> {
  const distances = await calculateDistances(origin, stores);

  // Verifica se o número de distâncias corresponde ao número de stores
  if (distances.length !== stores.length) {
    throw new Error('Number of distances does not match number of stores.');
  }

  // Adiciona a distância a cada store
  const storesWithDistance = stores.map((store, index) => ({
    ...store,
    distance: distances[index] / 1000, // Convert meters to kilometers
  }));

  return storesWithDistance;
}
