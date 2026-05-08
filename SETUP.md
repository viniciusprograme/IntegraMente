# 🚀 Instruções Pós-Clone - IntegraMente

Bem-vindo ao IntegraMente! Este arquivo ajudará você a configurar o projeto em seu ambiente local.

## ✅ O que fazer depois de clonar

### 1. Abrir Pasta em VSCode

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/IntegraMente.git
cd IntegraMente

# Abrir no VSCode
code .
```

### 2. Instalar Extensões Recomendadas

O VSCode automaticamente sugerirá extensões baseado em `.vscode/extensions.json`.

**Clique em "Install All"** quando aparecer a notificação.

Extensões que serão instaladas:

- **Prettier**: Formatação de código
- **ESLint**: Linter JavaScript
- **REST Client**: Testar APIs
- **GitLens**: Git insights
- **Docker**: Suporte Docker

### 3. Configurar Backend

```bash
# Terminal 1: Configurar Backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env (baseado em .env.example)
cp .env.example .env

# ⚠️ IMPORTANTE: Editar .env com valores corretos
# - JWT_SECRET: gerar valor seguro
# - PORT: 5000 (padrão)
# - FRONTEND_URL: http://localhost:3000
```

**Gerar JWT_SECRET seguro:**

```powershell
# PowerShell (Windows)
$bytes = New-Object 'byte[]' 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
Write-Output "JWT_SECRET=$secret"
```

```bash
# Bash (Linux/Mac)
openssl rand -base64 32
```

### 4. Configurar Frontend

```bash
# Terminal 2: Configurar Frontend
cd frontend

# Ou se usando http-server globalmente
npx http-server -p 3000
```

### 5. Iniciar Desenvolvimento

```bash
# Terminal 1 (Backend)
cd backend
npm start
# Esperado: "✅ Servidor rodando em porta 5000"

# Terminal 2 (Frontend)
cd frontend
npx http-server -p 3000
# Esperado: "Hit CTRL-C to stop the server"

# Terminal 3 (Optional - Debug)
# Abrir VSCode Debug (F5 ou menu)
```

### 6. Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/api/health
- **Adminer** (se usar Docker): http://localhost:8080

---

## 🐳 Alternativa: Usar Docker

Se preferir containerizar:

```bash
# Navegar para pasta docker
cd docker

# Iniciar com Docker Compose
docker compose up --build

# Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api
# Nginx: http://localhost
```

---

## 📁 Estrutura de Pastas

```
IntegraMente/
├── backend/              # API Node.js (porta 5000)
│   ├── server.js        # Arquivo principal
│   ├── package.json     # Dependências
│   ├── .env             # Variáveis locais (NÃO COMMITAR)
│   └── data/            # Banco SQLite
├── frontend/             # HTML/CSS/JS (porta 3000)
│   ├── index.html
│   ├── style.css
│   └── carousel.js
├── docker/               # Configuração Docker
│   ├── docker-compose.yml
│   └── Dockerfile.*
├── docs/                 # Documentação
│   ├── INSTALACAO.md
│   ├── HOSPEDAGEM.md
│   └── TROUBLESHOOTING.md
└── .vscode/              # Configurações VSCode
    ├── settings.json     # Já configurado!
    └── launch.json       # Debug já configurado!
```

---

## 🔧 Configurações VSCode (Já Herdadas)

Estas configurações já estão em `.vscode/settings.json`:

✅ **Formatação automática** ao salvar
✅ **ESLint** ativado
✅ **Indent 2 espaços**
✅ **Trim trailing whitespace**
✅ **UTF-8** charset
✅ **Variáveis de ambiente** pré-configuradas

### Debug Backend

Abra **Run and Debug** (Ctrl+Shift+D) e clique em "IntegraMente Backend" para debugar:

```javascript
// Breakpoints funcionam
// Variáveis aparecem no sidebar
// Console integrado mostra logs
```

---

## 🧪 Testes Rápidos

### Health Check

```bash
# No terminal
curl http://localhost:5000/api/health

# Resposta esperada:
# {"status":"ok","timestamp":"2026-05-08T...","version":"1.0.0"}
```

### Login Padrão

```bash
# Usuário admin criado automaticamente:
Matricula: ADMIN001
Senha: admin2024
```

---

## 📚 Próximos Passos

1. **Ler documentação**: Consulte `docs/INSTALACAO.md`
2. **Testar API**: Use REST Client para testar endpoints
3. **Desenvolvimento**: Comece adicionando features
4. **Commits**: Use conventional commits (`feat:`, `fix:`, etc.)

---

## 🆘 Problemas?

Se encontrar erros:

1. **Ver logs completos**:
   - Backend: Terminal do npm
   - Frontend: Console do browser (F12)

2. **Consultar guias**:
   - `docs/TROUBLESHOOTING.md` - Problemas comuns
   - `docs/INSTALACAO.md` - Instalação detalhada

3. **Resetar ambiente**:

   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   # Apenas F5 no browser
   ```

---

## 💾 Antes de Commitar

```bash
# Verificar .env não foi adicionado
git status
# Não deve mostrar: backend/.env, frontend/.env

# Adicionar somente código
git add .
git commit -m "feat: sua feature aqui"

# Push
git push origin main
```

---

## 🎯 Checklist de Setup

- [ ] VSCode com extensões instaladas
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] Backend com `npm install` executado
- [ ] `.env` criado com `JWT_SECRET` gerado
- [ ] Backend rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Health check funcionando (`/api/health`)
- [ ] Consegue fazer login com ADMIN001/admin2024

---

**Pronto!** Você está configurado para desenvolver. Happy coding! 🚀
