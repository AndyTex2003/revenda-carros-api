# Revenda Carros API

## Informações do Documento

| Item | Valor |
|------|-------|
| Projeto | Revenda Carros API |
| Versão | 1.0 |
| Data | 02/08/2026 |
| Autor | Anderson Batista dos Santos |
| Status | Em elaboração |

---

# Índice

- [1. Objetivo](#1-objetivo)
- [2. Escopo do Projeto](#2-escopo-do-projeto)
- [3. Público-alvo](#3-público-alvo)
- [4. Perfis de Usuário](#4-perfis-de-usuário)
- [5. Veículos](#5-veículos)
- [6. Condição do Veículo](#6-condição-do-veículo)
- [7. Status do Veículo](#7-status-do-veículo)
- [8. Regras de Negócio](#8-regras-de-negócio)
- [9. MVP](#9-mvp)
- [10. Funcionalidades Futuras](#10-funcionalidades-futuras)
- [11. Histórico de Alterações](#11-histórico-de-alterações)

---

# 1. Objetivo

Desenvolver uma API REST para gerenciamento de uma revenda de veículos, permitindo controlar usuários, veículos, clientes e vendas.

O projeto tem como objetivo aplicar boas práticas de arquitetura de software, documentação, testes automatizados e integração com Inteligência Artificial para geração de descrições comerciais dos veículos.

---

# 2. Escopo do Projeto

A API permitirá:

- Autenticação de usuários;
- Cadastro de vendedores;
- Cadastro de clientes;
- Cadastro de veículos;
- Consulta de veículos;
- Atualização de veículos;
- Registro de vendas;
- Geração automática de descrição comercial utilizando IA.

---

# 3. Público-alvo

O sistema será utilizado pelos colaboradores de uma revenda de veículos.

Os clientes finais não terão acesso direto à API.

---

# 4. Perfis de Usuário

## Administrador

Responsável pelo gerenciamento do sistema.

### Permissões

- Cadastrar vendedores;
- Gerenciar veículos;
- Gerenciar clientes;
- Registrar vendas;
- Consultar todas as vendas.

---

## Vendedor

Responsável pelo atendimento aos clientes.

### Permissões

- Consultar veículos;
- Cadastrar clientes;
- Registrar vendas.

---

# 5. Veículos

A revenda trabalhará com:

- Veículos novos;
- Veículos usados.

Somente carros fazem parte do escopo do projeto.

Cada veículo possuirá:

- Marca;
- Modelo;
- Ano de fabricação;
- Ano do modelo;
- Cor;
- Quilometragem;
- Combustível;
- Câmbio;
- Chassi;
- Placa;
- Valor de compra;
- Valor de venda;
- Condição;
- Status;
- Descrição comercial.

---

# 6. Condição do Veículo

- Novo;
- Usado.

---

# 7. Status do Veículo

- Disponível;
- Vendido.

Um veículo vendido permanecerá cadastrado no sistema para manter o histórico.

---

# 8. Regras de Negócio

### RN001

O valor de venda deverá ser maior que o valor de compra.

### RN002

Um veículo vendido não poderá ser vendido novamente.

### RN003

Veículos vendidos não poderão ser excluídos.

### RN004

Cada venda deverá ficar vinculada ao vendedor responsável.

### RN005

A descrição comercial poderá ser gerada automaticamente utilizando Inteligência Artificial.

### RN006

A descrição gerada poderá ser editada antes do salvamento.

### RN007

A indisponibilidade da IA não deverá impedir o cadastro do veículo.

### RN008

Apenas usuários autenticados poderão acessar a API.

### RN009

Apenas administradores poderão cadastrar novos vendedores.

### RN010

O número do chassi deverá ser único.

### RN011

A placa deverá ser única.

### RN012

Veículos novos deverão possuir quilometragem igual a 0 km.

### RN013

Veículos usados deverão possuir quilometragem maior que 0 km.

---

# 9. MVP

Fazem parte do MVP:

- Login com JWT;
- Cadastro de usuários;
- CRUD de veículos;
- CRUD de clientes;
- Registro de vendas;
- Geração de descrição comercial utilizando IA;
- Documentação Swagger;
- Testes automatizados.

---

# 10. Funcionalidades Futuras

As funcionalidades abaixo não fazem parte do MVP:

- Upload de imagens;
- Reserva de veículos;
- Relatórios gerenciais;
- Dashboard;
- Histórico de alterações;
- Auditoria;
- Integração com marketplaces;
- Financiamento;
- Paginação avançada;
- Pesquisa inteligente.

---

# 11. Histórico de Alterações

| Versão | Data | Alteração | Autor |
|---------|------|-----------|-------|
| 1.0 | 02/08/2026 | Criação inicial do documento | Anderson Batista dos Santos |