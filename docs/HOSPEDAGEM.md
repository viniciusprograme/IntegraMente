# 🌐 Guia de Hospedagem - IntegraMente

## 📋 Índice

1. [Opções de Hospedagem](#opções-de-hospedagem)
2. [Comparativa de Plataformas](#comparativa-de-plataformas)
3. [Hospedagem em VPS/Servidor Dedicado](#hospedagem-em-vpsservidor-dedicado)
4. [Hospedagem em Windows Server](#hospedagem-em-windows-server)
5. [Hospedagem em Docker](#hospedagem-em-docker)
6. [Configuração de Domínio](#configuração-de-domínio)
7. [SSL/HTTPS](#sslhttps)

---

## 🎯 Opções de Hospedagem

### 1️⃣ **PaaS (Platform as a Service)** - Mais Fácil

Ideais para: Iniciantes, Prototipagem Rápida

#### Heroku

- **Custo**: Gratuito (com limitações) - USD $7/mês (pago)
- **Vantagens**:
  - Deploy ultra simples com Git
  - Suporta Node.js nativamente
  - Banco de dados PostgreSQL incluído
  - SSL automático
- **Desvantagens**:
  - Caro comparado a VPS
  - Apps gratuitos dormem após 30 min inatividade
  - Sem controle total do servidor
- **Deploy**:

```bash
# Instalar CLI do Heroku
npm install -g heroku

# Login
heroku login

# Criar app
heroku create integramente-api

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

#### Railway.app

- **Custo**: USD $5/mês (primeiro crédito gratuito)
- **Vantagens**:
  - Alternativa mais barata ao Heroku
  - Deploy automático via Git
  - Suporta Docker
  - Banco PostgreSQL/MySQL gratuito
- **Desvantagens**:
  - Menos maduro que Heroku
  - Comunidade menor
- **Deploy**:

```bash
# Conectar repositório GitHub
# Configurar variáveis de ambiente
# Deploy automático ao fazer push
```

#### Render

- **Custo**: USD $7/mês
- **Vantagens**:
  - Deploy simples
  - Suporta Web Services e Background Workers
  - Banco PostgreSQL incluído
  - SSL automático
- **Desvantagens**:
  - Reinicia app a cada novo deploy
  - Menos recursos que Heroku

### 2️⃣ **IaaS (Infrastructure as a Service)** - Mais Controle

Ideais para: Produção, Aplicações Críticas

#### DigitalOcean

- **Custo**: USD $4-12/mês (Droplet básico)
- **Vantagens**:
  - Preço muito competitivo
  - Painel intuitivo
  - Escalabilidade fácil
  - App Platform (gerenciado)
  - Suporte 24/7
- **Desvantagens**:
  - Requer conhecimento de Linux
  - Mais setup manual
- **Setup**:

```bash
# 1. Criar Droplet (Ubuntu 22.04)
# 2. Acessar via SSH
ssh root@seu_ip

# 3. Atualizar sistema
apt update && apt upgrade -y

# 4. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# 5. Clonar repositório
git clone seu-repo
cd IntegraMente/backend

# 6. Instalar dependências
npm install

# 7. Configurar variáveis de ambiente
nano .env

# 8. Instalar PM2 para manter app rodando
npm install -g pm2
pm2 start server.js --name "integramente-api"
pm2 startup
pm2 save

# 9. Configurar Nginx como proxy reverso
apt install -y nginx

# Ver secção Nginx abaixo para configuração
```

#### AWS (Amazon Web Services)

- **Custo**: USD $10-50+/mês (varia bastante)
- **Vantagens**:
  - Mais escalável
  - Muitos serviços complementares
  - Tier gratuito por 12 meses (novo)
  - RDS (banco gerenciado)
- **Desvantagens**:
  - Complexidade alta
  - Pricing confuso
  - Curva de aprendizado
- **Opções**:
  - EC2: VPS tradicional
  - Elastic Beanstalk: PaaS gerenciado
  - Lambda: Serverless (sem servidor sempre rodando)

#### Google Cloud / Azure

- **Custo**: Similares ao AWS
- **Vantagens**:
  - Infraestrutura robusta
  - Muitas ferramentas integradas
- **Desvantagens**:
  - Complexidade alta
  - Requer expertise

#### Linode

- **Custo**: USD $5-10/mês
- **Vantagens**:
  - Preço excelente
  - Suporte técnico bom
  - Fácil de usar
  - Marketplace com apps pré-configurados
- **Desvantagens**:
  - Comunidade menor

### 3️⃣ **Container as a Service** - Docker Gerenciado

#### Docker Hub + VPS

- **Custo**: USD $0-15 (VPS)
- **Vantagens**:
  - Ambiente consistente
  - Fácil escalabilidade
  - Replicável em qualquer lugar
- **Deploy**:

```bash
# Fazer push da imagem
docker build -t seu-usuario/integramente-api:latest .
docker push seu-usuario/integramente-api:latest

# No servidor
docker pull seu-usuario/integramente-api:latest
docker run -d -p 5000:5000 seu-usuario/integramente-api:latest
```

#### Kubernetes (K8s)

- **Custo**: USD $10-50+/mês
- **Vantagens**:
  - Orquestração profissional
  - Auto-scaling automático
  - Alta disponibilidade
- **Desvantagens**:
  - Muito complexo para iniciantes
  - Overkill para aplicação pequena
- **Plataformas**:
  - AWS EKS
  - Google GKE
  - Azure AKS
  - DigitalOcean Kubernetes

### 4️⃣ **Hospedagem em Windows Server** - Corporativo

#### Azure App Service

- **Custo**: USD $10-60+/mês
- **Vantagens**:
  - Nativo em Windows
  - Integração com Active Directory
  - Suporte Microsoft
- **Desvantagens**:
  - Mais caro
  - Menos comum para Node.js
- **Deploy**:

```bash
# Instalar Azure CLI
# Fazer login
az login

# Deploy
az webapp up --name integramente-api --resource-group seu-grupo
```

#### IIS (Internet Information Services)

- **Custo**: Incluído em Windows Server
- **Setup**:
  - Instalar iisnode no Windows Server
  - Configurar Application Pool
  - Apontar para server.js
- **Desvantagens**:
  - Node.js não é nativo em IIS
  - Configuração complexa
  - Não recomendado

#### Hospedagem com PM2

- **Custo**: Apenas VPS + PM2 Plus USD $10/mês

```bash
# Instalar PM2 Plus
npm install -g pm2-plus

# Monitoramento em tempo real
pm2 web

# Acessar dashboard: http://localhost:9615
```

---

## 📊 Comparativa de Plataformas

| Plataforma   | Custo/mês | Facilidade | Escalabilidade | Node.js | Recomendado    |
| ------------ | --------- | ---------- | -------------- | ------- | -------------- |
| Heroku       | $7-50     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐         | ✅      | Iniciantes     |
| Railway      | $5-50     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐         | ✅      | Iniciantes     |
| Render       | $7-50     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐         | ✅      | Iniciantes     |
| DigitalOcean | $4-12     | ⭐⭐⭐⭐   | ⭐⭐⭐⭐       | ✅      | Intermediários |
| AWS          | $10-50    | ⭐⭐       | ⭐⭐⭐⭐⭐     | ✅      | Profissionais  |
| Google Cloud | $10-50    | ⭐⭐       | ⭐⭐⭐⭐⭐     | ✅      | Profissionais  |
| Azure        | $10-60    | ⭐⭐       | ⭐⭐⭐⭐⭐     | ✅      | Corporativo    |
| Linode       | $5-10     | ⭐⭐⭐⭐   | ⭐⭐⭐⭐       | ✅      | Intermediários |
| VPS Genérico | $3-20     | ⭐⭐⭐     | ⭐⭐⭐⭐       | ✅      | Intermediários |

---

## 🖥️ Hospedagem em VPS/Servidor Dedicado

### Instalação Completa (Ubuntu 22.04)

```bash
# 1. Atualizações
apt update && apt upgrade -y

# 2. Instalar ferramentas essenciais
apt install -y build-essential curl wget git nano

# 3. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verificar versão
node --version  # v20.x.x
npm --version   # 10.x.x

# 4. Instalar MySQL (opcional, em vez de SQLite)
apt install -y mysql-server
sudo mysql_secure_installation

# 5. Instalar Nginx
apt install -y nginx

# 6. Instalar PM2
npm install -g pm2

# 7. Instalar certificados SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx

# 8. Firewall
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000/tcp  # Temporariamente, remover em produção
```

### Deploy da Aplicação

```bash
# 1. Criar usuário dedicado
useradd -m -s /bin/bash integramente
su - integramente

# 2. Clonar repositório
git clone seu-repo
cd IntegraMente/backend

# 3. Instalar dependências
npm install

# 4. Criar .env
cp .env.example .env
# Editar .env com valores de produção
nano .env

# 5. Iniciar com PM2
cd /home/integramente/IntegraMente/backend
pm2 start server.js --name "integramente-api"

# 6. Configurar startup automático
pm2 startup systemd -u integramente
pm2 save
```

### Configuração Nginx como Proxy Reverso

```bash
# Editar arquivo
sudo nano /etc/nginx/sites-available/integramente

# Adicionar:
```

```nginx
upstream integramente_api {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name seu-dominio.com;

    # Redirecionar HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # Segurança
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Compressão
    gzip on;
    gzip_types text/plain application/json;

    # Proxy para API Backend
    location /api/ {
        proxy_pass http://integramente_api/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Servir frontend estático
    location / {
        root /home/integramente/IntegraMente/frontend;
        try_files $uri $uri/ /index.html;
    }

    # Logs
    access_log /var/log/nginx/integramente_access.log;
    error_log /var/log/nginx/integramente_error.log;
}
```

```bash
# Ativar configuração
sudo ln -s /etc/nginx/sites-available/integramente /etc/nginx/sites-enabled/
sudo nginx -t  # Testar

# Reiniciar Nginx
sudo systemctl restart nginx

# Obter certificado SSL
sudo certbot certonly --nginx -d seu-dominio.com
```

---

## 🔒 Hospedagem em Windows Server

### Requisitos

- Windows Server 2016 ou superior
- Node.js instalado
- IIS (Internet Information Services) instalado

### Instalação com PM2

```powershell
# 1. Instalar Node.js
# Download de nodejs.org e executar instalador

# 2. Instalar PM2
npm install -g pm2

# 3. Instalar PM2 Windows Service
pm2 install pm2-windows-startup
pm2 start server.js --name "integramente-api"
pm2 save

# 4. Configurar PM2 para iniciar com Windows
pm2-startup install

# 5. Verificar status
pm2 status
```

### Configuração IIS + Node.js (Alternativa)

```powershell
# 1. Instalar iisnode
# Download: https://github.com/Azure/iisnode

# 2. Criar site no IIS
# - Apontar para pasta: C:\IntegraMente\frontend
# - Criar Virtual Application chamada 'api'
# - Apontar para C:\IntegraMente\backend

# 3. Criar arquivo web.config
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[/]?" />
        </rule>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True" />
          </conditions>
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="node_modules" />
        </hiddenSegments>
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
```

---

## 🐳 Hospedagem em Docker

### Docker Cloud Providers

#### AWS ECS (Elastic Container Service)

```bash
# Criar cluster
aws ecs create-cluster --cluster-name integramente

# Deploy serviço
# Usar dashboard AWS
```

#### Google Cloud Run

```bash
# Fazer login
gcloud auth login

# Fazer build
gcloud builds submit --tag gcr.io/seu-projeto/integramente-api

# Deploy
gcloud run deploy integramente-api \
  --image gcr.io/seu-projeto/integramente-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### DigitalOcean App Platform

```yaml
# app.yaml
name: integramente
services:
  - name: backend
    github:
      repo: seu-usuario/IntegraMente
      branch: main
    build_command: npm install
    run_command: npm start
    http_port: 5000
    envs:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        scope: RUN_TIME
        value: ${JWT_SECRET}

  - name: frontend
    github:
      repo: seu-usuario/IntegraMente
      branch: main
    build_command: npm install -g http-server
    run_command: http-server frontend -p 3000
    http_port: 3000
```

---

## 🌍 Configuração de Domínio

### Registradores de Domínio

- Namecheap (USD $8-12/ano)
- GoDaddy (USD $10-15/ano)
- Hostinger (USD $2-10/ano)
- AWS Route 53 (USD 0.50/mês)

### Apontar Domínio para Servidor

1. **Registrador**: Copiar nameservers do seu servidor
2. **DNS records**:
   - A: seu-dominio.com → IP do servidor
   - CNAME: www.seu-dominio.com → seu-dominio.com
   - MX: (se usar email)

### Exemplo com Route 53 (AWS)

```bash
# Criar hosted zone
# Apontar nameservers no registrador
# Criar records A
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "seu-dominio.com",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [{"Value": "SEU_IP"}]
      }
    }]
  }'
```

---

## 🔐 SSL/HTTPS

### Let's Encrypt (Gratuito e Recomendado)

```bash
# Via Certbot
sudo certbot certonly --standalone -d seu-dominio.com

# Renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar renovação
sudo certbot renew --dry-run
```

### Configuração em Node.js

```javascript
const https = require("https");
const fs = require("fs");
const app = require("./app");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/seu-dominio.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/seu-dominio.com/fullchain.pem"),
};

https.createServer(options, app).listen(443, () => {
  console.log("HTTPS Server rodando na porta 443");
});
```

---

## ✅ Checklist de Hospedagem

- [ ] Servidor/plataforma escolhida
- [ ] Node.js instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Arquivo .env configurado com valores de produção
- [ ] Banco de dados migrado/testado
- [ ] PM2/supervisor configurado
- [ ] Nginx/proxy reverso configurado
- [ ] SSL/HTTPS ativado
- [ ] Domínio apontando para servidor
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Logs configurados

---

## 📞 Suporte e Recursos

- Node.js Deployment: https://nodejs.org/en/docs/guides/nodejs-web-application/
- PM2 Docs: https://pm2.keymetrics.io/docs/
- Let's Encrypt: https://letsencrypt.org/
- Nginx Docs: https://nginx.org/en/docs/
