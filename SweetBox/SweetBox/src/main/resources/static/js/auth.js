//
//function getUsuarioLogado() {
//    const usuario = localStorage.getItem('sweetbox_usuario_logado');
//    return usuario ? JSON.parse(usuario) : null;
//}
//
//
//function verificarPermissaoGestor() {
//    const usuario = verificarAutenticacao();
//    if (usuario && usuario.tipo !== 'gestor') {
//        window.location.href = 'vendas.html';
//        return false;
//    }
//    return true;
//}
//
//function cadastrarUsuario(nome, email, senha, tipo) {
//    const usuarios = JSON.parse(localStorage.getItem('sweetbox_usuarios') || '[]');
//    if (usuarios.some(u => u.email === email)) {
//        return false;
//    }
//    const novoUsuario = { id: Date.now().toString(), nome, email, senha, tipo };
//    usuarios.push(novoUsuario);
//    localStorage.setItem('sweetbox_usuarios', JSON.stringify(usuarios));
//    return true;
//}
//
//function validarSenhaForte(senha) {
//    return {
//        tamanho: senha.length >= 8,
//        maiuscula: /[A-Z]/.test(senha),
//        minuscula: /[a-z]/.test(senha),
//        numero: /[0-9]/.test(senha),
//        especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
//    };
//}
//
//function senhaEhForte(senha) {
//    const requisitos = validarSenhaForte(senha);
//    return Object.values(requisitos).every(v => v);
//}
//
//inicializarUsuarios();
