
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