// ALTERNAR ENTRE LOGIN E CADASTRO 
function toggleAuthMode() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm && registerForm) {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    }
}

// (localStorage)

function fazerLogin() {
    localStorage.setItem('isLoggedIn', 'true'); 
    alert("Login realizado com sucesso!");

    window.location.href = '../index.html'; 
}

function fazerLogout() {
    localStorage.removeItem('isLoggedIn'); 
    alert("Sessão encerrada com sucesso.");

    window.location.reload(); 
}

// CONTROLE DO MODAL (HUD DE CRIAR EVENTO)

function tentarCriarEvento() {
    const logado = localStorage.getItem('isLoggedIn');
    
    if (logado === 'true') {
        const modal = document.getElementById('create-event-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    } else {
        alert("Você precisa estar cadastrado e logado para criar um evento no QUAL A BOA!");
        window.location.href = './HTML/login.html';
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// 4. VALIDAÇÃO DE IDADE NO CADASTRO (+18)

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
            window.location.href = '../index.html'; 
        }
    });
}

// PUBLICAR E PERSISTIR EVENTOS

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

    if (imgInput.files && imgInput.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Image = e.target.result;
            salvarEventoNoStorage(nome, data, local, desc, base64Image);
        };
        
        reader.readAsDataURL(imgInput.files[0]);
    } else {
        salvarEventoNoStorage(nome, data, local, desc, "https://via.placeholder.com/300x150?text=Sem+Imagem");
    }
}

// Função para salvar no LocalStorage
function salvarEventoNoStorage(nome, data, local, desc, imagem) {
    const novosEventos = JSON.parse(localStorage.getItem('meusEventos')) || [];
    
    const novoEvento = {
        id: Date.now(), 
        nome,
        data,
        local,
        desc,
        imagem
    };

    novosEventos.push(novoEvento);
    localStorage.setItem('meusEventos', JSON.stringify(novosEventos));

    fecharModal('create-event-modal');
    document.getElementById('novo-evento-nome').value = '';
    document.getElementById('novo-evento-data').value = '';
    document.getElementById('novo-evento-local').value = '';
    document.getElementById('novo-evento-desc').value = '';
    
    alert("Evento publicado com sucesso!");
    
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
                    <h3 class="event-title" >${evento.nome}</h3>
                    <p class="event-desc">${dataFormatada} - ${evento.local}</p>
                    
                    <button class="btn-orange" onclick="verDetalhes('${evento.nome}', '${evento.data}', '${evento.local}', '${evento.imagem}', '${evento.desc}')">Ver Detalhes</button>
                    
                    <button class="btn-outline" onclick="favoritarEvento('${evento.nome}', '${evento.data}')">⭐ Salvar</button>
                </div>
            `;
            eventGrid.prepend(novoCard);
        }
    });
}

// BARRA DE PESQUISA

function filtrarEventos() {

    const input = document.querySelector('.search-bar');
    const filtro = input.value.toLowerCase();

    const eventos = document.querySelectorAll('.event-card');

    eventos.forEach(evento => {
        const titulo = evento.querySelector('.event-title').textContent.toLowerCase();
        const descricao = evento.querySelector('.event-desc').textContent.toLowerCase();

        if (titulo.includes(filtro) || descricao.includes(filtro)) {
            evento.style.display = "";
        } else {
            evento.style.display = "none";
        }
    });
}

// FAVORITOS E INICIALIZAÇÃO

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

document.addEventListener('DOMContentLoaded', () => {

    renderizarEventosNoFeed();
    
    if (typeof renderizarCalendario === "function") {
        renderizarCalendario();
    }
});


function renderizarCalendario() {
    const container = document.getElementById('calendario-container');
    
    if (!container) return;

    // Busca os eventos salvos no LocalStorage
    const eventosSalvos = JSON.parse(localStorage.getItem('eventosFavoritos')) || [];

    // Transforma os seus dados para o formato FullCalendar 
    const eventosProCalendario = eventosSalvos.map(evento => {
        return {
            title: evento.nome,    
            start: evento.data,    
            color: '#FF7F50'       
        };
    });

    const calendar = new FullCalendar.Calendar(container, {
        initialView: 'dayGridMonth', 
        locale: 'pt-br',             
        
        // Define o que aparece no cabeçalho do calendário
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek' 
        },
        
        events: eventosProCalendario
    });

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
    

    localStorage.setItem('eventoVisualizar', JSON.stringify(eventoClicado));
    
    window.location.href = './HTML/evento.html';
}

// VERIFICAÇÃO DE ESTADO NA PÁGINA DE LOGIN

document.addEventListener("DOMContentLoaded", function() {
    // Busca as divs que em login.html
    const authFormsContainer = document.getElementById('auth-forms-container');
    const loggedInContainer = document.getElementById('logged-in-container');

    if (authFormsContainer && loggedInContainer) {
        const isLogado = localStorage.getItem('isLoggedIn');

        if (isLogado === 'true') {

            authFormsContainer.classList.add('hidden');
            loggedInContainer.classList.remove('hidden');
        } else {

            authFormsContainer.classList.remove('hidden');
            loggedInContainer.classList.add('hidden');
        }
    }
});