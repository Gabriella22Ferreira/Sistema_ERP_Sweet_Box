
function carregarMenu(usuario) {
    const menu = document.getElementById('navMenu');
    const itens = [
        { path: 'dashboard.html', icon: 'layout-dashboard', label: 'Dashboard', gestor: true, funcionario: false },
        { path: 'produtos.html', icon: 'package', label: 'Produtos', gestor: true, funcionario: true },
        { path: 'estoque.html', icon: 'box', label: 'Estoque', gestor: true, funcionario: true },
        { path: 'vendas.html', icon: 'shopping-cart', label: 'Vendas', gestor: true, funcionario: true },
        { path: 'relatorios.html', icon: 'bar-chart-3', label: 'Relatórios', gestor: true, funcionario: false }
    ];
    menu.innerHTML = itens.filter(item => usuario.tipo === 'gestor' ? item.gestor : item.funcionario)
        .map(item => `<li><a href="${item.path}" class="${window.location.pathname.includes(item.path) ? 'active' : ''}">
            <i data-lucide="${item.icon}" class="icon"></i><span>${item.label}</span></a></li>`).join('');
}


// FUNÇÕES VISUAIS DO MODAL (Não tocam no banco de dados)

function abrirModal() {
    // 1. Limpa o formulário para garantir que não tenha dados velhos ao abrir
    document.getElementById('produtoForm').reset();
    
    // 2. Adiciona a classe 'active' que faz a janela aparecer na tela
    document.getElementById('modalProduto').classList.add('active');
}

function fecharModal() {
    // 1. Remove a classe 'active', escondendo a janela
    document.getElementById('modalProduto').classList.remove('active');
}

function abrirModalEditar(id, nome, preco, quantidade) {
    document.getElementById("modalEditarProduto").classList.add("active");

    document.getElementById("editId").value = id;
    document.getElementById("editNome").value = nome;
    document.getElementById("editPreco").value = preco;
    document.getElementById("editQuantidade").value = quantidade;

    document.getElementById("formEditarProduto").action = "/produtos/atualizar/" + id;
}

function fecharModalEditar() {
    document.getElementById("modalEditarProduto").classList.remove("active");
}

function abrirModalDelete(id) {
    document.getElementById("modalDelete").classList.add("active");

    document.getElementById("btnConfirmDelete").href = "/produtos/deletar/" + id;
}

function fecharModalDelete() {
    document.getElementById("modalDelete").classList.remove("active");
}