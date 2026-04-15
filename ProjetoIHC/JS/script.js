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

// Função acionada ao clicar em "Entrar" no login.html
function fazerLogin() {
    // Salva na memória do navegador que o usuário logou
    localStorage.setItem('isLoggedIn', 'true'); 
    alert("Login realizado com sucesso!");
    window.location.href = 'index.html'; // Redireciona para o feed
}

// Função acionada ao clicar em "Sair" no Menu de navegação
function fazerLogout() {
    // Apaga a memória de login
    localStorage.removeItem('isLoggedIn'); 
    window.location.href = 'login.html'; // Volta para o login
}

// ==========================================
// 3. CONTROLE DO MODAL (HUD DE CRIAR EVENTO)
// ==========================================

// Função que verifica se o usuário está logado antes de deixar criar evento
function tentarCriarEvento() {
    const logado = localStorage.getItem('isLoggedIn');
    
    if (logado === 'true') {
        // Se estiver logado, abre o modal (HUD)
        const modal = document.getElementById('create-event-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    } else {
        // Se não estiver logado, avisa e manda pro login
        alert("Você precisa estar cadastrado e logado para criar um evento no QUAL A BOA!");
        window.location.href = 'login.html';
    }
}

// Função para fechar o Modal (HUD) quando clicar no "X"
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

// Só executa se o formulário existir na página atual
if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a página de recarregar sozinha

        const dobInput = document.getElementById('dob').value;
        if (!dobInput) return;

        const birthDate = new Date(dobInput);
        const today = new Date();
        
        // Calcula a idade
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Ajusta se o aniversário ainda não chegou neste ano
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Verifica se é maior de idade
        if (age < 18) {
            alert("Você precisa ter pelo menos 18 anos para criar uma conta no QUAL A BOA.");
        } else {
            alert("Conta criada com sucesso! Bem-vindo!");
            // Se cadastrou com sucesso, já consideramos logado
            localStorage.setItem('isLoggedIn', 'true'); 
            window.location.href = 'index.html'; // Redireciona para o feed
        }
    });
}