// ==========================================
// all.js - Funções Globais do Sistema
// ==========================================

// Inicializa os ícones do Lucide em todas as telas
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Funções do Olho da Senha (Usadas no login e cadastro)
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        const senhaInput = document.getElementById('senha');
        const eyeIcon = document.getElementById('eyeIcon');
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            eyeIcon.setAttribute('data-lucide', 'eye-off');
        } else {
            senhaInput.type = 'password';
            eyeIcon.setAttribute('data-lucide', 'eye');
        }
        lucide.createIcons();
    });
}

const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function() {
        const confirmarSenhaInput = document.getElementById('confirmarSenha');
        const confirmEyeIcon = document.getElementById('confirmEyeIcon');
        confirmarSenhaInput.type = confirmarSenhaInput.type === 'password' ? 'text' : 'password';
        confirmEyeIcon.setAttribute('data-lucide', confirmarSenhaInput.type === 'password' ? 'eye' : 'eye-off');
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