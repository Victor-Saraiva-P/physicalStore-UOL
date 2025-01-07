import { BasicAdress } from '../basicTypes/BasicAddress.type';
import { Coordinates } from '../basicTypes/Coordinates.type';

export interface CompleteAdress extends BasicAdress, Coordinates {}
