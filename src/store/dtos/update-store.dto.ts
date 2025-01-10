import { CreateStoreDto } from './create-store.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
