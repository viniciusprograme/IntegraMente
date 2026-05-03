# Backend IntegraMente - Documentação da API

## 📋 Visão Geral

Backend simples e leve para a plataforma IntegraMente de Saúde Mental. Utiliza Node.js, Express e SQLite.

## 🚀 Instalação e Setup

### Pré-requisitos
- Node.js v14+
- npm ou yarn

### Passos

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Editar o arquivo .env com suas configurações
nano .env
```

3. **Iniciar o servidor**
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Ou modo produção
npm start
```

O servidor iniciará em `http://localhost:5000`

## 📡 Endpoints da API

### Autenticação

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "matricula": "EMP001",
  "senha": "integra2024"
}

Response (200):
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "matricula": "EMP001",
    "nome": "João Silva",
    "empresa": "TechCorp",
    "admin": false
  }
}
```

#### Registrar Novo Usuário
```
POST /api/auth/registrar
Content-Type: application/json

{
  "matricula": "EMP006",
  "senha": "senha_segura_123",
  "nome": "Maria Santos",
  "empresa": "Empresa Ltda",
  "email": "maria@empresa.com",
  "telefone": "(11) 98765-4321"
}

Response (201):
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso",
  "usuarioId": 6
}
```

#### Perfil do Usuário
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "sucesso": true,
  "usuario": {
    "id": 1,
    "matricula": "EMP001",
    "nome": "João Silva",
    "empresa": "TechCorp",
    "email": "joao@empresa.com",
    "telefone": "(11) 98765-4321",
    "admin": false,
    "ativo": 1,
    "criado_em": "2024-04-25T08:00:00.000Z"
  }
}
```

#### Alterar Senha
```
PATCH /api/auth/alterar-senha
Authorization: Bearer {token}
Content-Type: application/json

{
  "senha_atual": "senha_antiga",
  "senha_nova": "senha_nova_123"
}

Response (200):
{
  "sucesso": true,
  "mensagem": "Senha alterada com sucesso"
}
```

### Inscrições / Formulários

#### Criar Inscrição
```
POST /api/inscricoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_servico": "Consulta Online",
  "dados_formulario": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 98765-4321",
    "horario": "manha",
    "descricao": "Consulta para ansiedade"
  }
}

Response (201):
{
  "sucesso": true,
  "mensagem": "Inscrição realizada com sucesso",
  "inscricaoId": 42
}
```

#### Listar Inscrições do Usuário
```
GET /api/inscricoes
Authorization: Bearer {token}

Response (200):
{
  "sucesso": true,
  "total": 3,
  "inscricoes": [
    {
      "id": 42,
      "usuario_id": 1,
      "tipo_servico": "Consulta Online",
      "dados_formulario": { ... },
      "status": "pendente",
      "criado_em": "2024-04-25T10:30:00.000Z"
    },
    ...
  ]
}
```

#### Buscar Inscrição Específica
```
GET /api/inscricoes/{id}
Authorization: Bearer {token}

Response (200):
{
  "sucesso": true,
  "inscricao": {
    "id": 42,
    "usuario_id": 1,
    "tipo_servico": "Consulta Online",
    "dados_formulario": { ... },
    "status": "pendente",
    "criado_em": "2024-04-25T10:30:00.000Z"
  }
}
```

### Usuários (Admin Only)

#### Listar Todos os Usuários
```
GET /api/usuarios
Authorization: Bearer {token_admin}

Response (200):
{
  "sucesso": true,
  "total": 7,
  "usuarios": [
    {
      "id": 1,
      "matricula": "ADMIN001",
      "nome": "Administrador",
      "empresa": "IntegraMente",
      "email": "admin@integramente.com",
      "ativo": 1,
      "criado_em": "2024-04-25T08:00:00.000Z"
    },
    ...
  ]
}
```

#### Desativar Usuário
```
PATCH /api/usuarios/{id}/desativar
Authorization: Bearer {token_admin}

Response (200):
{
  "sucesso": true,
  "mensagem": "Usuário desativado"
}
```

#### Reativar Usuário
```
PATCH /api/usuarios/{id}/ativar
Authorization: Bearer {token_admin}

Response (200):
{
  "sucesso": true,
  "mensagem": "Usuário ativado"
}
```

