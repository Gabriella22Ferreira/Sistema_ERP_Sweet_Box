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

    // Ativa os ícones do Lucide (caso utilize na sua interface)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}



function filtrarProdutos() {
    renderizarProdutos();
}
//
//function renderizarProdutos() {
//    const busca = document.getElementById('busca').value.toLowerCase();
//    const produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(busca));
//    const tbody = document.getElementById('tabelaProdutos');
//
//    if (produtosFiltrados.length === 0) {
//        tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="padding: 2rem; color: var(--muted-foreground);">Nenhum produto encontrado</td></tr>';
//    } else {
//        tbody.innerHTML = produtosFiltrados.map(p => {
//            const baixo = p.quantidade <= p.estoqueMinimo;
//            return `
//                <tr>
//                    <td><div class="flex gap-2"><i data-lucide="package" class="icon" style="color: var(--primary);"></i>
//                        <span style="font-weight: 500;">${p.nome}</span></div></td>
//                    <td style="text-align: center; font-weight: 700; color: ${baixo ? 'var(--destructive)' : 'var(--foreground)'};">${p.quantidade} un.</td>
//                    <td style="text-align: center; color: var(--muted-foreground);">${p.estoqueMinimo} un.</td>
//                    <td style="text-align: center;">
//                        ${baixo
//                            ? '<span class="badge badge-danger"><i data-lucide="trending-down" style="width: 14px; height: 14px; margin-right: 4px;"></i>Baixo</span>'
//                            : '<span class="badge badge-success"><i data-lucide="trending-up" style="width: 14px; height: 14px; margin-right: 4px;"></i>OK</span>'
//                        }
//                    </td>
//                </tr>
//            `;
//        }).join('');
//    }
//    lucide.createIcons();
//}

function renderizarMovimentacoes() {
    const container = document.getElementById('movimentacoes');
    const ultimas = movimentacoes.slice().reverse().slice(0, 10);
    
    if (ultimas.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--muted-foreground); padding: 2rem;">Nenhuma movimentação registrada</p>';
    } else {
        container.innerHTML = ultimas.map(mov => `
            <div class="card mb-2" style="background-color: var(--muted); padding: 0.75rem;">
                <div class="flex gap-2 mb-2">
                    <i data-lucide="${mov.tipo === 'entrada' ? 'trending-up' : 'trending-down'}" class="icon" 
                       style="color: ${mov.tipo === 'entrada' ? '#10b981' : 'var(--destructive)'};"></i>
                    <div style="flex: 1;">
                        <p style="font-weight: 500; font-size: 0.875rem;">${mov.produtoNome}</p>
                        <p style="font-size: 0.75rem; color: var(--muted-foreground);">
                            ${new Date(mov.data).toLocaleDateString('pt-BR')} às ${new Date(mov.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <div class="flex-between">
                    <span style="font-size: 0.875rem; font-weight: 600; color: ${mov.tipo === 'entrada' ? '#10b981' : 'var(--destructive)'};">
                        ${mov.tipo === 'entrada' ? '+' : '-'}${mov.quantidade} un.
                    </span>
                    <span class="badge">${mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                </div>
                ${mov.observacao ? `<p style="font-size: 0.75rem; color: var(--muted-foreground); margin-top: 0.5rem; font-style: italic;">${mov.observacao}</p>` : ''}
            </div>
        `).join('');
    }
    lucide.createIcons();
}

function abrirModal() {
    const select = document.getElementById('produtoId');
    select.innerHTML = '<option value="">Selecione um produto</option>' + 
        produtos.map(p => `<option value="${p.id}">${p.nome} (Estoque atual: ${p.quantidade})</option>`).join('');
    document.getElementById('entradaForm').reset();
    document.getElementById('modalEntrada').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalEntrada').classList.remove('active');
}

    document.getElementById('entradaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const produtoId = document.getElementById('produtoId').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const observacao = document.getElementById('observacao').value;

        if (!produtoId || quantidade <= 0) {
            alert('Selecione um produto e informe a quantidade');
            return;
        }

        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;

        produtos = produtos.map(p => p.id === produtoId ? { ...p, quantidade: p.quantidade + quantidade } : p);
        localStorage.setItem('sweetbox_produtos', JSON.stringify(produtos));

        const novaMovimentacao = {
            id: Date.now().toString(),
            produtoId: produtoId,
            produtoNome: produto.nome,
            tipo: 'entrada',
            quantidade: quantidade,
            data: new Date().toISOString(),
            observacao: observacao
        };
        movimentacoes.push(novaMovimentacao);
        localStorage.setItem('sweetbox_movimentacoes', JSON.stringify(movimentacoes));

        alert('Entrada registrada com sucesso!');
        carregarDados();
        renderizarProdutos();
        renderizarMovimentacoes();
        fecharModal();
    });
