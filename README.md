![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
# Physical Store API

API completa para gerenciamento de lojas físicas e cálculo inteligente de entregas. Este serviço permite cadastrar estabelecimentos, encontrar lojas próximas por CEP, calcular distâncias entre o cliente e as lojas disponíveis, e fornecer opções otimizadas de entrega.

A API determina automaticamente o melhor método de envio - usando serviço de motoboy para curtas distâncias (até 50km) e serviços dos Correios (PAC/SEDEX) para distâncias maiores, sempre calculando prazos e custos para cada opção.
## Funcionalidades Principais
### Gerenciamento de Estabelecimentos
- **Cadastro de Lojas:** Criação de novas lojas com validação detalhada de dados, incluindo nome, endereço, CEP, tipos de loja (PDV ou LOJA) e informações de contato.
- **Busca Avançada:** Consulta de estabelecimentos por ID, estado ou região para fácil administração.
- **Geocodificação Automática:** Conversão de endereços em coordenadas geográficas para localização precisa de cada estabelecimento.

### Cálculo Inteligente de Entregas
- **Localização por CEP:** Identificação de lojas próximas ao CEP informado pelo cliente.
- **Cálculo de Distâncias:** Utilização da API do Google Maps para determinar com precisão a distância entre o cliente e cada loja disponível.
- Seleção Inteligente de Método de Entrega
- Entrega por motoboy para distâncias até 50km
- Entrega pelos Correios (PAC/SEDEX) para distâncias maiores
- Cálculo automático de prazos e custos para cada opção
## Stack utilizada
- ### Backend
    - NestJS
    - TypeScript
    - MongoDB
    - Mongoose

- ### Testes e Qualidade
    - Jest
    - Supertest
    - ESLint/Prettier

- ### Integrações
    - Axios
    - Google Maps API
    - ViaCEP API
## Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter os seguintes itens instalados na sua máquina:

- Node.js (versão 16 ou superior)  
- npm ou yarn  
- MongoDB (caso não use Docker)  
- Git

---

### Passos para Execução

#### 1. Clone o repositório
```bash
git clone https://github.com/Victor-Saraiva-P/physicalStore-UOL
cd physicalStore-UOL
```

#### 2. Instale as dependências
```bash
npm install
```

#### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações personalizadas.

---

### 5. Executando localmente (sem Docker)

1. Inicie o MongoDB localmente ou utilize o atlas MongoDB 
2. Execute a aplicação em modo de desenvolvimento:

```bash
npm run start:dev
```

---

### 6. Executando testes
```bash
npm run test
```

---

## Acessando a Aplicação

- API: http://localhost:3000/api  
- Documentação Swagger: http://localhost:3000/api/docs

---

### Endpoints principais

- GET /stores: Lista todas as lojas  
- GET /stores/:id: Busca uma loja por ID  
- POST /stores: Cadastra uma nova loja  
- GET /stores/nearby/:cep: Encontra lojas próximas a um CEP  
- GET /delivery-options/:cep: Calcula opções de entrega para um CEP


## Aprendizados

Neste projeto, adquiri e aprimorei habilidades essenciais no desenvolvimento backend moderno utilizando NestJS, MongoDB e integrações externas:

### NestJS
- Arquitetura modular e desacoplada
- Controllers, providers e injeção de dependências via decorators
- Middlewares para validação e transformação de dados

### MongoDB e Mongoose
- Modelagem NoSQL com schemas validados
- Índices geoespaciais para consultas por proximidade
- Operações CRUD eficientes

### Integrações Externas
- Consumo de APIs (Google Maps, ViaCEP, Correios)
- Tratamento de erros e geocodificação de endereços
- Cálculo de rotas e distâncias

### Testes e Qualidade de Código
- Testes unitários e de integração com Jest
- Uso do MongoDB Memory Server para isolamento em testes
- Mocks de serviços externos
- Aplicação de princípios de clean code

### Algoritmos de Otimização
- Seleção inteligente do método ideal de entrega
- Cálculo de custo baseado em distância e tipo de serviço
- Ordenação dos resultados por proximidade

### Documentação e Padrões de API
- Documentação interativa com Swagger/OpenAPI
- Uso de DTOs para validação
- Respostas padronizadas com HTTP status codes adequados

Este projeto consolidou meus conhecimentos teóricos, aplicando-os a um contexto prático de negócios e resultando em uma solução robusta e escalável.

## 👨‍💻 Autor

Desenvolvido por **[Victor Saraiva](https://github.com/Victor-Saraiva-P)**
