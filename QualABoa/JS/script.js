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
    // Como o botão sair está no index (raiz), ele precisa entrar na pasta HTML
    window.location.href = './HTML/login.html'; 
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
// 5. PUBLICAR NOVO EVENTO
// ==========================================

// Localize a função publicarEvento no seu script.js e substitua por esta:

function publicarEvento() {
    const nome = document.getElementById('novo-evento-nome').value;
    const data = document.getElementById('novo-evento-data').value;
    const local = document.getElementById('novo-evento-local').value;
    const imgInput = document.getElementById('novo-evento-img'); // Captura o input de arquivo
    
    if (!nome || !data || !local) {
        alert("Por favor, preencha o nome, data e local do evento!");
        return;
    }

    
    let imagemSrc = ""; 
    if (imgInput.files && imgInput.files[0]) {
        // Cria um link temporário para a imagem que o usuário escolheu
        imagemSrc = URL.createObjectURL(imgInput.files[0]);
    } else {
        // Imagem padrão caso o usuário não escolha nenhuma
        imagemSrc = "https://via.placeholder.com/300x150?text=Sem+Imagem"; 
    }

    const eventGrid = document.querySelector('.event-grid');
    const novoCard = document.createElement('div');
    novoCard.classList.add('event-card');

    const dataFormatada = data.split('-').reverse().join('/');

    novoCard.innerHTML = `
        <div class="event-img">
            <img src="${imagemSrc}" alt="${nome}" style="width: 100%; height: 150px; object-fit: cover;">
        </div>
        <div class="event-info">
            <h3>${nome}</h3>
            <p class="event-desc">${dataFormatada} - ${local}</p>
            <button class="btn-orange" onclick="window.location.href='evento.html'">Ver Detalhes</button>
            <button class="btn-outline" onclick="favoritarEvento('${nome}', '${data}')">⭐ Salvar</button>
        </div>
    `;

    eventGrid.prepend(novoCard);

    // Limpar campos
    document.getElementById('novo-evento-nome').value = '';
    document.getElementById('novo-evento-data').value = '';
    document.getElementById('novo-evento-local').value = '';
    document.getElementById('novo-evento-desc').value = '';
    imgInput.value = ''; // Limpa o campo de arquivo
    
    fecharModal('create-event-modal');
    alert("Evento publicado com sucesso!");
}

// ==========================================
// 6. SISTEMA DE FAVORITAR E CALENDÁRIO
// ==========================================

// Função acionada pelo botão "⭐ Salvar"
function favoritarEvento(nome, dataISO) {
    // Busca os eventos já salvos ou cria uma lista vazia
    let eventosSalvos = JSON.parse(localStorage.getItem('eventosFavoritos')) || [];

    // Verifica se já salvou antes
    const jaExiste = eventosSalvos.find(evento => evento.nome === nome && evento.data === dataISO);

    if (jaExiste) {
        alert(`O evento "${nome}" já está no seu calendário!`);
    } else {
        // Adiciona na lista e salva no localStorage
        eventosSalvos.push({ nome: nome, data: dataISO });
        localStorage.setItem('eventosFavoritos', JSON.stringify(eventosSalvos));
        alert(`Evento "${nome}" adicionado ao seu calendário!`);
    }
}
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

// Faz o calendário ser desenhado assim que a página carrega
document.addEventListener('DOMContentLoaded', renderizarCalendario);