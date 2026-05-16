// Inicializar usuários padrão
function inicializarUsuarios() {
    const usuarios = localStorage.getItem('sweetbox_usuarios');
    if (!usuarios) {
        const usuariosPadrao = [
            { id: '1', nome: 'Gestor SweetBox', email: 'gestor@sweetbox.com', senha: 'SweetBox@2024', tipo: 'gestor' },
            { id: '2', nome: 'Funcionário SweetBox', email: 'funcionario@sweetbox.com', senha: 'SweetBox@2024', tipo: 'funcionario' }
        ];
        localStorage.setItem('sweetbox_usuarios', JSON.stringify(usuariosPadrao));
    }
}

function login(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem('sweetbox_usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (usuario) {
        const { senha: _, ...usuarioSemSenha } = usuario;
        localStorage.setItem('sweetbox_usuario_logado', JSON.stringify(usuarioSemSenha));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('sweetbox_usuario_logado');
    window.location.href = 'index.html';
}

function getUsuarioLogado() {
    const usuario = localStorage.getItem('sweetbox_usuario_logado');
    return usuario ? JSON.parse(usuario) : null;
}

function verificarAutenticacao() {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        window.location.href = 'index.html';
        return null;
    }
    return usuario;
}

function verificarPermissaoGestor() {
    const usuario = verificarAutenticacao();
    if (usuario && usuario.tipo !== 'gestor') {
        window.location.href = 'vendas.html';
        return false;
    }
    return true;
}

function cadastrarUsuario(nome, email, senha, tipo) {
    const usuarios = JSON.parse(localStorage.getItem('sweetbox_usuarios') || '[]');
    if (usuarios.some(u => u.email === email)) {
        return false;
    }
    const novoUsuario = { id: Date.now().toString(), nome, email, senha, tipo };
    usuarios.push(novoUsuario);
    localStorage.setItem('sweetbox_usuarios', JSON.stringify(usuarios));
    return true;
}

function validarSenhaForte(senha) {
    return {
        tamanho: senha.length >= 8,
        maiuscula: /[A-Z]/.test(senha),
        minuscula: /[a-z]/.test(senha),
        numero: /[0-9]/.test(senha),
        especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
    };
}

function senhaEhForte(senha) {
    const requisitos = validarSenhaForte(senha);
    return Object.values(requisitos).every(v => v);
}

inicializarUsuarios();
