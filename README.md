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

O sistema implementa uma camada de autorização para garantir a privacidade e a segurança dos dados de cada cliente. Atualmente, não há sistema de autenticação integrado, mas o middleware está configurado para permitir futura implementação de um sistema de autenticação.

### Requerimento de Login

Atualmente, todas as rotas da aplicação estão configuradas para permitir acesso público, mas o middleware.ts contém uma estrutura que pode ser utilizada para proteger rotas no futuro. A proteção de rotas é configurada no arquivo `middleware.ts`.

A estrutura atual no middleware permite futura implementação de autenticação:

```typescript
// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/',
  '/budgets',
  '/orders',
  '/customers',
  '/inventory',
  '/services',
];

// Verifica se a rota requer proteção
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Se for uma rota protegida, permitir acesso (por enquanto sem autenticação)
  if (isProtectedRoute(pathname)) {
    // Futuramente aqui podemos adicionar nossa própria lógica de autenticação
    return NextResponse.next()
  }
  
  return NextResponse.next()
}
```

### Autorização de Dados

O sistema implementa uma camada de autorização para garantir a privacidade e a segurança dos dados de cada cliente. Quando um sistema de autenticação for implementado, ele deverá garantir que:

**Requisito:** Cada usuário autenticado deve poder visualizar e gerenciar **apenas os seus próprios dados** (seus clientes, veículos, orçamentos, etc.). Um usuário não deve, em hipótese algum, ter acesso aos dados de outro usuário.

**Implementação futura:**

1.  Ao fazer uma requisição para o backend para buscar dados, o ID do usuário autenticado deve ser enviado junto com a requisição.
2.  O backend deve usar esse ID de usuário para filtrar os dados no banco de dados, retornando apenas os registros que pertencem àquele usuário.
3.  Qualquer tentativa de acessar dados que não pertencem ao usuário autenticado deve ser bloqueada pelo backend, retornando um erro de "Acesso Negado" (403 Forbidden).

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
