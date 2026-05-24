//
//function carregarMenu(usuario) {
//    const menu = document.getElementById('navMenu');
//    const itens = [
//        { path: 'dashboard.html', icon: 'layout-dashboard', label: 'Dashboard', gestor: true, funcionario: false },
//        { path: 'produtos.html', icon: 'package', label: 'Produtos', gestor: true, funcionario: true },
//        { path: 'estoque.html', icon: 'box', label: 'Estoque', gestor: true, funcionario: true },
//        { path: 'vendas.html', icon: 'shopping-cart', label: 'Vendas', gestor: true, funcionario: true },
//        { path: 'relatorios.html', icon: 'bar-chart-3', label: 'Relatórios', gestor: true, funcionario: false }
//    ];
//    menu.innerHTML = itens.filter(item => usuario.tipo === 'gestor' ? item.gestor : item.funcionario)
//        .map(item => `<li><a href="${item.path}" class="${window.location.pathname.includes(item.path) ? 'active' : ''}">
//            <i data-lucide="${item.icon}" class="icon"></i><span>${item.label}</span></a></li>`).join('');
//}




// ==========================================
// produtos.js - Apenas Controle Visual
// ==========================================

// 1. Funções do Modal de Novo Produto
function abrirModal() {
    document.getElementById('modalProduto').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalProduto').classList.remove('active');
    // Limpa o formulário ao fechar
    document.getElementById('produtoForm').reset();
}

// 2. Funções do Modal de Editar Produto
function abrirModalEditar(id, nome, preco, quantidade) {
    document.getElementById('modalEditarProduto').classList.add('active');

    // Preenche os campos do modal com os dados que vieram do botão no HTML
    document.getElementById('editId').value = id;
    document.getElementById('editNome').value = nome;
    document.getElementById('editPreco').value = preco;
    document.getElementById('editQuantidade').value = quantidade;

    // Altera a rota (Action) do formulário para apontar para a edição do Java
    document.getElementById('formEditarProduto').action = '/produtos/editar/' + id;
}

function fecharModalEditar() {
    document.getElementById('modalEditarProduto').classList.remove('active');
}

// 3. Funções do Modal de Exclusão
function abrirModalDelete(id) {
    document.getElementById('modalDelete').classList.add('active');

    // Pega o botão vermelho de confirmar e coloca o link do Java nele
    document.getElementById('btnConfirmDelete').href = '/produtos/excluir/' + id;
}

function fecharModalDelete() {
    document.getElementById('modalDelete').classList.remove('active');
}