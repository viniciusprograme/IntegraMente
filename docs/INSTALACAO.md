# 📦 Guia Completo de Instalação - IntegraMente

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Backend](#instalação-backend)
3. [Instalação Frontend](#instalação-frontend)
4. [Configuração de Ambiente](#configuração-de-ambiente)
5. [Execução Local](#execução-local)
6. [Instalação com Docker](#instalação-com-docker)
7. [Troubleshooting](#troubleshooting)

---

## ⚙️ Pré-requisitos

### Para Windows (Desenvolvimento Local)

- **Windows 10/11** ou superior
- **Node.js 18+** (recomendado 20 ou 26)
- **npm 9+** (incluído com Node.js)
- **Git for Windows**
- **VSCode** (opcional, mas recomendado)

### Para Docker

- **Docker Desktop 4.0+** instalado e rodando
- **Docker Compose 2.0+** (incluído no Docker Desktop)
- **Windows 10/11** com WSL 2 (Windows Subsystem for Linux) ativado

### Para Hospedagem

- Acesso à conta de hospedagem
- Terminal/SSH para linha de comando
- Conhecimento básico de Linux (se servidor remoto)

---

## 🖥️ Instalação Backend

### Passo 1: Baixar o Node.js

#### Opção A: Download direto

1. Acesse [nodejs.org](https://nodejs.org)
2. Baixe a versão LTS (recomendado) ou Current
3. Execute o instalador (.msi)
4. Marque: ✓ "Add to PATH"
5. Conclua a instalação

#### Opção B: Windows Package Manager

```powershell
winget install OpenJS.NodeJS
```

#### Opção C: Chocolatey

```powershell
choco install nodejs
```

### Passo 2: Verificar Instalação

```powershell
# Verificar Node.js
node --version
# Esperado: v18.0.0 ou superior

# Verificar npm
npm --version
# Esperado: 8.0.0 ou superior
```

### Passo 3: Clonar ou Baixar o Repositório

```bash
# Usando Git
git clone https://github.com/seu-usuario/IntegraMente.git
cd IntegraMente

# Ou download manual via ZIP
# Extrair a pasta e abrir no terminal
```

### Passo 4: Configurar Backend

```bash
# Navegar para pasta backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env local
copy .env.example .env

# Editar .env (importante!)
# Abrir em editor de texto e ajustar JWT_SECRET e PORT
```

#### Estrutura de `.env` (backend)

```env
# Configurações do servidor
PORT=5000
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Banco de dados (SQLite)
# Será criado automaticamente em: backend/data/integramente.db
```

### Passo 5: Inicializar Banco de Dados

```bash
# O banco será criado automaticamente na primeira execução
# Mas você pode testar com:

npm test

# Ou executar o servidor uma vez
npm start

# Pressionar Ctrl+C para parar
```

---

## 🎨 Instalação Frontend

### Passo 1: Configurar Pasta Frontend

A pasta frontend contém arquivos HTML/CSS/JS estáticos.

```bash
# Navegar para pasta frontend (a partir da raiz)
cd frontend

# Se estiver usando um servidor local (Python exemplo)
# Python 3.x
python -m http.server 3000

# Ou com Node.js
# Instalar http-server globalmente
npm install -g http-server

# Executar servidor na porta 3000
http-server -p 3000
```

### Passo 2: Configurar Arquivo de Configuração Frontend

Editar `frontend/config.js` (criar se não existir):

```javascript
// config.js - Configuração de API para frontend
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.integramente.com"
    : "http://localhost:5000";

const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/registrar`,
  profile: `${API_BASE_URL}/api/auth/me`,
  subscriptions: `${API_BASE_URL}/api/inscricoes`,
};

export default API_ENDPOINTS;
```

### Passo 3: Atualizar HTML para usar API

Exemplo de integração no HTML:

```html
<!-- index.html -->
<script>
  const API_BASE = "http://localhost:5000";

  async function fazerLogin(matricula, senha) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matricula, senha }),
      });

      const dados = await response.json();
      if (dados.sucesso) {
        localStorage.setItem("token", dados.token);
        console.log("Login realizado com sucesso!");
      }
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
    }
  }
</script>
```

---

## 🌍 Configuração de Ambiente

### Arquivo .env - Variáveis Importantes

#### Backend (.env)

```env
# 🔒 Segurança
JWT_SECRET=gere_uma_chave_complexa_com_64_caracteres_minimo
JWT_EXPIRATION=8h

# 📡 Servidor
PORT=5000
NODE_ENV=development
HOST=localhost

# 🌐 CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# 💾 Banco de Dados
DATABASE_PATH=./data/integramente.db
DATABASE_BACKUP=./data/backup

# 📧 Email (se aplicável)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=seu_email@gmail.com
# SMTP_PASS=sua_senha
```

### Gerar JWT_SECRET Seguro

```powershell
# PowerShell - Gerar chave aleatória
$bytes = New-Object 'byte[]' 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
Write-Output $secret

# Ou via OpenSSL (se instalado)
openssl rand -base64 32
```

---

## 🚀 Execução Local

### Terminal 1: Executar Backend

```bash
# A partir da raiz do projeto
cd backend

