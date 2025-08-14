# NestJS Clean Architecture

## 📋 Sobre o Projeto

Este projeto é uma API REST desenvolvida com **NestJS** aplicando os princípios da **Clean Architecture** (Arquitetura Limpa). O projeto demonstra como implementar uma arquitetura robusta, testável e escalável para aplicações Node.js, incorporando práticas de **Domain-Driven Design (DDD)** e **SOLID**.

## 🎯 Objetivos

- Demonstrar a implementação da Clean Architecture em NestJS
- Aplicar conceitos de Domain-Driven Design (DDD)
- Criar uma estrutura de código testável e manutenível
- Implementar autenticação JWT
- Usar Prisma como ORM
- Configurar testes automatizados (unitários, integração e e2e)

## 🏗️ Arquitetura

O projeto segue a estrutura da Clean Architecture, dividida em camadas bem definidas:

```
┌─────────────────────────────────────────────────────────────┐
│                    Interface Layer                          │
│              (Controllers, DTOs, Presenters)               │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
│               (UseCases, Services, DTOs)                   │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│           (Entities, Repositories, Validators)             │
├─────────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                        │
│         (Database, External Services, Guards)              │
└─────────────────────────────────────────────────────────────┘
```

### Princípios Aplicados

1. **Dependency Inversion**: As camadas internas não dependem das externas
2. **Single Responsibility**: Cada classe tem uma única responsabilidade
3. **Open/Closed**: Aberto para extensão, fechado para modificação
4. **Interface Segregation**: Interfaces específicas para cada necessidade
5. **Liskov Substitution**: Subtipos devem ser substituíveis por seus tipos base

## 📁 Estrutura do Projeto

```
src/
├── main.ts                     # Ponto de entrada da aplicação
├── app.module.ts              # Módulo principal
├── global-config.ts           # Configurações globais
│
├── shared/                    # Código compartilhado
│   ├── application/           # Camada de aplicação compartilhada
│   │   ├── dtos/             # Data Transfer Objects
│   │   ├── errors/           # Erros customizados da aplicação
│   │   ├── providers/        # Interfaces de provedores
│   │   └── usecases/         # Interface base para casos de uso
│   │
│   ├── domain/               # Camada de domínio compartilhada
│   │   ├── entities/         # Entidades base
│   │   ├── errors/           # Erros de domínio
│   │   ├── repositories/     # Contratos e implementações base
│   │   └── validators/       # Validadores de domínio
│   │
│   └── infrastructure/       # Camada de infraestrutura compartilhada
│       ├── database/         # Configuração do banco de dados
│       ├── env-config/       # Configuração de ambiente
│       ├── exception-filters/ # Filtros de exceção
│       ├── interceptors/     # Interceptadores
│       └── presenters/       # Apresentadores de dados
│
├── users/                    # Módulo de usuários
│   ├── application/          # Casos de uso dos usuários
│   │   ├── dtos/            # DTOs específicos de usuários
│   │   └── usecases/        # Casos de uso (signup, signin, etc.)
│   │
│   ├── domain/              # Domínio dos usuários
│   │   ├── entities/        # Entidade User
│   │   ├── repositories/    # Contrato do repositório de usuários
│   │   └── validators/      # Validadores de usuário
│   │
│   └── infrastructure/      # Infraestrutura dos usuários
│       ├── users.controller.ts  # Controlador REST
│       ├── users.module.ts     # Módulo NestJS
│       ├── database/           # Implementação do repositório
│       ├── dtos/              # DTOs da API
│       └── presenters/        # Apresentadores de resposta
│
└── auth/                     # Módulo de autenticação
    └── infrastructure/       # Implementação de autenticação
        ├── auth.guard.ts     # Guard JWT
        ├── auth.module.ts    # Módulo de autenticação
        └── auth.service.ts   # Serviço de autenticação
```

## 🔧 Tecnologias Utilizadas

### Core
- **Node.js 18+**
- **NestJS 9** - Framework web
- **TypeScript** - Linguagem de programação
- **Fastify** - Servidor HTTP (mais performático que Express)

### Banco de Dados
- **Prisma** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional

