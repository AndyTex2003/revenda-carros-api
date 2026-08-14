# Revenda de Carros API

API REST para gerenciamento de uma revenda de veículos, desenvolvida com Node.js, TypeScript, Express, Prisma ORM e PostgreSQL.

O projeto contempla autenticação e autorização de usuários, gerenciamento de veículos e clientes, realização de vendas, documentação com Swagger/OpenAPI e uma estratégia de qualidade composta por testes automatizados e testes manuais documentados.

---

## Sobre o Projeto

A Revenda de Carros API foi desenvolvida com o objetivo de simular operações essenciais de uma revenda de veículos através de uma API REST.

Além da implementação das funcionalidades, o projeto possui foco em Qualidade de Software, incluindo planejamento de testes, automação, execução manual, documentação de casos de teste, coleta de evidências e rastreabilidade através de GitHub Issues.

---

## Funcionalidades

A API contempla os seguintes módulos:

### Autenticação e Autorização

- Login de usuários;
- Autenticação utilizando JWT;
- Controle de acesso baseado nos perfis `ADMIN` e `VENDEDOR`;
- Proteção de endpoints autenticados.

### Veículos

- Cadastro de veículos;
- Listagem de veículos;
- Busca por ID;
- Atualização;
- Exclusão;
- Validação de placa duplicada;
- Controle de status do veículo.

### Clientes

- Cadastro de clientes;
- Listagem;
- Busca por ID;
- Atualização;
- Exclusão;
- Validação de CPF;
- Validação de e-mail;
- Controle de duplicidade de CPF e e-mail.

### Vendas

- Cadastro de vendas;
- Listagem;
- Busca por ID;
- Atualização do valor da venda;
- Exclusão;
- Associação entre cliente e veículo;
- Controle de disponibilidade do veículo;
- Alteração do status do veículo após a venda.

### Health Check

- Endpoint para validação da disponibilidade da API.

---

## Tecnologias Utilizadas

### Desenvolvimento

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod
- JWT
- bcrypt
- dotenv
- Helmet
- CORS

### Testes e Qualidade

- Vitest
- Supertest
- Swagger / OpenAPI
- Git
- GitHub
- GitHub Issues

---

## Qualidade e Testes

O projeto utiliza duas abordagens complementares de validação: testes automatizados de integração e testes manuais da API.

### Testes Automatizados

A suíte automatizada utiliza Vitest e Supertest para validar endpoints, códigos HTTP, autenticação, autorização, validações e regras de negócio.

**Resultado atual:**

| Indicador | Resultado |
| --- | --- |
| Testes executados | 46 |
| Testes aprovados | 46 |
| Arquivos de teste | 5 |
| Taxa de aprovação | 100% |

Para executar a suíte:

```bash
npm test
```

Para executar com relatório de cobertura:

```bash
npm run test:coverage
```

---

### Testes Manuais

Além da automação, foi realizada uma etapa completa de planejamento e execução manual através do Swagger UI.

Os casos contemplam cenários positivos, negativos, autenticação, autorização, validações e regras de negócio.

**Resultado da execução manual:**

| Indicador | Resultado |
| --- | --- |
| Casos planejados | 51 |
| Casos executados | 51 |
| Casos aprovados | 51 |
| Casos reprovados | 0 |
| Bugs confirmados | 0 |
| Taxa de execução | 100% |
| Taxa de aprovação | 100% |

### Resultado por Módulo

| Módulo | Planejados | Executados | Aprovados | Reprovados |
| --- | --- | --- | --- | --- |
| Autenticação e Health Check | 11 | 11 | 11 | 0 |
| Veículos | 11 | 11 | 11 | 0 |
| Clientes | 14 | 14 | 14 | 0 |
| Vendas | 15 | 15 | 15 | 0 |
| **Total** | **51** | **51** | **51** | **0** |

---

## Documentação de QA

A documentação detalhada do processo de testes está disponível na Wiki do projeto:

