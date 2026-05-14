let produtos = [];
let produtoEditando = null;

function carregarPagina() {
    const usuario = verificarAutenticacao();
    if (!usuario) return;
    carregarMenu(usuario);
    carregarInfoUsuario(usuario);
    carregarProdutos();
    renderizarProdutos();
    lucide.createIcons();
}

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

function carregarInfoUsuario(usuario) {
    document.getElementById('userInfo').innerHTML = `<p>${usuario.nome}</p><span>${usuario.tipo}</span>`;
}

function carregarProdutos() {
    produtos = JSON.parse(localStorage.getItem('sweetbox_produtos') || '[]');
}

function salvarProdutos() {
    localStorage.setItem('sweetbox_produtos', JSON.stringify(produtos));
}

function filtrarProdutos() {
    renderizarProdutos();
}

function renderizarProdutos() {
    const busca = document.getElementById('busca').value.toLowerCase();
    const produtosFiltrados = produtos.filter(p => 
        p.nome.toLowerCase().includes(busca) || (p.categoria && p.categoria.toLowerCase().includes(busca))
    );
    const lista = document.getElementById('listaProdutos');
    if (produtosFiltrados.length === 0) {
        lista.innerHTML = `<div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
            <i data-lucide="package" class="icon-xl" style="margin: 0 auto 1rem; color: var(--muted-foreground);"></i>
            <p style="color: var(--muted-foreground);">Nenhum produto encontrado</p></div>`;
    } else {
        lista.innerHTML = produtosFiltrados.map(p => `
            <div class="card">
                <div class="flex-between mb-3">
                    <div style="flex: 1;">
                        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${p.nome}</h4>
                        ${p.categoria ? `<span class="badge badge-primary">${p.categoria}</span>` : ''}
                    </div>
                    <div class="flex gap-1">
                        <button onclick="editarProduto('${p.id}')" class="btn btn-outline" style="padding: 0.5rem;">
                            <i data-lucide="pencil" class="icon" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button onclick="excluirProduto('${p.id}')" class="btn btn-outline" style="padding: 0.5rem; color: var(--destructive);">
                            <i data-lucide="trash-2" class="icon" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>
                ${p.descricao ? `<p style="font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 1rem;">${p.descricao}</p>` : ''}
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <div class="flex-between" style="font-size: 0.875rem;">
                        <span style="color: var(--muted-foreground);">Preço:</span>
                        <span style="font-weight: 600; color: var(--primary);">R$ ${p.preco.toFixed(2)}</span>
                    </div>
                    <div class="flex-between" style="font-size: 0.875rem;">
                        <span style="color: var(--muted-foreground);">Estoque:</span>
                        <span style="font-weight: 600; color: ${p.quantidade <= p.estoqueMinimo ? 'var(--destructive)' : 'var(--foreground)'};">
                            ${p.quantidade} un.
                        </span>
                    </div>
                    ${p.quantidade <= p.estoqueMinimo ? '<div class="badge badge-danger" style="width: 100%; text-align: center;">Estoque baixo!</div>' : ''}
                </div>
            </div>
        `).join('');
    }
    lucide.createIcons();
}

function abrirModal(produto) {
    produtoEditando = produto || null;
    document.getElementById('modalTitulo').textContent = produto ? 'Editar Produto' : 'Novo Produto';
    if (produto) {
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao || '';
        document.getElementById('categoria').value = produto.categoria || '';
        document.getElementById('preco').value = produto.preco;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('estoqueMinimo').value = produto.estoqueMinimo;
    } else {
        document.getElementById('produtoForm').reset();
    }
    document.getElementById('modalProduto').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalProduto').classList.remove('active');
    produtoEditando = null;
}

function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) abrirModal(produto);
}

function excluirProduto(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        produtos = produtos.filter(p => p.id !== id);
        salvarProdutos();
        renderizarProdutos();
    }
}

document.getElementById('produtoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const produto = {
        id: produtoEditando?.id || Date.now().toString(),
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        preco: parseFloat(document.getElementById('preco').value),
        quantidade: parseInt(document.getElementById('quantidade').value),
        estoqueMinimo: parseInt(document.getElementById('estoqueMinimo').value) || 5
    };
    if (produtoEditando) {
        produtos = produtos.map(p => p.id === produtoEditando.id ? produto : p);
    } else {
        produtos.push(produto);
    }
    salvarProdutos();
    renderizarProdutos();
    fecharModal();
});
