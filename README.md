# Retífica Figueirêdo - Sistema de Gestão

Este é um sistema de gestão de orçamentos e ordens de serviço para a Retífica Figueirêdo.

## Documentação da API

A documentação completa da API está disponível no Swagger UI. Para acessar:

1. Inicie a aplicação usando `npm run dev` ou `pnpm dev`
2. Acesse `http://localhost:3000/api/docs` no seu navegador
3. A interface do Swagger mostrará todos os endpoints disponíveis com descrições, parâmetros e modelos de requisição/resposta

### Estrutura da Documentação Swagger

O sistema utiliza swagger-jsdoc para gerar automaticamente a documentação da API a partir de comentários JSDoc nos arquivos de rota. Os endpoints documentados incluem:

- **Autenticação:** A API utiliza autenticação baseada em tokens JWT para proteger os endpoints
- **Validação de parâmetros:** Todos os endpoints possuem validação de entrada bem definida
- **Modelos de dados:** A documentação inclui os modelos completos de todos os objetos da API
- **Exemplos de requisição e resposta:** Cada endpoint inclui exemplos práticos de uso

A documentação é gerada automaticamente a partir dos arquivos:
- `./app/api/customers/route.ts`
- `./app/api/vehicles/route.ts`
- `./app/api/inventory/route.ts`
- `./app/api/budgets/route.ts`
- `./app/api/orders/route.ts`
- `./app/api/services/route.ts`

Além dos arquivos específicos para cada recurso, como `[id]/route.ts`.

## Autenticação e Autorização

A aplicação utiliza o [Clerk](https://clerk.com/) para autenticação de usuários.

### Configuração do Clerk

Para que o sistema funcione corretamente, você precisa configurar as credenciais do Clerk:

1. Acesse [https://clerk.com/](https://clerk.com/) e crie uma conta
2. Crie uma instância de desenvolvimento
3. Copie as chaves fornecidas:
   - **Publishable Key** - para `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** - para `CLERK_SECRET_KEY`
4. Adicione as chaves no arquivo `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sk_*************************_sua_chave_publica
CLERK_SECRET_KEY=sk_*************************_sua_chave_secreta
```

### Requerimento de Login

Todas as rotas da aplicação são protegidas por padrão. Isso significa que um usuário **deve estar autenticado** para acessar qualquer parte do sistema. A proteção de rotas é configurada no arquivo `middleware.ts`.

A configuração correta do middleware para a versão mais recente do Clerk é:

```
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/budgets(.*)',
  '/orders(.*)',
  '/customers(.*)',
  '/inventory(.*)',
  '/services(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

### Autorização de Dados

O sistema implementa uma camada de autorização para garantir a privacidade e a segurança dos dados de cada cliente.

**Requisito:** Cada usuário autenticado deve poder visualizar e gerenciar **apenas os seus próprios dados** (seus clientes, veículos, orçamentos, etc.). Um usuário não deve, em hipótese algum, ter acesso aos dados de outro usuário.

**Implementação:**

1.  Ao fazer uma requisição para o backend para buscar dados, o ID do usuário autenticado (que pode ser obtido através do Clerk) deve ser enviado junto com a requisição.
2.  O backend deve usar esse ID de usuário para filtrar os dados no banco de dados, retornando apenas os registros que pertencem àquele usuário.
3.  Qualquer tentativa de acessar dados que não pertencem ao usuário autenticado deve ser bloqueada pelo backend, retornando um erro de "Acesso Negado" (403 Forbidden).

### Resolução de Problemas Comuns

Se você encontrar a mensagem "Você precisa estar logado para acessar esta página" mesmo estando autenticado, isso pode ser causado por:

1. Chaves do Clerk incorretas ou ausentes no arquivo `.env.local`
2. Verificação de autenticação duplicada (no servidor e no cliente)
3. Middleware configurado incorretamente

Se encontrar o erro `auth(...).protect is not a function`, a solução é garantir que a chamada no middleware seja feita corretamente com a sintaxe da versão mais recente do Clerk. A sintaxe correta é:
```
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

A principal diferença na nova versão do Clerk é que:
1. A função `clerkMiddleware` agora deve ser `async`
2. A chamada à função `auth.protect()` deve ser precedida por `await`
3. A sintaxe `auth().protect()` com parênteses após `auth` é de versões antigas e foi substituída por `auth.protect()` sem os parênteses após `auth`

## Funcionalidades do Sistema

### Dashboard
- Visão geral do negócio com estatísticas
- Receita mensal
- Ordens de serviço em andamento e concluídas
- Orçamentos pendentes
- Total de clientes

### Gestão de Clientes
- Cadastro de novos clientes
- Visualização de informações de clientes existentes
- Edição de dados de clientes

### Gestão de Veículos
- Associação de veículos a clientes
- Registro de informações do veículo (placa, marca, modelo, ano, etc.)

### Gestão de Orçamentos
- Criação de orçamentos para clientes
- Visualização de orçamentos existentes
- Aprovação/rejeição de orçamentos
- Conversão de orçamentos em ordens de serviço

### Gestão de Ordens de Serviço (OS)
- Criação de ordens de serviço a partir de orçamentos ou do zero
- Acompanhamento do status (pendente, em andamento, concluída, cancelada)
- Adição de serviços e peças
- Controle de datas e mecânicos
- **Restrição importante:** Ordens de serviço concluídas não podem ser alteradas para manter a integridade histórica dos serviços realizados. A edição só é permitida quando o status é "pendente" ou "em andamento".

### Gestão de Inventário
- Controle de peças e estoque
- Registro de movimentações de inventário
- Integração com ordens de serviço

### Gestão de Serviços
- Definição de serviços padrão oferecidos pela retífica
- Associação de serviços a orçamentos e ordens de serviço

## API Documentation

O sistema inclui documentação automática da API usando o Swagger. Acesse a documentação em `/api/docs` após iniciar a aplicação.

### Endpoints Disponíveis

- **Clientes:** `/api/customers` - Gerenciamento de clientes
- **Veículos:** `/api/vehicles` - Gerenciamento de veículos
- **Inventário:** `/api/inventory` - Gerenciamento de peças e estoque
- **Orçamentos:** `/api/budgets` - Criação e gerenciamento de orçamentos
- **Ordens de Serviço:** `/api/orders` - Gerenciamento de ordens de serviço
- **Serviços Padrão:** `/api/services` - Definição de serviços padrão oferecidos

### Banco de Dados

O sistema utiliza MongoDB como banco de dados. A conexão é gerenciada através do Mongoose.

**Importante:** A string de conexão com o banco de dados deve ser configurada como uma variável de ambiente (`MONGODB_URI`) em um arquivo `.env.local` e nunca deve ser exposta no código-fonte.
