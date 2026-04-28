const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const path = require('path');

// Configurações
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar banco de dados
const dbPath = path.join(__dirname, 'data', 'integramente.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite');
        initializeDatabase();
    }
});

// Função para executar queries com promise
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Inicializar tabelas
async function initializeDatabase() {
    try {
        // Tabela de usuários (empresas)
        await dbRun(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                matricula TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                nome TEXT NOT NULL,
                empresa TEXT NOT NULL,
                email TEXT NOT NULL,
                telefone TEXT,
                admin INTEGER DEFAULT 0,
                suporte INTEGER DEFAULT 0,
                ativo INTEGER DEFAULT 1,
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de inscrições/formulários
        await dbRun(`
            CREATE TABLE IF NOT EXISTS inscricoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                tipo_servico TEXT NOT NULL,
                dados_formulario TEXT NOT NULL,
                status TEXT DEFAULT 'pendente',
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        `);

        // Tabela de logs de atividade
        await dbRun(`
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER,
                acao TEXT NOT NULL,
                detalhes TEXT,
                ip_address TEXT,
                criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Tabelas de banco de dados criadas com sucesso');

        // Verificar se existe usuário admin padrão
        const adminExists = await dbGet('SELECT id FROM usuarios WHERE admin = 1 LIMIT 1');
        if (!adminExists) {
            await criarUsuarioPadrao();
        }
    } catch (err) {
        console.error('Erro ao inicializar banco de dados:', err);
    }
}

// Criar usuário padrão
async function criarUsuarioPadrao() {
    try {
        const senhaHash = await bcryptjs.hash('admin2024', 10);
        await dbRun(`
            INSERT INTO usuarios (matricula, senha, nome, empresa, email, admin)
            VALUES (?, ?, ?, ?, ?, ?)
        `, ['ADMIN001', senhaHash, 'Administrador', 'IntegraMente', 'admin@integramente.com', 1]);
        
        console.log('✅ Usuário admin padrão criado');
    } catch (err) {
        console.error('Erro ao criar usuário padrão:', err);
    }
}

// ===== MIDDLEWARES DE AUTENTICAÇÃO =====

function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ erro: 'Token inválido' });
    }
}

// ===== ROTAS DE AUTENTICAÇÃO =====

// Login
app.post('/api/auth/login',
    body('matricula').trim().notEmpty(),
    body('senha').notEmpty(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ erros: errors.array() });
            }

            const { matricula, senha } = req.body;

            // Buscar usuário
            const usuario = await dbGet(
                'SELECT * FROM usuarios WHERE matricula = ? AND ativo = 1',
                [matricula.toUpperCase()]
            );

            if (!usuario) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            // Verificar senha
            const senhaValida = await bcryptjs.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Credenciais inválidas' });
            }

            // Gerar token
            const token = jwt.sign(
                {
                    id: usuario.id,
                    matricula: usuario.matricula,
                    nome: usuario.nome,
                    empresa: usuario.empresa,
                    admin: usuario.admin
                },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            // Registrar log
            await dbRun(
                'INSERT INTO logs (usuario_id, acao, ip_address) VALUES (?, ?, ?)',
                [usuario.id, 'LOGIN', req.ip]
            );

            res.json({
                sucesso: true,
                token,
                usuario: {
                    id: usuario.id,
                    matricula: usuario.matricula,
                    nome: usuario.nome,
                    empresa: usuario.empresa,
                    admin: usuario.admin
                }
            });
        } catch (err) {
            console.error('Erro no login:', err);
            res.status(500).json({ erro: 'Erro ao fazer login' });
        }
    }
);

// Registrar novo usuário (apenas para empresas autorizadas)
app.post('/api/auth/registrar',
    body('matricula').trim().notEmpty(),
    body('senha').isLength({ min: 6 }),
    body('nome').trim().notEmpty(),
    body('empresa').trim().notEmpty(),
    body('email').isEmail(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ erros: errors.array() });
            }

            const { matricula, senha, nome, empresa, email, telefone } = req.body;

            // Verificar se usuário já existe
            const usuarioExistente = await dbGet(
                'SELECT id FROM usuarios WHERE matricula = ?',
                [matricula.toUpperCase()]
            );

            if (usuarioExistente) {
                return res.status(400).json({ erro: 'Matrícula já cadastrada' });
            }

            // Hash da senha
            const senhaHash = await bcryptjs.hash(senha, 10);

            // Inserir novo usuário
            const resultado = await dbRun(
                `INSERT INTO usuarios (matricula, senha, nome, empresa, email, telefone)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [matricula.toUpperCase(), senhaHash, nome, empresa, email, telefone]
            );

            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário registrado com sucesso',
                usuarioId: resultado.lastID
            });
        } catch (err) {
            console.error('Erro ao registrar:', err);
            res.status(500).json({ erro: 'Erro ao registrar usuário' });
        }
    }
);

