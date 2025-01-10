import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEmail,
  Length,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da loja é obrigatório.' })
  @Length(3, 100, {
    message: 'O nome da loja deve ter entre 3 e 100 caracteres.',
  })
  storeName: string;

  @IsOptional()
  @IsBoolean({
    message: 'O campo "takeOutInStore" deve ser um valor booleano.',
  })
  takeOutInStore: boolean;

  @IsNumber({}, { message: 'O tempo de entrega deve ser um número.' })
  @IsNotEmpty({ message: 'O tempo de entrega é obrigatório.' })
  @IsPositive({ message: 'O tempo de entrega deve ser um valor positivo.' })
  shippingTimeInDays: number;

  @IsOptional()
  @IsString({ message: 'O endereço 2 deve ser uma string.' })
  @Length(0, 255, {
    message: 'O endereço 2 pode ter no máximo 255 caracteres.',
  })
  address2: string;

  @IsOptional()
  @IsString({ message: 'O endereço 3 deve ser uma string.' })
  @Length(0, 255, {
    message: 'O endereço 3 pode ter no máximo 255 caracteres.',
  })
  address3: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo da loja é obrigatório.' })
  @IsIn(['PDV', 'LOJA'], {
    message: 'O tipo da loja deve ser "PDV" ou "LOJA".',
  })
  type: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString()
  @Transform(({ value }) => value.replace('-', ''))
  @Matches(/^\d{8}$/, {
    message: 'O CEP deve estar no formato 12345678 (apenas números).',
  })
  postalCode: string;

  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'O telefone deve estar no formato (99) 99999-9999.',
  })
  telephoneNumber: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  emailAddress: string;
}
