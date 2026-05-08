# 🔧 Guia de Troubleshooting - IntegraMente

## 📋 Problemas Comuns e Soluções

---

## 🚫 **Erro: "npm not recognized" / "npm: comando não encontrado"**

### Causa

Node.js não foi instalado ou não está no PATH do sistema.

### Soluções

#### Windows

```powershell
# 1. Verificar se Node.js está instalado
node --version

# Se não funcionar, desinstalar Node.js e reinstalar
# Windows: Painel de Controle > Desinstalar programas > Node.js

# Reinstalar:
# Opção A: Download manual de nodejs.org
# Opção B: Com Chocolatey
choco install nodejs -y

# Opção C: Com Winget
winget install OpenJS.NodeJS

# 2. Adicionar Node.js ao PATH manualmente
# Painel de Controle > Variáveis de Ambiente
# Adicionar C:\Program Files\nodejs ao PATH
# Reiniciar PowerShell/CMD

# 3. Verificar PATH
$env:PATH
# Deve conter: C:\Program Files\nodejs

# 4. Teste
npm --version
```

#### Linux/Mac

```bash
# Instalar via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Instalar Node.js
nvm install 20
nvm use 20

# Verificar
node --version
npm --version
```

---

## 🚫 **Erro: "Cannot find module 'express'"**

### Causa

Dependências npm não estão instaladas.

### Solução

```bash
# Navegar para pasta backend
cd backend

# Limpar cache npm
npm cache clean --force

# Reinstalar dependências
npm install

# Ou forçar reinstalação
npm install --force --legacy-peer-deps
```

---

## 🚫 **Erro: "EACCES: permission denied" (Linux/Mac)**

### Causa

Permissões insuficientes para acessar arquivos.

### Solução

```bash
# Mudar permissões
sudo chown -R $USER:$USER .

# Ou dar permissão de execução
chmod -R 755 backend/data

# Ou usar sudo (não recomendado)
sudo npm install
```

---

## 🚫 **Erro: "Port 5000 already in use" / "EADDRINUSE"**

### Causa

Outra aplicação já está usando a porta 5000.

### Soluções

#### Windows

```powershell
# 1. Encontrar processo usando porta 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
# Resultado: PID do processo

# 2. Encerrar processo
Stop-Process -Id XXXX -Force

# 3. Ou usar porta diferente
# Editar .env
PORT=5001

# Reiniciar servidor
npm start
```

#### Linux/Mac

```bash
# Encontrar processo
lsof -i :5000

# Encerrar
kill -9 XXXX

# Ou usar porta diferente
PORT=5001 npm start
```

---

## 🚫 **Erro: "CORS blocked request"**

### Causa

Frontend em http://localhost:3000, mas backend em http://localhost:5000 com CORS não configurado.

### Solução

```javascript
// backend/server.js - Verificar CORS

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

```bash
# Ou editar .env
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

---

## 🚫 **Erro: "Failed to connect to database" / SQLite error**

### Causa

Banco de dados corrompido ou permissões insuficientes.

### Soluções

```bash
# 1. Deletar banco e deixar criar novo
cd backend
rm -rf data/integramente.db
# Ou Windows: del data\integramente.db

# 2. Dar permissão na pasta data
chmod -R 777 data/

# 3. Verificar .env
# DATABASE_PATH deve estar correto (padrão: ./data/integramente.db)

# 4. Se usar MySQL em vez de SQLite
# Verificar conexão MySQL
mysql -u root -p -e "SELECT 1"
```

---

## 🚫 **Erro: "localhost:3000 refused to connect"**

### Causa

Frontend não está rodando ou porta errada.

### Solução

```bash
# 1. Verificar se frontend está rodando
# Terminal dedicado para frontend
cd frontend

# Opção A: http-server
npx http-server -p 3000

# Opção B: Python
python -m http.server 3000

# Opção C: VSCode Live Server
# Clicar em "Go Live"

# 2. Verificar porta
# Editar para porta 8080 se 3000 está ocupada
http-server -p 8080

# 3. Abrir no browser
# http://localhost:3000
# ou
# http://localhost:8080
```

---

## 🚫 **Erro: "Cannot GET /" (Frontend em branco)**

### Causa

Arquivo index.html não está sendo servido corretamente.

### Solução

```bash
# Se usando http-server
cd frontend
http-server -p 3000 --gzip --cache -1

# Se usando Python 3 (que não serve SPA bem)
# Usar http-server em vez de:
python -m http.server 3000  # ❌ Não serve SPA

# Criar arquivo .htaccess (Apache)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🚫 **Erro: "socket hang up" / "Connection reset"**

### Causa

Servidor Node.js travou ou foi desligado.

### Solução

```bash
# 1. Verificar se servidor está rodando
# Abrir browser: http://localhost:5000/api/health

# 2. Se não responder, reiniciar
# Terminal com servidor: Ctrl+C
npm start

# 3. Ver logs de erro
# Usar PM2 para ver logs persistentes
pm2 install pm2-auto-restart
pm2 status

