import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validateEnvVariables } from '@validators/env-variables.validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Validando as variáveis de ambiente
  validateEnvVariables();

  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Physical Store API')
    .setDescription('API para gerenciar lojas físicas e calcular distâncias')
    .setVersion('1.0')
    .addTag('stores') // Adicione tags relevantes para organizar os endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Acessível em /api

  // Habilitando o class-validator
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