### Autenticação e Segurança
- **JWT (JSON Web Tokens)** - Autenticação stateless
- **bcryptjs** - Hash de senhas

### Validação e Transformação
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP

### Documentação
- **Swagger/OpenAPI** - Documentação automática da API

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd modelo_nestjs_clean_arch
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie os arquivos de ambiente
cp .env.example .env.development
cp .env.example .env.test
cp .env.example .env
```

4. **Inicie o banco de dados**
```bash
docker-compose up -d
```

5. **Execute as migrações**
```bash
npx prisma migrate dev
```

6. **Inicie a aplicação**
```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 Scripts Disponíveis

### Desenvolvimento
```bash
npm run start:dev    # Inicia em modo desenvolvimento
npm run start:debug  # Inicia em modo debug
npm run build        # Gera build de produção
npm run start:prod   # Inicia em modo produção
```

### Testes
```bash
npm run test         # Executa todos os testes
npm run test:unit    # Executa testes unitários
npm run test:int     # Executa testes de integração
npm run test:e2e     # Executa testes end-to-end
npm run test:cov     # Executa testes com coverage
npm run test:watch   # Executa testes em modo watch
```

### Qualidade de Código
```bash
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier
```

## 🏛️ Detalhamento das Camadas

### 1. Domain Layer (Camada de Domínio)

A camada mais interna, contendo as regras de negócio puras.

#### Entities (Entidades)
```typescript
// src/shared/domain/entities/entity.ts
export abstract class Entity<Props = any> {
  public readonly _id: string
  public readonly props: Props

  constructor(props: Props, id?: string) {
    this.props = props
    this._id = id || randomUUID()
  }
  // ...
}
```

#### User Entity
```typescript
// src/users/domain/entities/user.entity.ts
export class UserEntity extends Entity<UserProps> {
  constructor(public readonly props: UserProps, id?: string) {
    UserEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  update(value: string): void {
    UserEntity.validate({ ...this.props, name: value })
    this.name = value
  }
  // ...
}
```

#### Repository Contracts
```typescript
// src/users/domain/repositories/user.repository.ts
export namespace UserRepository {
  export interface Repository
    extends SearchableRepositoryContract<
      UserEntity,
      UserFilter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<UserEntity>
    emailExists(email: string): Promise<void>
  }
}
```

### 2. Application Layer (Camada de Aplicação)

Contém os casos de uso e regras de aplicação.

#### Use Cases
```typescript
// src/users/application/usecases/signup.usecase.ts
export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      // Validações
      // Regras de negócio
      // Persistência
    }
  }
}
```

### 3. Infrastructure Layer (Camada de Infraestrutura)

Implementa os detalhes técnicos e integrações externas.

#### Controllers
```typescript
// src/users/infrastructure/users.controller.ts
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase

  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto)
    return UsersController.userToResponse(output)
  }
  // ...
}
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

### Login
```typescript
POST /users/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Rotas Protegidas
```typescript
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Get('me')
async profile() {
  // Rota protegida
}
```

## 🧪 Estratégia de Testes

### Configuração de Testes

O projeto possui configurações separadas para diferentes tipos de teste:

- `jest.unit.config.ts` - Testes unitários
- `jest.int.config.ts` - Testes de integração
- `jest.e2e.config.ts` - Testes end-to-end

### Tipos de Teste

#### 1. Testes Unitários
Testam unidades isoladas (entities, use cases, services):

```typescript
describe('UserEntity', () => {
  it('should create a user with valid data', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    const user = new UserEntity(userData)

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })
})
```

#### 2. Testes de Integração
Testam a integração entre camadas:

```typescript
describe('SignupUseCase', () => {
  it('should create a new user', async () => {
    const repository = new InMemoryUserRepository()
    const hashProvider = new BcryptjsHashProvider()
    const useCase = new SignupUseCase.UseCase(repository, hashProvider)

    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })

    expect(result.name).toBe('John Doe')
  })
})
```

#### 3. Testes E2E
Testam fluxos completos da API:

```typescript
describe('/users (e2e)', () => {
  it('should create a user', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      .expect(201)
  })
})
```

## 📊 Monitoramento e Logs

### Interceptors
```typescript
// Wrapper para padronizar responses
@UseInterceptors(WrapperDataInterceptor)
```

