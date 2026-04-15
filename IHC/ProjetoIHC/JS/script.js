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

    // Lógica para a imagem
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
            <button class="btn-outline">⭐ Salvar</button>
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