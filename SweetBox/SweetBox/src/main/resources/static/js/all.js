// ==========================================
// all.js - Funções Globais do Sistema
// ==========================================

// Inicializa os ícones do Lucide em todas as telas
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});


// ==========================================
// Funções de visibilidade de senha (Otimizado)
// ==========================================

function configurarToggleSenha(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);

    if (btn && input) {
        btn.addEventListener('click', function() {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';

            const icon = btn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                lucide.createIcons();
            }
        });
    }
}

// Inicializa tudo quando a página estiver carregada
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Agora basta chamar essa função para cada campo de senha que você tiver
    configurarToggleSenha('togglePassword', 'senha');
    configurarToggleSenha('toggleConfirmPassword', 'confirmarSenha');
});

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