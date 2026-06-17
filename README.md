# G2XBet

## Integrantes

- Gustavo Henrique Nunes de Oliveira
- Matheus Alves Costa

## Descrição Geral do Sistema

G2XBet é uma plataforma de apostas esportivas simuladas desenvolvida para fins acadêmicos, onde os usuários podem criar contas, visualizar eventos esportivos, realizar apostas e acompanhar seu saldo e histórico de transações. O sistema utiliza React no front-end e JSON Server como backend mock para armazenamento local dos dados, simulando o funcionamento de uma plataforma real de apostas online.


## Funcionalidade Extra Escolhida

- Validação de e-mail avançada durante o cadastro, exigindo formato válido e verificações adicionais de domínio.
- Persistência de saldo e transações no `json-server` para que os depósitos e saques permaneçam após reload ou logout.

## Regras de Negócio

- Cada usuário só pode apostar uma vez por evento.
- Usuários têm saldo inicial e podem depositar ou sacar, com o saldo atualizado no backend mock.
- Administradores podem editar o saldo dos usuários pelo painel administrativo.
- As transações são registradas em `src/db.json` e exibidas no extrato do usuário.

## Tecnologias Utilizadas

- React
- React Router DOM
- React Hooks
- Context API
- JSON Server
- CSS e Bootstrap
- Axios
- GitHub

## Instruções para Executar o React

1. Instale as dependências:

```bash
npm install
```

2. Inicie a aplicação React:

```bash
npm run dev
```

3. Acesse a URL exibida pelo Vite no navegador.

## Instruções para Executar o JSON Server

1. Inicie o mock backend:

```bash
npm run server
```

2. O JSON Server deve rodar em `http://localhost:3000`.

3. Se a porta `3000` estiver ocupada, use:

```bash
npx json-server --watch src/db.json --port 3001
```

## Usuários de Teste

Exemplos de contas disponíveis em `src/db.json`:

- Admin
  - E-mail: `admin@bet.com`
  - Senha: `123`
- João Jogador
  - E-mail: `user@bet.com`
  - Senha: `123`
- Gustavo
  - E-mail: `gustavoteste@gmail.com`
  - Senha: `12317651`
- Gabriel
  - E-mail: `gabriel123@gmail.com`
  - Senha: `gabriel123`

## Principais Rotas do Sistema

- `/login` — página de login
- `/register` — página de cadastro
- `/dashboard` — visão geral do usuário
- `/events` — lista de eventos disponíveis
- `/bets/:eventId` — página de aposta para um evento específico
- `/bets/history` — histórico de apostas do usuário
- `/ranking` — ranking de usuários por saldo
- `/profile` — perfil do usuário e carteira
- `/admin/events` — painel de eventos para administradores
- `/admin/users` — gerenciamento de usuários para administradores

## Divisão de Tarefas entre os Integrantes

- Gustavo Henrique Nunes de Oliveira: desenvolvimento das páginas de cadastro, login, perfil, transações, validação de e-mail e lógica de persistência com JSON Server.
- Matheus Alves Costa: implementação das rotas, páginas de eventos, apostas, painel administrativo, Context API e componentes reutilizáveis.

## Descrição das Principais Telas

- **Login:** permite autenticar usuário e apresenta mensagem de erro em credenciais inválidas.
- **Cadastro:** formulário de registro com validação de nome, e-mail e senha.
- **Dashboard:** mostra saldo atual, número de apostas e estatísticas rápidas.
- **Eventos:** lista de partidas disponíveis para apostar com filtro por esporte.
- **Página de Aposta:** permite escolher palpite, valor e enviar aposta única por evento.
- **Perfil:** exibe informações do usuário, permite atualizar dados, alterar senha, sacar/depositar e consultar extrato.
- **Painel Admin:** interface para gerenciar eventos e usuários, incluindo edição de saldo.

## Dificuldades Encontradas

- Ajustar a persistência de saldo e transações no backend mock usando `json-server`.
- Garantir que a validação de e-mail fosse mais forte do que apenas `@` e `.com`.
- Sincronizar o estado do usuário entre o `AuthContext`, `UserContext` e o armazenamento local.
- Aplicar proteção de rotas para perfis de usuário e administrador.

## Melhorias futuras