# Instalação de dependências (primeira vez)
npm install

# Iniciar servidor
npm start

# Esperado:
# ╔════════════════════════════════════════╗
# ║   🌩️  IntegraMente Backend Server      ║
# ║   ✅ Servidor rodando em porta 5000    ║
# ║   📡 URL: http://localhost:5000       ║
# ╚════════════════════════════════════════╝
```

### Terminal 2: Executar Frontend

```bash
# A partir de backend, voltar e ir para frontend
cd ../frontend

# Opção 1: Com http-server (Node.js)
npx http-server -p 3000

# Opção 2: Com Python
python -m http.server 3000

# Opção 3: Com Live Server (VSCode Extension)
# Clicar em "Go Live" no canto inferior direito

# Esperado:
# Starting up http-server, serving ./
# Hit CTRL-C to stop the server
# http://127.0.0.1:3000
```

### Testar Conexão

1. Abrir browser em `http://localhost:3000`
2. Abrir DevTools (F12 > Console)
3. Testar chamada de API:

```javascript
// No console do browser
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log(d));

// Esperado:
// { status: 'ok', timestamp: '2026-05-08T...', version: '1.0.0' }
```

---

## 🐳 Instalação com Docker

### Pré-requisitos

1. **Instalar Docker Desktop**
   - Windows: [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop)
   - Ativar WSL 2 durante instalação
   - Reiniciar computador

2. **Verificar Instalação**

```powershell
docker --version
# Docker version 24.0.0+

docker compose version
# Docker Compose version v2.20.0+
```

### Opção A: Usar docker-compose.yml (Recomendado)

```bash
# A partir da raiz do projeto
cd docker

# Construir e executar containers
docker compose up --build

# Esperado:
# integramente-backend  | ✅ Conectado ao banco de dados SQLite
# integramente-frontend | Starting up http-server
# integramente-nginx    | nginx: master process started

# Acessar:
# Frontend: http://localhost
# Backend: http://localhost/api
# Adminer: http://localhost:8080 (gerenciar banco)
```

### Opção B: Build e Run Manual

```bash
# Criar rede Docker
docker network create integramente-net

# Construir imagem backend
docker build -t integramente-backend:latest -f docker/Dockerfile.backend .

# Construir imagem frontend
docker build -t integramente-frontend:latest -f docker/Dockerfile.frontend .

# Executar backend
docker run -d \
  --name integramente-backend \
  --network integramente-net \
  -p 5000:5000 \
  -v ${PWD}/backend/data:/app/data \
  integramente-backend:latest

# Executar frontend
docker run -d \
  --name integramente-frontend \
  --network integramente-net \
  -p 3000:3000 \
  integramente-frontend:latest

# Verificar containers rodando
docker ps
```

### Parar Docker Compose

```bash
# Parar containers
docker compose down

# Parar e remover volumes
docker compose down -v

# Visualizar logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

## 🔧 Estrutura de Pastas

```
IntegraMente/
│
├── backend/                    # API Node.js/Express
│   ├── server.js              # Arquivo principal
│   ├── package.json           # Dependências
│   ├── .env                   # Variáveis de ambiente (NÃO COMMITAR)
│   ├── .env.example           # Template de .env
│   ├── node_modules/          # Dependências instaladas
│   └── data/                  # Banco de dados SQLite
│       └── integramente.db
│
├── frontend/                   # HTML/CSS/JS estáticos
│   ├── index.html
│   ├── login.html
│   ├── servicos.html
│   ├── style.css
│   ├── carousel.js
│   └── services-modal.js
│
├── docker/                     # Configurações Docker
│   ├── docker-compose.yml     # Orquestração containers
│   ├── Dockerfile.backend     # Imagem backend
│   ├── Dockerfile.frontend    # Imagem frontend
│   └── nginx.conf             # Configuração Nginx (proxy)
│
├── docs/                       # Documentação
│   ├── INSTALACAO.md          # Este arquivo
│   ├── HOSPEDAGEM.md          # Guia de hospedagem
│   └── TROUBLESHOOTING.md     # Solução de problemas
│
├── .vscode/                    # Configuração VSCode (herdável)
│   ├── settings.json          # Preferências do editor
│   ├── extensions.json        # Extensões recomendadas
│   └── launch.json            # Configuração de debug
│
├── .editorconfig              # Padrões de codificação (universal)
├── .gitignore                 # Arquivos a ignorar no Git
└── README.md                  # Visão geral do projeto
```

---

## ✅ Checklist Pós-Instalação

- [ ] Backend em execução (`npm start`)
- [ ] Frontend acessível em `http://localhost:3000`
- [ ] Banco de dados criado em `backend/data/`
- [ ] Login funcionando com usuário admin (ADMIN001/admin2024)
- [ ] Console do browser sem erros
- [ ] Terminal backend sem erros

---

## 📞 Suporte

Para problemas comuns, consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

Para opções de hospedagem, consulte [HOSPEDAGEM.md](./HOSPEDAGEM.md)
