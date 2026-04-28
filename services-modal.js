// Script de Modais e Gerenciamento de Formulários - IntegraMente
console.log('services-modal.js carregado com sucesso!');

// Banco de frases motivacionais
const frasersMotive = [
    {
        texto: "Cada passo em direção à saúde mental é um ato de coragem. Estamos aqui para apoiá-lo!",
        autor: "IntegraMente"
    },
    {
        texto: "Sua saúde mental é tão importante quanto sua saúde física. Cuide-se com amor.",
        autor: "IntegraMente"
    },
    {
        texto: "Não é fraqueza pedir ajuda. É força reconhecer que você merece cuidados.",
        autor: "IntegraMente"
    },
    {
        texto: "Você não está sozinho nesta jornada. A vida fica mais leve quando compartilhamos os fardos.",
        autor: "IntegraMente"
    },
    {
        texto: "Cada dia é uma nova oportunidade para cultivar paz mental e felicidade genuína.",
        autor: "IntegraMente"
    },
    {
        texto: "Sua jornada é única. Celebre cada avanço, por menor que pareça.",
        autor: "IntegraMente"
    },
    {
        texto: "O autocuidado não é luxo, é necessidade. Você merece se sentir bem.",
        autor: "IntegraMente"
    },
    {
        texto: "Respirar fundo, acreditar em si mesmo e seguir em frente. Você consegue!",
        autor: "IntegraMente"
    },
    {
        texto: "A mente é poderosa. Cuide dela com meditação, gratidão e amor próprio.",
        autor: "IntegraMente"
    },
    {
        texto: "Você é mais forte do que pensa. Cada dia é prova disso.",
        autor: "IntegraMente"
    },
    {
        texto: "Transformar vidas começa transformando a própria relação com você mesmo.",
        autor: "IntegraMente"
    },
    {
        texto: "Bem-vindo a um espaço seguro onde sua saúde mental é prioridade.",
        autor: "IntegraMente"
    }
];

// Função para obter uma frase aleatória
function getRandomMotivationalPhrase() {
    return frasersMotive[Math.floor(Math.random() * frasersMotive.length)];
}

// Gerenciamento de Modais
function openModal(modalId) {
    console.log('Abrindo modal:', modalId);
    const modal = document.getElementById(modalId);
    console.log('Modal encontrado:', modal);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Resetar scroll do modal
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }, 50);
    }
}

function closeModal(modalId) {
    console.log('Fechando modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
}

// Fechar modal ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Gerenciamento de Formulários
document.addEventListener('DOMContentLoaded', function() {
    // Formulário Consultas Online
    const formConsulta = document.querySelector('#modal-consulta form');
    if (formConsulta) {
        formConsulta.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Consulta Online', {
                nome: document.getElementById('nome-consulta').value,
                email: document.getElementById('email-consulta').value,
                telefone: document.getElementById('telefone-consulta').value,
                horario: document.getElementById('horario-consulta').value,
                descricao: document.getElementById('descricao-consulta').value
            });
        });
    }

    // Formulário Meditação
    const formMeditacao = document.querySelector('#modal-meditacao form');
    if (formMeditacao) {
        formMeditacao.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Programas de Meditação', {
                nome: document.getElementById('nome-meditacao').value,
                email: document.getElementById('email-meditacao').value,
                telefone: document.getElementById('telefone-meditacao').value,
                nivel: document.getElementById('nivel-meditacao').value,
                aula: document.getElementById('aula-meditacao').value
            });
        });
    }

    // Formulário Terapia em Grupo
    const formGrupo = document.querySelector('#modal-grupo form');
    if (formGrupo) {
        formGrupo.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Terapia em Grupo', {
                nome: document.getElementById('nome-grupo').value,
                email: document.getElementById('email-grupo').value,
                telefone: document.getElementById('telefone-grupo').value,
                tema: document.getElementById('tema-grupo').value
            });
        });
    }

    // Formulário Cursos Online
    const formCursos = document.querySelector('#modal-cursos form');
    if (formCursos) {
        formCursos.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Cursos Online', {
                nome: document.getElementById('nome-cursos').value,
                email: document.getElementById('email-cursos').value,
                telefone: document.getElementById('telefone-cursos').value,
                curso: document.getElementById('curso-interesse').value
            });
        });
    }

    // Formulário Coaching
    const formCoaching = document.querySelector('#modal-coaching form');
    if (formCoaching) {
        formCoaching.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Coaching de Vida', {
                nome: document.getElementById('nome-coaching').value,
                email: document.getElementById('email-coaching').value,
                telefone: document.getElementById('telefone-coaching').value,
                objetivos: document.getElementById('objetivos-coaching').value,
                experiencia: document.getElementById('experiencia-coaching').value
            });
        });
    }

    // Formulário Saúde Mental no Trabalho
    const formTrabalho = document.querySelector('#modal-saude-trabalho form');
    if (formTrabalho) {
        formTrabalho.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Saúde Mental no Trabalho', {
                nome: document.getElementById('nome-trabalho').value,
                email: document.getElementById('email-trabalho').value,
                telefone: document.getElementById('empresa-trabalho').value,
                cargo: document.getElementById('cargo-trabalho').value,
                interesse: document.getElementById('interesse-trabalho').value
            });
        });
    }

    // Formulário Conteúdos Informativos
    const formConteudos = document.querySelector('#modal-conteudos form');
    if (formConteudos) {
        formConteudos.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Conteúdos Informativos', {
                nome: document.getElementById('nome-conteudos').value,
                email: document.getElementById('email-conteudos').value,
                telefone: '',
                interesse: document.getElementById('interesse-conteudo').value,
                frequencia: document.getElementById('frequencia-conteudo').value
            });
        });
    }

    // Formulário Produtividade com Equilíbrio
    const formProdutividade = document.querySelector('#modal-produtividade form');
    if (formProdutividade) {
        formProdutividade.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Produtividade com Equilíbrio', {
                nome: document.getElementById('nome-produtividade').value,
                email: document.getElementById('email-produtividade').value,
                telefone: '',
                profissao: document.getElementById('profissao-produtividade').value,
                desafio: document.getElementById('desafio-produtividade').value
            });
        });
    }

    // Formulário Bem-estar Emocional
    const formBemestar = document.querySelector('#modal-bemestar form');
    if (formBemestar) {
        formBemestar.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Bem-estar Emocional', {
                nome: document.getElementById('nome-bemestar').value,
                email: document.getElementById('email-bemestar').value,
                telefone: document.getElementById('telefone-bemestar').value,
                necessidade: document.getElementById('necessidade-bemestar').value
            });
        });
    }

    // Formulário Plataforma Digital
    const formPlataforma = document.querySelector('#modal-plataforma form');
    if (formPlataforma) {
        formPlataforma.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit('Plataforma Digital', {
                nome: document.getElementById('nome-plataforma').value,
                email: document.getElementById('email-plataforma').value,
                telefone: document.getElementById('telefone-plataforma').value,
                dispositivo: document.getElementById('dispositivo-plataforma').value
            });
        });
    }
});

