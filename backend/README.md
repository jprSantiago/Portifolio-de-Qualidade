# NaSalinha - Backend API

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Executando Testes](#executando-testes)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)

## Sobre o Projeto

O **NaSalinha** é uma API RESTful desenvolvida para gerenciar um sistema de check-in gamificado, onde membros podem registrar sua presença através de fotos e acumular pontos em temporadas específicas. O sistema possui controle de acesso baseado em roles (ADMIN, MEMBER, TRAINEE) e oferece funcionalidades de ranking e gestão de temporadas.

### Funcionalidades Principais

- Autenticação e autorização com JWT
- Gerenciamento de usuários com diferentes níveis de acesso
- Sistema de check-in com upload de fotos
- Gestão de temporadas (seasons)
- Sistema de pontuação e ranking
- Recuperação de senha via e-mail
- Upload de imagens para Cloudinary
- Testes automatizados com Jest

## Tecnologias Utilizadas

### Core

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista e flexível
- **PostgreSQL** - Banco de dados relacional robusto
- **Prisma ORM** - ORM moderno para TypeScript/JavaScript

### Autenticação e Segurança

- **jsonwebtoken** - Geração e validação de tokens JWT
- **bcrypt** - Hash seguro de senhas
- **express-rate-limit** - Limitação de requisições

### Validação e Upload

- **joi** - Validação de schemas
- **multer** - Upload de arquivos multipart
- **cloudinary** - Armazenamento de imagens na nuvem

### Documentação e Testes

- **swagger-jsdoc** & **swagger-ui-express** - Documentação interativa da API
- **jest** - Framework de testes
- **nodemailer** - Envio de e-mails

### Ferramentas de Desenvolvimento

- **nodemon** - Reinicialização automática do servidor
- **morgan** - Logger de requisições HTTP
- **eslint** & **prettier** - Linting e formatação de código

## Arquitetura e Decisões Técnicas

### Padrão MVC (Model-View-Controller)

O projeto segue o padrão MVC adaptado para APIs:

```
Routes → Controllers → Services → Prisma (Model)
```

**Justificativa**: Separação clara de responsabilidades, facilitando manutenção e testes.

### Prisma ORM

**Por que Prisma?**

- **Type Safety**: Schema declarativo que gera tipos TypeScript
- **Migrations**: Controle de versão do banco de dados
- **Query Builder**: API fluente e intuitiva
- **Performance**: Queries otimizadas automaticamente

### JWT (JSON Web Tokens)

**Estratégia de Autenticação**:

- Tokens stateless para escalabilidade
- Expiração configurável (7 dias)
- Refresh token para renovação sem re-autenticação
- Payload contém apenas `userId` e `role` para minimizar tamanho

### Sistema de Roles

**Três níveis de acesso**:

- `ADMIN`: Acesso completo (CRUD de temporadas, aprovação de check-ins)
- `MEMBER`: Acesso padrão (realizar check-ins, visualizar ranking)
- `TRAINEE`: Acesso básico (mesmas permissões de MEMBER)

**Implementação**: Middleware `authorize()` que valida roles antes de executar controllers.

### Upload de Imagens

**Cloudinary vs Armazenamento Local**:

- **Cloudinary escolhido** para produção
- CDN global com baixa latência
- Transformações automáticas de imagem
- Backup e redundância incluídos
- Fallback para local (`/uploads`) em desenvolvimento

### Sistema de Temporadas

**Lógica de Negócio**:

- Apenas uma temporada pode estar ativa por vez
- Check-ins são vinculados à temporada ativa
- Pontos são agregados por usuário e temporada
- Evita manipulação retroativa de pontuações

### Validação com Joi

**Camadas de Validação**:

1. **Middleware `validate()`**: Valida body/query/params antes do controller
2. **Schemas reutilizáveis**: Definidos em `validators/`
3. **Mensagens customizadas**: Erros claros para o frontend

### Tratamento de Erros Centralizado

**Middleware `errorHandler`**:

- Captura erros síncronos e assíncronos
- Formata respostas de erro padronizadas
- Log de erros em desenvolvimento
- Oculta stack traces em produção

### Rate Limiting

**Proteção contra abuso**:

- 100 requisições por 15 minutos por IP
- Endpoints de autenticação têm limites mais restritivos
- Previne ataques de força bruta

Caso passe o limite, pode rodar o comando docker-compose restart backend para resetar o contador.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (v15 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

1. **Clone o repositório**:

```bash
git clone https://github.com/Lucas-Henrique-Lopes-Costa/compjunior
cd compjunior/backend
```

2. **Instale as dependências**:

```bash
npm install
```

3. **Configure as variáveis de ambiente**:

```bash
cp .env.example .env
```

## Configuração

Edite o arquivo `.env` com suas credenciais:

```env
# Server
NODE_ENV=development
PORT=5001

# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nasalinha_db"

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d

# Cloudinary (Upload de Imagens)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=noreply@nasalinha.com

# Prisma
PRISMA_STUDIO_PORT=5555
```

### Obtendo Credenciais

**Cloudinary** (Opcional, mas recomendado):

1. Crie conta em [cloudinary.com](https://cloudinary.com/)
2. Copie as credenciais do Dashboard
3. Se não configurar, o upload será local em `/uploads`

**Email SMTP** (Para recuperação de senha):

1. Use Gmail com [App Password](https://support.google.com/accounts/answer/185833)
2. Ou configure outro provedor SMTP

## Executando o Projeto

Precisamos rodar o projeto completo com backend e frontend.

Siga a documentação do frontend em [frontend/README.md](../frontend/README.md) para configurar o frontend.

### Docker

**Usando Docker Compose** (recomendado para desenvolvimento):

```bash
# Na raiz do projeto (onde está o docker-compose.yml)
docker-compose up -d
```

Rode o comando para executar as migrations e seeders do backend:

```bash
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma db seed
```

Isso iniciará:

- PostgreSQL (porta 5432)
- Backend API (porta 5001)
- Frontend React (porta 3000)

## Executando Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Gerar relatório de cobertura

```bash
npm run test:coverage
```

O relatório HTML será gerado em `coverage/lcov-report/index.html`

### Estrutura dos Testes

Os testes cobrem:

- Autenticação (registro, login, tokens)
- Autorização baseada em roles
- CRUD de usuários
- Sistema de check-in
- Gestão de temporadas
- Rankings

## Documentação da API

A documentação interativa Swagger está disponível em:

```
http://localhost:5001/api-docs
```

**Regras de Negócio**:

- Apenas uma temporada pode estar ativa
- Ativar nova temporada desativa a anterior automaticamente
- Check-ins só podem ser realizados em temporada ativa
- Datas de início/fim não podem se sobrepor com temporadas existentes

**Lógica de Cálculo**:

- Ranking ordenado por `totalPoints` (DESC)
- Em caso de empate, considera `checkInsCount`
- Atualizado em tempo real ao aprovar check-ins

## Documentação Postman

### 1. Importar a Collection

1. Abra o Postman
2. Clique em **Import** no canto superior esquerdo
3. Selecione o arquivo `postman_NaSalinha.json`
4. A collection será importada com todas as requisições organizadas

### 2. Configurar Variáveis de Ambiente

A collection usa variáveis que são configuradas automaticamente:

- `baseUrl`: URL base da API (padrão: `http://localhost:5001/api`)
- `accessToken`: Token de acesso JWT (preenchido automaticamente após login)
- `refreshToken`: Token de refresh (preenchido automaticamente após login)

Você pode criar um Environment no Postman para diferentes ambientes (dev, staging, prod):

```json
{
  "baseUrl": "http://localhost:5001/api"
}
```

## 📄 Licença

Este projeto está sob a licença MIT.
