# Bet Acadêmica

Aplicação de apostas simuladas construída com React + Vite e um backend mock usando `json-server`.

## Visão Geral

O projeto permite:
- cadastro e login de usuários
- perfil com saldo, depósito e saque persistentes
- validação de e-mail forte antes da criação de conta
- histórico de apostas e movimentações
- regra de um palpite por evento por usuário
- painel administrativo para gerenciar usuários e saldo

## Tecnologias

- React 19
- Vite 8
- React Router 7
- Axios
- Bootstrap 5
- json-server

## Pré-requisitos

- Node.js 18+ (recomendado)
- npm

## Instalação

No diretório do projeto:

```bash
npm install
```

## Executando o projeto

1. Inicie o backend mock:

```bash
npm run server
```

2. Inicie o frontend:

```bash
npm run dev
```

3. Abra o app no navegador usando a URL fornecida pelo Vite.

> Se a porta `3000` estiver ocupada, use:
>
> ```bash
> npx json-server --watch src/db.json --port 3001
> ```

## Endpoints do mock API

O backend usa `src/db.json` como fonte de dados e expõe:
- `/users`
- `/events`
- `/bets`
- `/transactions`

## Comportamento importante

- Usuários são criados com IDs numéricos sequenciais.
- O saldo do usuário é atualizado e persistido ao fazer depósito ou saque.
- Transações são gravadas em `src/db.json` no objeto `transactions`.
- O e-mail deve ser válido para criar conta: contém `@`, termina em `.com` e segue regras de formato.
- Apenas uma aposta por evento por usuário é permitida.

## Scripts úteis

- `npm run dev` — inicia o Vite em modo de desenvolvimento
- `npm run build` — gera a versão de produção
- `npm run lint` — verifica o código com ESLint
- `npm run preview` — serve a build de produção localmente
- `npm run server` — inicia o json-server com `src/db.json`

## Estrutura principal

- `src/` — código React do aplicativo
- `src/services/` — chamadas API e lógica de criação/atualização
- `src/contexts/` — contexto de autenticação e usuário
- `src/pages/` — páginas da aplicação
- `src/db.json` — banco de dados mock usado pelo `json-server`

## Notas

Este projeto usa um backend mock; o `json-server` salva os dados diretamente em `src/db.json`, então as alterações de saldo e transações permanecem entre reloads. Se precisar adaptar para um backend real, basta trocar os serviços de API.