#### Listar Logs de Atividade
```
GET /api/logs
Authorization: Bearer {token_admin}

Response (200):
{
  "sucesso": true,
  "total": 25,
  "logs": [
    {
      "id": 1,
      "usuario_id": 1,
      "usuario_nome": "Administrador",
      "acao": "LOGIN",
      "detalhes": null,
      "ip_address": "::1",
      "criado_em": "2024-05-03T12:00:00.000Z"
    },
    ...
  ]
}
```

### Health Check

#### Verificar Status do Servidor
```
GET /api/health

Response (200):
{
  "status": "ok",
  "timestamp": "2024-04-25T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem um token JWT no header:
```
Authorization: Bearer {token}
```

O token expira em **8 horas**.

## 💾 Banco de Dados

### Tabelas

#### usuarios
- `id`: ID único
- `matricula`: Identificador único (TEXT)
- `senha`: Senha com hash bcryptjs
- `nome`: Nome completo
- `empresa`: Empresa/Organização
- `email`: Email
- `telefone`: Telefone
- `admin`: Flag admin (0 ou 1)
- `suporte`: Flag suporte (0 ou 1)
- `ativo`: Ativo/Inativo (0 ou 1)
- `criado_em`: Data de criação
- `atualizado_em`: Data da última atualização

#### inscricoes
- `id`: ID único
- `usuario_id`: ID do usuário
- `tipo_servico`: Tipo de serviço
- `dados_formulario`: JSON com dados do formulário
- `status`: Status (pendente, confirmada, cancelada)
- `criado_em`: Data de criação

#### logs
- `id`: ID único
- `usuario_id`: ID do usuário (pode ser NULL)
- `acao`: Ação realizada
- `detalhes`: Detalhes adicionais
- `ip_address`: IP do cliente
- `criado_em`: Data de criação

## 🧪 Testar Endpoints

### Usando CURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "ADMIN001",
    "senha": "admin2024"
  }'

# Criar inscrição (use o token recebido)
curl -X POST http://localhost:5000/api/inscricoes \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_servico": "Consulta Online",
    "dados_formulario": {
      "nome": "João",
      "email": "joao@email.com",
      "telefone": "(11) 98765-4321"
    }
  }'
```

### Usando Postman

1. Importe a coleção de endpoints (endpoints.json)
2. Configure o ambiente com `BASE_URL=http://localhost:5000`
3. Execute os requests

## 🚀 Deploy/Hospedagem

### Opções recomendadas:

1. **Vercel** (Recomendado para simplecidade)
   - Deploy automático do git
   - Plano gratuito disponível
   - Suporta Node.js

2. **Railway**
   - Simples e rápido
   - Banco de dados SQLite incluído
   - Dashboard intuitivo

3. **Render**
   - Free tier generoso
   - Suporta projetos Node.js
   - PostgreSQL disponível

4. **Heroku** (Deprecated)
   - Alternativa: parecido é Render

### Ambiente de Produção

Certifique-se de:
- ✅ Mudar `JWT_SECRET` para uma chave segura
- ✅ Definir `NODE_ENV=production`
- ✅ Usar HTTPS
- ✅ Configurar CORS corretamente
- ✅ Fazer backup do banco de dados regularmente

## 📝 Variáveis de Ambiente

```env
PORT=5000                          # Porta do servidor
FRONTEND_URL=http://localhost:8000 # URL do frontend (CORS)
JWT_SECRET=chave_segura_aqui       # Chave JWT (IMPORTANTE: mude isso!)
NODE_ENV=development               # development ou production
DATABASE_PATH=./data/integramente.db # Caminho do banco
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
```bash
npm install
```

### Erro: "EADDRINUSE: address already in use"
```bash
# Mude a PORT no .env
# Ou mate o processo anterior:
lsof -ti:5000 | xargs kill -9
```

### Erro: "Database locked"
Geralmente significa que há múltiplas instâncias acessando o banco.
Reinicie o servidor.

## 📞 Suporte

Para dúvidas ou problemas, contacte:
- Email: suporte@integramente.com
- Telefone: (11) 9999-9999

---

**Desenvolvido com ❤️ para IntegraMente**