// Função para lidar com submit do formulário
function handleFormSubmit(serviceName, formData) {
    // Validação básica
    if (!formData.nome || !formData.email || !formData.telefone) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Por favor, digite um email válido!');
        return;
    }

    // Aqui você pode enviar os dados para um servidor
    console.log('Formulário submetido para:', serviceName);
    console.log('Dados:', formData);

    // Mostrar mensagem de sucesso
    showSuccessMessage(serviceName);

    // Fechar modal após 1 segundo
    setTimeout(() => {
        closeModal(getModalIdByServiceName(serviceName));
    }, 1000);

    // Limpar formulário (opcional)
    // resetForm();
}

// Função para obter ID do modal pelo nome do serviço
function getModalIdByServiceName(serviceName) {
    const map = {
        'Consulta Online': 'modal-consulta',
        'Programas de Meditação': 'modal-meditacao',
        'Terapia em Grupo': 'modal-grupo',
        'Cursos Online': 'modal-cursos',
        'Coaching de Vida': 'modal-coaching',
        'Saúde Mental no Trabalho': 'modal-saude-trabalho',
        'Conteúdos Informativos': 'modal-conteudos',
        'Produtividade com Equilíbrio': 'modal-produtividade',
        'Bem-estar Emocional': 'modal-bemestar',
        'Plataforma Digital': 'modal-plataforma'
    };
    return map[serviceName] || '';
}

// Função para mostrar mensagem de sucesso com frase motivacional
function showSuccessMessage(serviceName) {
    // Obter frase aleatória
    const phrase = getRandomMotivationalPhrase();

    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    
    // Criar card com frase motivacional
    const card = document.createElement('div');
    card.className = 'motivational-card';
    
    card.innerHTML = `
        <div class="motivational-header">
            <div class="success-icon">✓</div>
            <h2>Parabéns!</h2>
        </div>
        
        <div class="motivational-content">
            <p class="service-text">Você se inscreveu em <strong>${serviceName}</strong></p>
            
            <div class="phrase-box">
                <p class="phrase-text">"${phrase.texto}"</p>
                <p class="phrase-author">— ${phrase.autor}</p>
            </div>
            
            <p class="confirmation-text">Verifique seu email para confirmação e primeiros passos.</p>
        </div>
        
        <div class="motivational-footer">
            <button onclick="closeSuccessCard()" class="btn-ok">Entendido!</button>
        </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Mostrar o card com animação
    setTimeout(() => {
        overlay.classList.add('active');
    }, 50);
}

// Função para fechar o card de sucesso
function closeSuccessCard() {
    const overlay = document.querySelector('.success-overlay.active');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 400);
    }
}

// Fechar card ao clicar fora
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('success-overlay')) {
        closeSuccessCard();
    }
});

// Adicionar animações ao CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes scaleIn {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
