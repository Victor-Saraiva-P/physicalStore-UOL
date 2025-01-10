import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

// Carregando o arquivo .env
dotenv.config();

export function validateEnvVariables() {
  const requiredVariables = [
    'MONGO_URI',
    'PORT',
    'GOOGLE_API_KEY',
    'PRODUCT_COMPRIMENTO',
    'PRODUCT_LARGURA',
    'PRODUCT_ALTURA',
  ];

  const missingVariables = requiredVariables.filter((key) => !process.env[key]);

  if (missingVariables.length > 0) {
    const logger = new Logger('EnvironmentValidation');
    logger.error(
      `Faltam as seguintes variáveis de ambiente no .env: ${missingVariables.join(', ')}`,
    );
    throw new Error(
      'Configuração inválida do arquivo .env. Verifique as variáveis ausentes e tente novamente.',
    );
  }

  // Mensagem opcional para sucesso
  const logger = new Logger('EnvironmentValidation');
  logger.log('Todas as variáveis de ambiente estão configuradas corretamente.');
}