- [Home da Wiki](https://github.com/AndyTex2003/revenda-carros-api/wiki)
- [Plano de Testes](https://github.com/AndyTex2003/revenda-carros-api/wiki/Plano-de-Testes)
- [Cenários e Casos de Teste](https://github.com/AndyTex2003/revenda-carros-api/wiki/Cenários-e-Casos-de-Teste)
- [Relatório de Execução de Testes](https://github.com/AndyTex2003/revenda-carros-api/wiki/Relatório-de-Execução-de-Testes)

Os casos de teste possuem suas respectivas evidências vinculadas, permitindo rastreabilidade entre planejamento, execução e resultado.

---

## Evidências

As evidências dos testes manuais estão versionadas no diretório:

```text
evidencias/
```

A organização segue os módulos testados:

```text
evidencias/
├── autenticacao-health-check/
├── veiculos/
├── clientes/
└── vendas/
```

Cada evidência está associada ao respectivo caso de teste documentado na Wiki.

---

## Documentação da API

A API possui documentação interativa utilizando Swagger / OpenAPI.

Com a aplicação em execução, acesse:

```text
http://localhost:3000/docs
```

A documentação permite consultar os endpoints disponíveis, contratos de requisição e resposta, códigos HTTP e executar requisições diretamente pela interface.

---

## Como Executar o Projeto

### Pré-requisitos

É necessário possuir:

- Node.js;
- npm;
- PostgreSQL.

Ambiente utilizado durante o desenvolvimento e validação do projeto:

```text
Node.js v24.13.0
npm 11.6.2
```

### 1. Clone o repositório

```bash
git clone https://github.com/AndyTex2003/revenda-carros-api.git
```

Entre no diretório:

```bash
cd revenda-carros-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Utilize o arquivo `.env.example` como referência e crie um arquivo `.env` na raiz do projeto.

Variáveis utilizadas:

```env
DATABASE_URL=
DATABASE_TEST_URL=
PORT=
JWT_SECRET=
JWT_EXPIRES_IN=1h
AI_API_KEY=
```

Preencha os valores de acordo com o seu ambiente.

### 4. Gere o Prisma Client

```bash
npm run prisma:generate
```

### 5. Execute as migrations

```bash
npm run prisma:migrate
```

### 6. Execute o seed

```bash
npm run prisma:seed
```

### 7. Inicie a aplicação

Em modo de desenvolvimento:

```bash
npm run dev
```

Após iniciar a API, a documentação Swagger estará disponível em:

```text
http://localhost:3000/docs
```

---

## Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Executa a aplicação em modo de desenvolvimento |
| `npm run build` | Compila o projeto TypeScript |
| `npm start` | Executa a versão compilada |
| `npm test` | Executa os testes automatizados |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run test:coverage` | Executa os testes com cobertura |
| `npm run lint` | Executa a análise estática com ESLint |
| `npm run format` | Formata os arquivos com Prettier |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Executa as migrations do Prisma |
| `npm run prisma:seed` | Executa o seed do banco de dados |

---

## Estrutura do Projeto

```text
revenda-carros-api/
├── docs/
├── evidencias/
├── prisma/
├── src/
├── tests/
├── .env.example
├── eslint.config.mjs
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Principais diretórios

- `src/` — código-fonte da aplicação;
- `tests/` — testes automatizados;
- `prisma/` — schema, migrations e seed do banco de dados;
- `docs/` — arquivos relacionados à documentação;
- `evidencias/` — evidências da execução dos testes manuais.

---

## Rastreabilidade

O acompanhamento do desenvolvimento e da execução dos testes foi realizado através de GitHub Issues.

As Issues registram atividades de implementação, planejamento, execução dos testes e critérios de conclusão, mantendo um histórico das etapas realizadas durante o projeto.

[Consultar Issues do projeto](https://github.com/AndyTex2003/revenda-carros-api/issues)

---

## Autor

**Anderson Batista dos Santos**

Projeto desenvolvido como parte dos estudos e práticas em desenvolvimento de APIs, Qualidade de Software e Testes de Software.