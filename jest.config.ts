import { Config } from 'jest';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src', // Base da aplicação onde estão os arquivos de código
  testRegex: '.*\\.spec\\.ts$', // Testes unitários e integração devem terminar com .spec.ts
  transform: {
    '^.+\\.ts$': 'ts-jest', // Usa ts-jest para transformar arquivos TypeScript
  },
  collectCoverageFrom: ['**/*.(t|j)s'], // Coleta cobertura de código
  coverageDirectory: '../coverage', // Gera a cobertura em uma pasta específica
  testEnvironment: 'node', // Ambiente de teste: Node.js
  moduleNameMapper: {
    // Mapeia os aliases definidos no tsconfig.json
    '^@apis/(.*)$': '<rootDir>/apis/$1',
    '^@classes/(.*)$': '<rootDir>/classes/$1',
    '^@schemas/(.*)$': '<rootDir>/schemas/$1',
    '^@store/(.*)$': '<rootDir>/store/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
    '^@validators/(.*)$': '<rootDir>/validators/$1',
  },
};

export default config;
