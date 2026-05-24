// ==========================================
// all.js - Funções Globais do Sistema
// ==========================================

// Inicializa os ícones do Lucide em todas as telas
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});


// Funções do Olho da Senha (Lógica Limpa)
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        const senhaInput = document.getElementById('senha');

        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            // Desenha um ícone novo de "olho fechado" dentro do botão
            this.innerHTML = '<i data-lucide="eye-off" class="icon"></i>';
        } else {
            senhaInput.type = 'password';
            // Desenha o "olho normal" dentro do botão
            this.innerHTML = '<i data-lucide="eye" class="icon"></i>';
        }
        // Pede ao Lucide para transformar a tag <i> que acabamos de colocar na imagem final
        lucide.createIcons();
    });
}

// Funções do Olho da Confirmação de Senha (Lógica Limpa)
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function() {
        const confirmarSenhaInput = document.getElementById('confirmarSenha');

        if (confirmarSenhaInput.type === 'password') {
            confirmarSenhaInput.type = 'text';
            // Desenha um ícone novo de "olho fechado" dentro do botão
            this.innerHTML = '<i data-lucide="eye-off" class="icon"></i>';
        } else {
            confirmarSenhaInput.type = 'password';
            // Desenha o "olho normal" dentro do botão
            this.innerHTML = '<i data-lucide="eye" class="icon"></i>';
        }

        // Pede ao Lucide para transformar a tag <i> que acabamos de colocar na imagem final
        lucide.createIcons();
    });
}

// Muda cor dos botões de cargo no Cadastro
function marcarBotaoJava(tipo) {
    const btnGestor = document.getElementById('btnGestor');
    const btnFuncionario = document.getElementById('btnFuncionario');

    if (btnGestor && btnFuncionario) {
        if (tipo === 'gestor') {
            btnGestor.className = 'btn btn-primary';
            btnFuncionario.className = 'btn btn-outline';
        } else {
            btnGestor.className = 'btn btn-outline';
            btnFuncionario.className = 'btn btn-primary';
        }
    }
}