# 4. Aumentar timeout em frontend
const timeout = 10000; // 10 segundos
fetch('http://localhost:5000/api/health', {
  signal: AbortSignal.timeout(timeout)
})
```

---

## 🚫 **Erro: "413 Payload Too Large"**

### Causa

Arquivo enviado é maior que o limite do servidor.

### Solução

```javascript
// backend/server.js
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
```

---

## 🚫 **Erro: "401 Unauthorized" / Token inválido**

### Causa

Token JWT expirado ou geração incorreta.

### Solução

```javascript
// Verificar JWT_SECRET é igual em .env e código
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// No frontend, salvar e enviar token corretamente
localStorage.setItem("token", dados.token);

// Enviar em request
const token = localStorage.getItem("token");
fetch("http://localhost:5000/api/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🚫 **Erro: "MODULE_NOT_FOUND" durante deploy**

### Causa

node_modules não foi enviado ou dependências não instaladas no servidor.

### Solução

```bash
# Adicionar .gitignore
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
git add .gitignore

# No servidor após clonar
cd backend
npm install

# Verificar
ls -la node_modules | head

# Para deploy Docker
# Dockerfile já cuida disso com RUN npm install
```

---

## 🚫 **Erro: "ENOSPC" (Sem espaço em disco)**

### Causa

Disco cheio ou node_modules muito grande.

### Solução

```bash
# Ver espaço em disco
df -h  # Linux/Mac
dir  # Windows

# Limpar cache npm
npm cache clean --force

# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Usar npm ci (mais rápido para produção)
npm ci

# Comprimir node_modules
# Usar npm ci + Dockerfile multi-stage
```

---

## 🚫 **Erro Docker: "Cannot connect to Docker daemon"**

### Causa

Docker Desktop não está rodando (Windows/Mac).

### Solução

```bash
# Windows
# 1. Abrir Docker Desktop
# 2. Esperar inicializar (ícone na taskbar)

# Linux
sudo systemctl start docker
sudo systemctl status docker

# Verificar
docker ps

# Se ainda não funcionar
docker system prune -a  # Limpar tudo
docker-compose down     # Desligar containers
```

---

## 🚫 **Erro Docker: "Port already allocated"**

### Causa

Docker tentando usar porta já em uso.

### Solução

```bash
# Ver containers rodando
docker ps

# Parar container
docker stop CONTAINER_ID

# Ou mudar porta em docker-compose.yml
# De: "5000:5000"
# Para: "5001:5000"

# Reconstruir
docker compose down
docker compose up --build
```

---

## 🚫 **Erro: "Cannot find GET /login.html" (Frontend com rotas)**

### Causa

Frontend SPA não redireciona corretamente para index.html.

### Solução para Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Solução para http-server

```bash
http-server -p 3000 -c-1 --spa
```

---

## 🚫 **Performance lenta / Travamentos**

### Diagnóstico

```bash
# Ver uso de CPU e memória
top          # Linux/Mac
Get-Process  # Windows PowerShell

# Ver conexões de rede
netstat -an

# Ver logs de erro
tail -f backend/data/logs.txt
pm2 logs
```

### Otimizações

```javascript
// backend/server.js

// 1. Adicionar caching
const cacheMiddleware = (req, res, next) => {
  res.header("Cache-Control", "public, max-age=3600");
  next();
};

// 2. Usar compression
const compression = require("compression");
app.use(compression());

// 3. Limitar requisições (rate limiting)
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
```

---

## 🚫 **Erro de CORS em produção (HTTPS)**

### Causa

Frontend HTTPS, Backend HTTP.

### Solução

```env
# .env produção
FRONTEND_URL=https://seu-dominio.com
ALLOWED_ORIGINS=https://seu-dominio.com

# Todos devem ser HTTPS
NODE_ENV=production
PROTOCOL=https
```

```javascript
// Forçar HTTPS em produção
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 🚫 **PM2: App não reinicia após crash**

### Solução

```bash
# Habilitar auto-restart
pm2 start server.js --name "integramente-api" --exp-backoff-restart-delay=100

# Ou criar ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "integramente-api",
      script: "./server.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",
      time: true,
      autorestart: true,
      max_memory_restart: "1G",
      merge_logs: true,
    },
  ],
};

// Usar:
// pm2 start ecosystem.config.js
// pm2 save
// pm2 startup
```

---

## 📊 Checklist de Debug

- [ ] Node.js está instalado e no PATH
- [ ] npm install foi executado
- [ ] .env arquivo criado com valores corretos
- [ ] Porta 5000 não está em uso
- [ ] Backend rodando em http://localhost:5000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Banco de dados foi criado
- [ ] CORS está configurado
- [ ] JWT_SECRET é o mesmo no .env e código
- [ ] No Docker: docker daemon está rodando
- [ ] Logs são verificados (console ou pm2 logs)

---

## 🆘 Ainda não funciona?

1. **Verificar logs completos**:

```bash
pm2 logs integramente-api --lines 100
docker logs container_name
```

2. **Fazer teste com curl/Postman**:

```bash
curl http://localhost:5000/api/health
```

3. **Verificar arquivo .env**:

```bash
cat backend/.env
```

4. **Reiniciar tudo**:

```bash
# Backend
pm2 restart all

# Docker
docker compose restart

# PM2 Dashboard
pm2 web
# Acessar: http://localhost:9615
```

5. **Criar issue no GitHub** com:
   - Sistema operacional
   - Versão Node.js/npm
   - Mensagem de erro completa
   - Passos para reproduzir
   - Arquivo .env (sem dados sensíveis)
