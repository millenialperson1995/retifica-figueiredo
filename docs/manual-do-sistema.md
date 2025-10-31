# Manual do Sistema - Retífica Figueirêdo

## Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
3. [Configuração Inicial](#configuração-inicial)
4. [Autenticação e Autorização](#autenticação-e-autorização)
5. [Funcionalidades do Sistema](#funcionalidades-do-sistema)
6. [API e Documentação](#api-e-documentação)
7. [Estrutura de Pastas](#estrutura-de-pastas)
8. [Componentes e UI](#componentes-e-ui)
9. [Resolução de Problemas](#resolução-de-problemas)

## Visão Geral

O Sistema de Gestão da Retífica Figueirêdo é uma aplicação web moderna desenvolvida para gerenciar clientes, veículos, orçamentos e ordens de serviço de uma retífica automotiva. O sistema oferece uma interface intuitiva e uma API REST completa para todas as operações de negócio.

## Arquitetura e Tecnologias

### Frontend
- **Next.js 16** - Framework React para aplicações web modernas
- **React 19** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Tipagem estática para melhor manutenção e desenvolvimento

### UI e Estilização
- **Tailwind CSS** - Framework de estilização utilitário
- **Radix UI** - Componentes acessíveis e desacoplados
- **Lucide React** - Biblioteca de ícones
- **shadcn/ui** - Componentes acessíveis e estilizados

### Autenticação
- O sistema está configurado para futura integração com um sistema de autenticação

### API e Documentação
- **Swagger** - Documentação automática da API
- **Zod** - Validação de esquemas

### Banco de Dados
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM (Object Document Mapper) para MongoDB

### Outras Bibliotecas
- **React Hook Form** - Gerenciamento de formulários
- **Date-fns** - Manipulação de datas
- **Recharts** - Biblioteca de gráficos

## Configuração Inicial

### Requisitos
- Node.js 18 ou superior
- npm, pnpm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd retifica-figueiredo
```

2. Instale as dependências:
```bash
pnpm install
# ou
npm install
```

3. Configure as variáveis de ambiente:
Crie o arquivo `.env.local` na raiz do projeto:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=seu_publishable_key_aqui
CLERK_SECRET_KEY=seu_secret_key_aqui
```

4. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
# ou
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Autenticação e Autorização

O sistema utiliza Clerk para gerenciar autenticação e autorização de usuários.

### Configuração do Clerk
1. Crie uma conta em [https://clerk.com/](https://clerk.com/)
2. Crie uma instância de desenvolvimento
3. Obtenha as chaves de API e configure-as como variáveis de ambiente

### Proteção de Rotas
O middleware protege automaticamente as seguintes rotas:
- `/` (raiz)
- `/budgets(.*)` (todas as rotas de orçamentos)
- `/orders(.*)` (todas as rotas de ordens de serviço)
- `/customers(.*)` (todas as rotas de clientes)
- `/inventory(.*)` (todas as rotas de inventário)
- `/services(.*)` (todas as rotas de serviços)

### Middleware Atualizado
```typescript
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
```

### Autorização Baseada em Dados
Cada usuário só pode acessar seus próprios dados, garantindo privacidade e segurança.

## Funcionalidades do Sistema

### Dashboard
- Visão geral com estatísticas do negócio
- Gráficos de receita e volume de serviços
- Ações rápidas para criar novos itens
- Listagem de ordens de serviço e orçamentos recentes

### Gestão de Clientes
- Cadastro de novos clientes
- Visualização de informações completas
- Edição de dados cadastrais
- Histórico de veículos e serviços

### Gestão de Veículos
- Associação de veículos a clientes
- Registro de informações técnicas do veículo
- Histórico de serviços e ordens de serviço

### Gestão de Orçamentos
- Criação de orçamentos detalhados
- Adição de serviços e peças
- Cálculo automático de valores
- Aprovação/rejeição de orçamentos
- Conversão em ordens de serviço

### Gestão de Ordens de Serviço
- Criação de ordens de serviço
- Controle de status (pendente, em andamento, concluída, cancelada)
- Acompanhamento de progresso
- Controle de datas e mecânicos
- Geração de relatórios
- **Restrição importante:** Ordens de serviço concluídas não podem ser alteradas para manter a integridade histórica dos serviços realizados
- Permite edição apenas quando o status é "pendente" ou "em andamento"

### Gestão de Inventário
- Controle de estoque de peças
- Registro de movimentações
- Alertas de baixo estoque
- Integração com ordens de serviço

### Gestão de Serviços Padrão
- Definição de serviços frequentes
- Padronização de descrições e valores
- Integração com orçamentos e ordens

## API e Documentação

### Documentação Swagger
A documentação completa da API está disponível em:
```
http://localhost:3000/api/docs
```

### Endpoints Disponíveis

#### Clientes
- `GET /api/customers` - Listar clientes
- `POST /api/customers` - Criar cliente
- `GET /api/customers/{id}` - Obter cliente específico
- `PUT /api/customers/{id}` - Atualizar cliente
- `DELETE /api/customers/{id}` - Excluir cliente

#### Veículos
- `GET /api/vehicles` - Listar veículos
- `POST /api/vehicles` - Criar veículo
- `GET /api/vehicles/{id}` - Obter veículo específico
- `PUT /api/vehicles/{id}` - Atualizar veículo
- `DELETE /api/vehicles/{id}` - Excluir veículo

#### Orçamentos
- `GET /api/budgets` - Listar orçamentos
- `POST /api/budgets` - Criar orçamento
- `GET /api/budgets/{id}` - Obter orçamento específico
- `PUT /api/budgets/{id}` - Atualizar orçamento
- `DELETE /api/budgets/{id}` - Excluir orçamento

#### Ordens de Serviço
- `GET /api/orders` - Listar ordens de serviço
- `POST /api/orders` - Criar ordem de serviço
- `GET /api/orders/{id}` - Obter ordem de serviço específica
- `PUT /api/orders/{id}` - Atualizar ordem de serviço
- `DELETE /api/orders/{id}` - Excluir ordem de serviço

#### Inventário
- `GET /api/inventory` - Listar itens do inventário
- `POST /api/inventory` - Criar item no inventário
- `GET /api/inventory/{id}` - Obter item específico
- `PUT /api/inventory/{id}` - Atualizar item
- `DELETE /api/inventory/{id}` - Excluir item

#### Serviços Padrão
- `GET /api/services` - Listar serviços padrão
- `POST /api/services` - Criar serviço padrão
- `GET /api/services/{id}` - Obter serviço específico
- `PUT /api/services/{id}` - Atualizar serviço
- `DELETE /api/services/{id}` - Excluir serviço

## Estrutura de Pastas

```
retifica-figueiredo/
├── app/
│   ├── api/              # API routes
│   │   ├── budgets/      # Rotas de orçamentos
│   │   ├── customers/    # Rotas de clientes
│   │   ├── docs/         # Documentação da API (Swagger)
│   │   ├── inventory/    # Rotas de inventário
│   │   ├── orders/       # Rotas de ordens de serviço
│   │   └── services/     # Rotas de serviços
│   ├── budgets/          # Páginas de orçamentos
│   ├── customers/        # Páginas de clientes
│   ├── inventory/        # Páginas de inventário
│   ├── orders/           # Páginas de ordens de serviço
│   ├── services/         # Páginas de serviços
│   ├── sign-in/          # Página de login
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial (dashboard)
├── components/
│   ├── forms/            # Componentes de formulários
│   ├── ui/               # Componentes de UI reutilizáveis
│   └── outros componentes
├── hooks/                # Hooks personalizados
├── lib/                  # Bibliotecas e funções auxiliares
├── public/               # Arquivos estáticos
└── styles/               # Estilos CSS adicionais
```

## Componentes e UI

### Componentes de Formulário
- `OrderForm` - Formulário para criação e edição de ordens de serviço
- `BudgetForm` - Formulário para criação e edição de orçamentos
- `CustomerForm` - Formulário para cadastro de clientes
- `VehicleForm` - Formulário para cadastro de veículos

### Componentes de UI
- `Card` - Componentes para organizar informações
- `Button` - Botões estilizados
- `Badge` - Indicadores visuais
- `Input` - Campos de entrada
- `Select` - Componentes de seleção
- `DataTable` - Tabelas de dados
- `Dialog` - Janelas modais
- `Navigation` - Componentes de navegação

### Componentes Especializados
- `AuthGuard` - Componente para proteção de rotas autenticadas
- `AppHeader` - Cabeçalho da aplicação
- `PageHeader` - Cabeçalho de páginas específicas
- `StatusBadge` - Exibição de status com cores apropriadas

## Resolução de Problemas

### Problemas Comuns de Autenticação

#### Erro: "Você precisa estar logado para acessar esta página"
**Causas:**
- Chaves do Clerk incorretas ou ausentes
- Middleware configurado incorretamente

**Soluções:**
1. Verifique se as variáveis de ambiente do Clerk estão corretas
2. Confirme que o middleware.ts está configurado com a sintaxe correta:
   ```typescript
   export default clerkMiddleware(async (auth, req) => {
     if (isProtectedRoute(req)) {
       await auth.protect();
     }
   });
   ```

#### Erro: "auth(...).protect is not a function"
**Causas:**
- Uso da sintaxe antiga do Clerk

**Soluções:**
- Atualize para a sintaxe mais recente (mostrada acima)
- Certifique-se de que `clerkMiddleware` é `async`
- Use `await auth.protect()` em vez de `auth().protect()`

### Problemas de Banco de Dados
- Verifique se a string de conexão do MongoDB está correta
- Confirme que o banco de dados está acessível
- Verifique se as permissões do usuário do banco de dados estão configuradas corretamente

### Problemas de API
- Acesse `http://localhost:3000/api/docs` para verificar a documentação da API
- Use as ferramentas de desenvolvedor do navegador para verificar requisições e respostas
- Verifique os logs do servidor para mensagens de erro

### Problemas de Build
- Execute `npm run build` ou `pnpm build` para testar o build de produção
- Verifique se todas as dependências estão instaladas corretamente
- Confirme que não há erros de TypeScript
- Verifique se não há importações circulares

### Dicas de Desenvolvimento
- Use componentes reutilizáveis sempre que possível
- Siga os padrões de nomenclatura do projeto
- Utilize hooks personalizados para lógica compartilhada
- Documente funções e componentes complexos
- Use Typescript para tipagem rigorosa
- Implemente testes para partes críticas da aplicação