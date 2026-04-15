// ==========================================
// QUAL A BOA - Lógica do Front-end
// ==========================================

// 1. ALTERNAR ENTRE LOGIN E CADASTRO (na página login.html)
function toggleAuthMode() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    }
}

// ==========================================
// 2. SISTEMA DE LOGIN SIMULADO (localStorage)
// ==========================================

function fazerLogin() {
    localStorage.setItem('isLoggedIn', 'true'); 
    alert("Login realizado com sucesso!");
    // Como o login está na pasta HTML, precisa voltar uma pasta (../) para achar o index
    window.location.href = '../index.html'; 
}

function fazerLogout() {
    localStorage.removeItem('isLoggedIn'); 
    alert("Sessão encerrada com sucesso.");

    // Recarrega a página atual para limpar o estado e mostrar a tela certa
    window.location.reload(); 
}

// ==========================================
// 3. CONTROLE DO MODAL (HUD DE CRIAR EVENTO)
// ==========================================

function tentarCriarEvento() {
    const logado = localStorage.getItem('isLoggedIn');
    
    if (logado === 'true') {
        const modal = document.getElementById('create-event-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    } else {
        alert("Você precisa estar cadastrado e logado para criar um evento no QUAL A BOA!");
        // Entrando na pasta HTML para achar o login
        window.location.href = './HTML/login.html';
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ==========================================
// 4. VALIDAÇÃO DE IDADE NO CADASTRO (+18)
// ==========================================

const signupForm = document.getElementById('signupForm');

if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const dobInput = document.getElementById('dob').value;
        if (!dobInput) return;

        const birthDate = new Date(dobInput);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            alert("Você precisa ter pelo menos 18 anos para criar uma conta no QUAL A BOA.");
        } else {
            alert("Conta criada com sucesso! Bem-vindo!");
            localStorage.setItem('isLoggedIn', 'true'); 
            // Voltando uma pasta para achar o index
            window.location.href = '../index.html'; 
        }
    });
}

// ==========================================
// 5. PUBLICAR E PERSISTIR EVENTOS
// ==========================================

// Função principal para criar o evento
function publicarEvento() {
    const nome = document.getElementById('novo-evento-nome').value;
    const data = document.getElementById('novo-evento-data').value;
    const local = document.getElementById('novo-evento-local').value;
    const desc = document.getElementById('novo-evento-desc').value;
    const imgInput = document.getElementById('novo-evento-img');
    
    if (!nome || !data || !local) {
        alert("Por favor, preencha os campos obrigatórios!");
        return;
    }

    // Se o usuário selecionou uma imagem, vamos converter para texto (Base64)
    if (imgInput.files && imgInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Image = e.target.result;
            salvarEventoNoStorage(nome, data, local, desc, base64Image);
        };
        
        reader.readAsDataURL(imgInput.files[0]);
    } else {
        // Se não tiver imagem, usa uma padrão
        salvarEventoNoStorage(nome, data, local, desc, "https://via.placeholder.com/300x150?text=Sem+Imagem");
    }
}

// Função para salvar no LocalStorage
function salvarEventoNoStorage(nome, data, local, desc, imagem) {
    const novosEventos = JSON.parse(localStorage.getItem('meusEventos')) || [];
    
    const novoEvento = {
        id: Date.now(), // ID único baseado no tempo
        nome,
        data,
        local,
        desc,
        imagem
    };

    novosEventos.push(novoEvento);
    localStorage.setItem('meusEventos', JSON.stringify(novosEventos));

    // Limpar campos e fechar modal
    fecharModal('create-event-modal');
    document.getElementById('novo-evento-nome').value = '';
    document.getElementById('novo-evento-data').value = '';
    document.getElementById('novo-evento-local').value = '';
    document.getElementById('novo-evento-desc').value = '';
    
    alert("Evento publicado com sucesso!");
    
    // Recarrega o feed para mostrar o novo evento
    renderizarEventosNoFeed();
}

