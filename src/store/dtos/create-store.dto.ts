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
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Nome da stores',
    example: 'Minha Loja',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome da stores é obrigatório.' })
  @Length(3, 100, {
    message: 'O nome da stores deve ter entre 3 e 100 caracteres.',
  })
  storeName: string;

  @ApiProperty({
    description: 'Se o produto pode ser retirado na stores',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({
    message: 'O campo "takeOutInStore" deve ser um valor booleano.',
  })
  takeOutInStore?: boolean;

  @ApiProperty({
    description: 'Tempo estimado de entrega em dias',
    example: 3,
    minimum: 1,
  })
  @IsNumber({}, { message: 'O tempo de entrega deve ser um número.' })
  @IsNotEmpty({ message: 'O tempo de entrega é obrigatório.' })
  @IsPositive({ message: 'O tempo de entrega deve ser um valor positivo.' })
  shippingTimeInDays: number;

  @ApiProperty({
    description: 'Endereço complementar da lojstoresa',
    example: 'Apto 101',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O endereço 2 deve ser uma string.' })
  @Length(0, 255, {
    message: 'O endereço 2 pode ter no máximo 255 caracteres.',
  })
  address2?: string;

  @ApiProperty({
    description: 'Outro endereço complementar da stores',
    example: 'Bloco B',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O endereço 3 deve ser uma string.' })
  @Length(0, 255, {
    message: 'O endereço 3 pode ter no máximo 255 caracteres.',
  })
  address3?: string;

  @ApiProperty({
    description: 'Tipo da stores (PDV ou LOJA)',
    example: 'PDV',
    enum: ['PDV', 'LOJA'],
  })
  @IsString()
  @IsNotEmpty({ message: 'O tipo da stores é obrigatório.' })
  @IsIn(['PDV', 'LOJA'], {
    message: 'O tipo da stores deve ser "PDV" ou "LOJA".',
  })
  type: string;

  @ApiProperty({
    description: 'CEP da stores',
    example: '12345678',
    pattern: '^\\d{8}$',
  })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'O CEP deve estar no formato 12345678 (apenas números).',
  })
  postalCode: string;

  @ApiProperty({
    description: 'Telefone da stores',
    example: '(11) 99999-9999',
    required: false,
    pattern: '^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'O telefone deve estar no formato (99) 99999-9999.',
  })
  telephoneNumber?: string;

  @ApiProperty({
    description: 'E-mail da stores',
    example: 'contato@loja.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'O e-mail deve ser válido.' })
  emailAddress?: string;
}