### Exception Filters
```typescript
// Tratamento centralizado de erros
@UseFilters(ConflictErrorFilter)
@UseFilters(NotFoundErrorFilter)
```

## 🔄 Fluxo de Desenvolvimento

### Implementando um Novo Módulo

1. **Criar a Entidade de Domínio**
```typescript
// domain/entities/product.entity.ts
export class ProductEntity extends Entity<ProductProps> {
  // Implementar regras de negócio
}
```

2. **Definir o Contrato do Repositório**
```typescript
// domain/repositories/product.repository.ts
export namespace ProductRepository {
  export interface Repository {
    // Definir métodos necessários
  }
}
```

3. **Implementar os Casos de Uso**
```typescript
// application/usecases/create-product.usecase.ts
export namespace CreateProductUseCase {
  export class UseCase {
    // Implementar lógica do caso de uso
  }
}
```

4. **Criar o Controlador**
```typescript
// infrastructure/product.controller.ts
@Controller('products')
export class ProductController {
  // Implementar endpoints
}
```

5. **Implementar o Repositório**
```typescript
// infrastructure/database/prisma/product-prisma.repository.ts
export class ProductPrismaRepository implements ProductRepository.Repository {
  // Implementar persistência
}
```

6. **Configurar o Módulo**
```typescript
// infrastructure/product.module.ts
@Module({
  providers: [
    // Configurar providers
  ],
  controllers: [ProductController]
})
export class ProductModule {}
```

## 🌐 API Endpoints

### Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/users` | Criar usuário | ❌ |
| POST | `/users/login` | Login | ❌ |
| GET | `/users` | Listar usuários | ✅ |
| GET | `/users/:id` | Buscar usuário | ✅ |
| PUT | `/users/:id` | Atualizar usuário | ✅ |
| PATCH | `/users/:id` | Atualizar senha | ✅ |
| DELETE | `/users/:id` | Deletar usuário | ✅ |

### Documentação

- **Swagger UI**: `http://localhost:3000/api`
- Documentação automática de todos os endpoints
- Esquemas de request/response
- Autenticação JWT integrada

## 🐳 Docker

### Desenvolvimento
```bash
# Iniciar apenas o banco
docker-compose up -d

# Build da aplicação
docker build -t nestjs-clean-arch .
```

### Produção
```dockerfile
# Dockerfile multi-stage para otimização
FROM node:18-alpine AS builder
# ... build steps

FROM node:18-alpine AS production
# ... production setup
```

## 📈 Boas Práticas Implementadas

### 1. SOLID Principles
- **S**: Cada classe tem uma responsabilidade específica
- **O**: Código aberto para extensão, fechado para modificação
- **L**: Subtipos são substituíveis pelos tipos base
- **I**: Interfaces segregadas e específicas
- **D**: Dependência de abstrações, não de implementações

### 2. Clean Architecture
- Separação clara de responsabilidades
- Dependências apontam para dentro
- Regras de negócio isoladas
- Facilita testes e manutenção

### 3. DDD (Domain-Driven Design)
- Entities com comportamento
- Value Objects para conceitos sem identidade
- Repositories como contratos
- Services para operações complexas

### 4. Error Handling
- Erros customizados por camada
- Exception filters centralizados
- Responses padronizados

### 5. Validation
- DTOs com class-validator
- Validação na entrada da aplicação
- Validação de domínio nas entities

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco**
```bash
# Verificar se o container está rodando
docker-compose ps

# Recriar o container
docker-compose down && docker-compose up -d
```

2. **Erro de Migração**
```bash
# Reset do banco (desenvolvimento)
npx prisma migrate reset

# Aplicar migrações
npx prisma migrate dev
```

3. **Erro de Dependências**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença UNLICENSED - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Autores

- Este projeto foi inicialmente criado pelo Aluisio Developer (https://github.com/aluiziodeveloper/nestjs-clean-arch.git) e alterado/adaptado por **Érick Nilson** - *Desenvolvimento inicial* - [SeuPerfil](https://github.com/ericknilson)

## 🙏 Agradecimentos

- NestJS Team
- Clean Architecture Community
- Prisma Team
- Contribuidores Open Source