// Função para desenhar os eventos salvos na tela
function renderizarEventosNoFeed() {
    const eventGrid = document.querySelector('.event-grid');
    if (!eventGrid) return;

    const eventosSalvos = JSON.parse(localStorage.getItem('meusEventos')) || [];

    eventosSalvos.forEach(evento => {
        if (!document.getElementById(`card-${evento.id}`)) {
            const novoCard = document.createElement('div');
            novoCard.id = `card-${evento.id}`;
            novoCard.classList.add('event-card');

            const dataFormatada = evento.data.split('-').reverse().join('/');

            novoCard.innerHTML = `
                <div class="event-img">
                    <img src="${evento.imagem}" alt="${evento.nome}" style="width: 100%; height: 150px; object-fit: cover;">
                </div>
                <div class="event-info">
                    <h3>${evento.nome}</h3>
                    <p class="event-desc">${dataFormatada} - ${evento.local}</p>
                    
                    <button class="btn-orange" onclick="verDetalhes('${evento.nome}', '${evento.data}', '${evento.local}', '${evento.imagem}', '${evento.desc}')">Ver Detalhes</button>
                    
                    <button class="btn-outline" onclick="favoritarEvento('${evento.nome}', '${evento.data}')">⭐ Salvar</button>
                </div>
            `;
            eventGrid.prepend(novoCard);
        }
    });
}

// ==========================================
// 6. FAVORITOS E INICIALIZAÇÃO
// ==========================================

function favoritarEvento(nome, dataISO) {
    let eventosSalvos = JSON.parse(localStorage.getItem('eventosFavoritos')) || [];
    const jaExiste = eventosSalvos.find(evento => evento.nome === nome && evento.data === dataISO);

    if (jaExiste) {
        alert(`O evento "${nome}" já está no seu calendário!`);
    } else {
        eventosSalvos.push({ nome: nome, data: dataISO });
        localStorage.setItem('eventosFavoritos', JSON.stringify(eventosSalvos));
        alert(`Evento "${nome}" adicionado ao seu calendário!`);
    }
}

// Inicialização automática ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
    // Se estiver no Feed, carrega os cards
    renderizarEventosNoFeed();
    
    // Se estiver no Calendário, renderiza o calendário (sua função existente)
    if (typeof renderizarCalendario === "function") {
        renderizarCalendario();
    }
});

// Função que desenha o calendário usando a biblioteca FullCalendar
function renderizarCalendario() {
    const container = document.getElementById('calendario-container');
    
    // Se a div do calendário não existir na página, cancela a função
    if (!container) return;

    // 1. Busca os eventos salvos no LocalStorage
    const eventosSalvos = JSON.parse(localStorage.getItem('eventosFavoritos')) || [];

    // 2. Transforma os seus dados para o formato que o FullCalendar exige
    const eventosProCalendario = eventosSalvos.map(evento => {
        return {
            title: evento.nome,    // O nome que vai aparecer no bloquinho
            start: evento.data,    // A data (formato YYYY-MM-DD)
            color: '#FF7F50'       // Cor laranja do seu projeto
        };
    });

    // 3. Inicializa o FullCalendar
    const calendar = new FullCalendar.Calendar(container, {
        initialView: 'dayGridMonth', // Começa mostrando o mês
        locale: 'pt-br',             // Traduz os dias e botões para Português
        
        // Define o que aparece no cabeçalho do calendário
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek' // Botões para ver Mês ou Semana
        },
        
        // Joga a lista de eventos convertida aqui
        events: eventosProCalendario
    });

    // 4. Manda desenhar na tela
    calendar.render();
}

// Função para salvar o evento clicado e abrir a página de detalhes
function verDetalhes(nome, data, local, imagem, desc) {
    const eventoClicado = {
        nome: nome,
        data: data,
        local: local,
        imagem: imagem,
        desc: desc || "Sem descrição disponível."
    };
    
    // Salva o evento atual para a outra página ler
    localStorage.setItem('eventoVisualizar', JSON.stringify(eventoClicado));
    
    // Redireciona para a página de detalhes
    window.location.href = './HTML/evento.html';
}

// ==========================================
// 6. VERIFICAÇÃO DE ESTADO NA PÁGINA DE LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    // Busca as divs que criamos no login.html
    const authFormsContainer = document.getElementById('auth-forms-container');
    const loggedInContainer = document.getElementById('logged-in-container');

    // Só executa essa lógica se estivermos na página de login (onde essas divs existem)
    if (authFormsContainer && loggedInContainer) {
        const isLogado = localStorage.getItem('isLoggedIn');

        if (isLogado === 'true') {
            // Se estiver logado: esconde formulários, mostra a tela de terminar sessão
            authFormsContainer.classList.add('hidden');
            loggedInContainer.classList.remove('hidden');
        } else {
            // Se NÃO estiver logado: garante que a tela de terminar sessão esteja oculta
            authFormsContainer.classList.remove('hidden');
            loggedInContainer.classList.add('hidden');
        }
    }
});