// ===== ROTAS DE INSCRIÇÕES =====

// Criar inscrição (formulário)
app.post('/api/inscricoes',
    verificarToken,
    body('tipo_servico').notEmpty(),
    body('dados_formulario').isObject(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ erros: errors.array() });
            }

            const { tipo_servico, dados_formulario } = req.body;
            const usuario_id = req.usuario.id;

            const resultado = await dbRun(
                `INSERT INTO inscricoes (usuario_id, tipo_servico, dados_formulario)
                 VALUES (?, ?, ?)`,
                [usuario_id, tipo_servico, JSON.stringify(dados_formulario)]
            );

            // Registrar log
            await dbRun(
                'INSERT INTO logs (usuario_id, acao, detalhes) VALUES (?, ?, ?)',
                [usuario_id, 'INSCRIÇÃO', `Inscrição em ${tipo_servico}`]
            );

            res.status(201).json({
                sucesso: true,
                mensagem: 'Inscrição realizada com sucesso',
                inscricaoId: resultado.lastID
            });
        } catch (err) {
            console.error('Erro ao criar inscrição:', err);
            res.status(500).json({ erro: 'Erro ao criar inscrição' });
        }
    }
);

// Listar inscrições do usuário
app.get('/api/inscricoes', verificarToken, async (req, res) => {
    try {
        const usuario_id = req.usuario.id;

        const inscricoes = await dbAll(
            `SELECT * FROM inscricoes WHERE usuario_id = ? ORDER BY criado_em DESC`,
            [usuario_id]
        );

        // Parsear dados_formulario
        const inscricoesComDados = inscricoes.map(i => ({
            ...i,
            dados_formulario: JSON.parse(i.dados_formulario)
        }));

        res.json({
            sucesso: true,
            total: inscricoes.length,
            inscricoes: inscricoesComDados
        });
    } catch (err) {
        console.error('Erro ao listar inscrições:', err);
        res.status(500).json({ erro: 'Erro ao listar inscrições' });
    }
});

// ===== ROTAS DE USUÁRIOS (ADMIN) =====

// Listar todos os usuários (apenas admin)
app.get('/api/usuarios', verificarToken, async (req, res) => {
    try {
        if (!req.usuario.admin) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }

        const usuarios = await dbAll(
            `SELECT id, matricula, nome, empresa, email, ativo, criado_em FROM usuarios`
        );

        res.json({
            sucesso: true,
            total: usuarios.length,
            usuarios
        });
    } catch (err) {
        console.error('Erro ao listar usuários:', err);
        res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
});

// Desativar usuário (apenas admin)
app.patch('/api/usuarios/:id/desativar', verificarToken, async (req, res) => {
    try {
        if (!req.usuario.admin) {
            return res.status(403).json({ erro: 'Acesso negado' });
        }

        const { id } = req.params;

        await dbRun(
            'UPDATE usuarios SET ativo = 0 WHERE id = ?',
            [id]
        );

        await dbRun(
            'INSERT INTO logs (usuario_id, acao, detalhes) VALUES (?, ?, ?)',
            [req.usuario.id, 'DESATIVAR_USUARIO', `Usuário ID: ${id}`]
        );

        res.json({ sucesso: true, mensagem: 'Usuário desativado' });
    } catch (err) {
        console.error('Erro ao desativar usuário:', err);
        res.status(500).json({ erro: 'Erro ao desativar usuário' });
    }
});

// ===== ROTAS DE HEALTH CHECK =====

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ===== TRATAMENTO DE ERROS =====

app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

// ===== INICIAR SERVIDOR =====

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🌩️  IntegraMente Backend Server      ║
    ║   ✅ Servidor rodando em porta ${PORT}  ║
    ║   📡 URL: http://localhost:${PORT}     ║
    ╚════════════════════════════════════════╝
    `);
});

module.exports = app;
