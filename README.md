# Retífica Figueirêdo - Sistema de Gestão

Este é um sistema de gestão de orçamentos e ordens de serviço para a Retífica Figueirêdo.

## Autenticação e Autorização

A aplicação utiliza o [Clerk](https://clerk.com/) para autenticação de usuários.

### Requerimento de Login

Todas as rotas da aplicação são protegidas por padrão. Isso significa que um usuário **deve estar autenticado** para acessar qualquer parte do sistema. A proteção de rotas é configurada no arquivo `middleware.ts`.

### Autorização de Dados

O sistema implementa uma camada de autorização para garantir a privacidade e a segurança dos dados de cada cliente.

**Requisito:** Cada usuário autenticado deve poder visualizar e gerenciar **apenas os seus próprios dados** (seus clientes, veículos, orçamentos, etc.). Um usuário não deve, em hipótese algum, ter acesso aos dados de outro usuário.

**Implementação:**

1.  Ao fazer uma requisição para o backend para buscar dados, o ID do usuário autenticado (que pode ser obtido através do Clerk) deve ser enviado junto com a requisição.
2.  O backend deve usar esse ID de usuário para filtrar os dados no banco de dados, retornando apenas os registros que pertencem àquele usuário.
3.  Qualquer tentativa de acessar dados que não pertencem ao usuário autenticado deve ser bloqueada pelo backend, retornando um erro de "Acesso Negado" (403 Forbidden).

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

String de conexão: `mongodb+srv://matrix:stayFrosty2*@cluster-rectify-managem.1qivctf.mongodb.net/rectifydb?appName=Cluster-Rectify-Management`
