# 🎨 Frontend - IntegraMente

Arquivos estáticos HTML/CSS/JavaScript para a Plataforma IntegraMente.

## 📁 Estrutura de Arquivos

```
frontend/
├── index.html              # Página inicial
├── login.html              # Página de login
├── servicos.html           # Página de serviços
├── sobre.html              # Página sobre nós
├── contato.html            # Página de contato
├── recursos.html           # Página de recursos
├── style.css               # Estilos CSS compartilhados
├── carousel.js             # Componente carrossel
├── services-modal.js       # Componente de modais
├── responsive-test.html    # Teste de responsividade
└── test-modal.html         # Teste de modais
```

## 🚀 Como Executar

### Opção 1: Com http-server (Node.js)

```bash
# Instalar globalmente (primeira vez)
npm install -g http-server

# Executar servidor
http-server -p 3000

# Com suporte a SPA (Single Page Application)
http-server -p 3000 --spa

# Acessar: http://localhost:3000
```

### Opção 2: Com Python

```bash
# Python 3.x
python -m http.server 3000

# Acessar: http://localhost:3000
```

### Opção 3: VSCode Live Server

```
1. Abrir arquivo index.html
2. Clicar em "Go Live" (canto inferior direito)
```

### Opção 4: Docker

```bash
cd docker
docker compose up frontend
```

## ⚙️ Configuração de API

O frontend se conecta ao backend através da variável `API_BASE`:

```javascript
const API_BASE = "http://localhost:5000";
```

**Para mudar a URL da API**, edite em cada arquivo HTML:

```html
<script>
  const API_BASE = "http://seu-dominio.com:5000";
  // ou
  const API_BASE = "https://api.seu-dominio.com";
</script>
```

## 🔗 Endpoints da API

### Autenticação

- `POST /api/auth/login` - Fazer login
- `POST /api/auth/registrar` - Registrar novo usuário
- `GET /api/auth/me` - Obter dados do usuário autenticado
- `PATCH /api/auth/alterar-senha` - Alterar senha

### Inscrições

- `GET /api/inscricoes` - Listar inscrições do usuário
- `POST /api/inscricoes` - Criar nova inscrição
- `GET /api/inscricoes/:id` - Obter inscrição específica

### Admin

- `GET /api/usuarios` - Listar todos os usuários
- `PATCH /api/usuarios/:id/ativar` - Ativar usuário
- `PATCH /api/usuarios/:id/desativar` - Desativar usuário
- `GET /api/logs` - Ver logs de atividade

### Saúde

- `GET /api/health` - Health check

## 📱 Responsividade

O site é totalmente responsivo para:

- 📱 Mobile (320px - 480px)
- 📱 Tablet (481px - 768px)
- 💻 Desktop (769px+)

Teste com: `responsive-test.html`

## 🧪 Testes

### Teste de API

1. Abrir DevTools (F12)
2. Ir para Console
3. Executar:

```javascript
// Health check
fetch("http://localhost:5000/api/health")
  .then((r) => r.json())
  .then((d) => console.log(d));

// Login
fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    matricula: "ADMIN001",
    senha: "admin2024",
  }),
})
  .then((r) => r.json())
  .then((d) => console.log(d));
```

## 🎯 Funcionalidades

✅ Página inicial responsiva
✅ Carrossel de imagens automático
✅ Sistema de autenticação (login/logout)
✅ Modais para formulários
✅ Menu hambúrguer para mobile
✅ Design moderno e intuitivo
✅ Frases motivacionais
✅ Suporte a múltiplas páginas

## 🔐 Segurança

- Tokens JWT salvos em `localStorage`
- CORS configurado no backend
- Validação de formulários client-side
- Proteção de dados sensíveis

## 📚 Componentes JavaScript

### Carousel (carousel.js)

```javascript
showSlide(n); // Mostrar slide específico
changeSlide(n); // Navegar para próximo/anterior
currentSlide(n); // Pular para slide
```

### Modals (services-modal.js)

```javascript
openModal(modalId); // Abrir modal
closeModal(modalId); // Fechar modal
```

## 🐛 Troubleshooting

### CORS Error

- Verificar se backend está rodando
- Verificar CORS_ORIGIN em `.env` do backend
- Verificar protocolo (http vs https)

### Página em branco

- Abrir DevTools (F12) e ver Console
- Verificar se arquivos estão carregando
- Testar arquivo específico

### Imagens não aparecem

- Verificar URLs de imagens (Unsplash)
- Verificar conexão de internet
- Usar imagens locais se necessário

## 📖 Documentação

Ver arquivos principal:

- [docs/INSTALACAO.md](../docs/INSTALACAO.md) - Guia de instalação
- [docs/HOSPEDAGEM.md](../docs/HOSPEDAGEM.md) - Opções de hospedagem
- [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - Problemas comuns

## 💾 Arquivos de Estilo

### style.css

- Variables CSS para cores e fontes
- Mobile-first responsive design
- Animações e transições suaves
- Temas customizáveis

## 🚀 Deployment

### Para produção:

1. **Otimizar arquivos**:

```bash
# Minificar CSS/JS (opcional)
# Usar ferramentas como: terser, cssnano
```

2. **Configurar API URL**:
   Editar `API_BASE` para URL de produção

3. **Deploy em servidor**:

```bash
# Copiar todos os arquivos para /var/www/html
cp -r frontend/* /var/www/html/
```

4. **Configurar Nginx/Apache**:
   Ver [docs/HOSPEDAGEM.md](../docs/HOSPEDAGEM.md)

## 📞 Suporte

Para problemas, consulte:

- 🆘 [Troubleshooting](../docs/TROUBLESHOOTING.md)
- 📖 [Instalação](../docs/INSTALACAO.md)
- 🌐 [Hospedagem](../docs/HOSPEDAGEM.md)
