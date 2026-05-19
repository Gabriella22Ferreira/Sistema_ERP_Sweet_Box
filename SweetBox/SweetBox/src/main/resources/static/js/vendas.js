//let produtos = [];
//let carrinho = [];
//let vendas = [];
//
//function carregarPagina() {
//    const usuario = verificarAutenticacao();
//    if (!usuario) return;
//
//    carregarMenu(usuario);
//    carregarInfoUsuario(usuario);
//    carregarProdutos();
//    carregarVendas();
//    renderizarProdutos();
//    renderizarCarrinho();
//    lucide.createIcons();
//}
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
//
//    menu.innerHTML = itens
//        .filter(item => usuario.tipo === 'gestor' ? item.gestor : item.funcionario)
//        .map(item => `
//            <li>
//                <a href="${item.path}" class="${window.location.pathname.includes(item.path) ? 'active' : ''}">
//                    <i data-lucide="${item.icon}" class="icon"></i>
//                    <span>${item.label}</span>
//                </a>
//            </li>
//        `).join('');
//}
//
//function carregarInfoUsuario(usuario) {
//    document.getElementById('userInfo').innerHTML = `
//        <p>${usuario.nome}</p>
//        <span>${usuario.tipo}</span>
//    `;
//}
//
//function carregarProdutos() {
//    produtos = JSON.parse(localStorage.getItem('sweetbox_produtos') || '[]');
//}
//
//function carregarVendas() {
//    vendas = JSON.parse(localStorage.getItem('sweetbox_vendas') || '[]');
//}
//
//function filtrarProdutos() {
//    renderizarProdutos();
//}
//
//function renderizarProdutos() {
//    const busca = document.getElementById('busca').value.toLowerCase();
//    const produtosFiltrados = produtos.filter(p =>
//        p.nome.toLowerCase().includes(busca) && p.quantidade > 0
//    );
//
//    const lista = document.getElementById('listaProdutos');
//    if (produtosFiltrados.length === 0) {
//        lista.innerHTML = `
//            <div class="card text-center" style="grid-column: 1 / -1; padding: 3rem;">
//                <i data-lucide="shopping-cart" class="icon-xl" style="margin: 0 auto 1rem; color: var(--muted-foreground);"></i>
//                <p style="color: var(--muted-foreground);">Nenhum produto disponível</p>
//            </div>
//        `;
//    } else {
//        lista.innerHTML = produtosFiltrados.map(p => `
//            <div class="card" style="cursor: pointer; transition: all 0.3s;" onclick="adicionarAoCarrinho('${p.id}')">
//                <div class="flex-between mb-2">
//                    <div style="flex: 1;">
//                        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${p.nome}</h4>
//                        <p style="font-size: 0.875rem; color: var(--muted-foreground);">Estoque: ${p.quantidade} un.</p>
//                    </div>
//                    <p style="font-weight: 700; color: var(--primary); font-size: 1.125rem;">R$ ${p.preco.toFixed(2)}</p>
//                </div>
//            </div>
//        `).join('');
//    }
//    lucide.createIcons();
//}
//
//function adicionarAoCarrinho(produtoId) {
//    const produto = produtos.find(p => p.id === produtoId);
//    if (!produto) return;
//
//    const itemExistente = carrinho.find(item => item.produto.id === produtoId);
//
//    if (itemExistente) {
//        if (itemExistente.quantidade < produto.quantidade) {
//            itemExistente.quantidade++;
//        } else {
//            alert('Quantidade indisponível no estoque');
//            return;
//        }
//    } else {
//        if (produto.quantidade > 0) {
//            carrinho.push({ produto, quantidade: 1 });
//        } else {
//            alert('Produto sem estoque');
//            return;
//        }
//    }
//
//    renderizarCarrinho();
//}
//
//function alterarQuantidade(produtoId, delta) {
//    const item = carrinho.find(i => i.produto.id === produtoId);
//    if (!item) return;
//
//    const novaQtd = item.quantidade + delta;
//
//    if (novaQtd <= 0) {
//        removerDoCarrinho(produtoId);
//        return;
//    }
//
//    if (novaQtd > item.produto.quantidade) {
//        alert('Quantidade indisponível no estoque');
//        return;
//    }
//
//    item.quantidade = novaQtd;
//    renderizarCarrinho();
//}
//
//function removerDoCarrinho(produtoId) {
//    carrinho = carrinho.filter(item => item.produto.id !== produtoId);
//    renderizarCarrinho();
//}
//
//function renderizarCarrinho() {
//    const container = document.getElementById('carrinhoItens');
//    const footer = document.getElementById('carrinhoFooter');
//
//    if (carrinho.length === 0) {
//        container.innerHTML = `
//            <div class="text-center" style="padding: 2rem;">
//                <p style="color: var(--muted-foreground);">Carrinho vazio</p>
//            </div>
//        `;
//        footer.style.display = 'none';
//    } else {
//        container.innerHTML = carrinho.map(item => `
//            <div class="card mb-2" style="background-color: var(--muted); padding: 0.75rem;">
//                <div class="flex-between mb-2">
//                    <div style="flex: 1;">
//                        <h5 style="font-size: 0.875rem; font-weight: 600;">${item.produto.nome}</h5>
//                        <p style="font-size: 0.75rem; color: var(--muted-foreground);">R$ ${item.produto.preco.toFixed(2)} x ${item.quantidade}</p>
//                    </div>
//                    <button onclick="removerDoCarrinho('${item.produto.id}')" style="background: none; border: none; cursor: pointer; color: var(--destructive); padding: 0.25rem;">
//                        <i data-lucide="trash-2" class="icon"></i>
//                    </button>
//                </div>
//                <div class="flex-between">
//                    <div class="flex gap-1">
//                        <button onclick="alterarQuantidade('${item.produto.id}', -1)" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">
//                            <i data-lucide="minus" class="icon" style="width: 16px; height: 16px;"></i>
//                        </button>
//                        <span style="padding: 0.25rem 0.75rem; font-weight: 600;">${item.quantidade}</span>
//                        <button onclick="alterarQuantidade('${item.produto.id}', 1)" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;">
//                            <i data-lucide="plus" class="icon" style="width: 16px; height: 16px;"></i>
//                        </button>
//                    </div>
//                    <span style="font-weight: 700; color: var(--primary);">R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</span>
//                </div>
//            </div>
//        `).join('');
//
//        const total = carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);
//        document.getElementById('totalValor').textContent = `R$ ${total.toFixed(2)}`;
//        footer.style.display = 'block';
//    }
//    lucide.createIcons();
//}
//
//function finalizarVenda() {
//    if (carrinho.length === 0) {
//        alert('Carrinho vazio');
//        return;
//    }
//
//    const total = carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);
//
//    produtos = produtos.map(produto => {
//        const itemCarrinho = carrinho.find(item => item.produto.id === produto.id);
//        if (itemCarrinho) {
//            return { ...produto, quantidade: produto.quantidade - itemCarrinho.quantidade };
//        }
//        return produto;
//    });
//    localStorage.setItem('sweetbox_produtos', JSON.stringify(produtos));
//
//    const novaVenda = {
//        id: Date.now().toString(),
//        data: new Date().toISOString(),
//        itens: carrinho,
//        total
//    };
//    vendas.push(novaVenda);
//    localStorage.setItem('sweetbox_vendas', JSON.stringify(vendas));
//
//    const movimentacoes = JSON.parse(localStorage.getItem('sweetbox_movimentacoes') || '[]');
//    carrinho.forEach(item => {
//        movimentacoes.push({
//            id: `${Date.now()}-${item.produto.id}`,
//            produtoId: item.produto.id,
//            produtoNome: item.produto.nome,
//            tipo: 'saida',
//            quantidade: item.quantidade,
//            data: novaVenda.data,
//            observacao: `Venda #${novaVenda.id.slice(-6)}`
//        });
//    });
//    localStorage.setItem('sweetbox_movimentacoes', JSON.stringify(movimentacoes));
//
//    alert(`Venda finalizada!\nTotal: R$ ${total.toFixed(2)}`);
//    carrinho = [];
//    renderizarProdutos();
//    renderizarCarrinho();
//}
//
//function abrirHistorico() {
//    const modal = document.getElementById('modalHistorico');
//    const conteudo = document.getElementById('historicoConteudo');
//
//    if (vendas.length === 0) {
//        conteudo.innerHTML = `
//            <div class="text-center" style="padding: 3rem;">
//                <i data-lucide="history" class="icon-xl" style="margin: 0 auto 1rem; color: var(--muted-foreground); opacity: 0.5;"></i>
//                <p style="color: var(--muted-foreground);">Nenhuma venda registrada</p>
//            </div>
//        `;
//    } else {
//        conteudo.innerHTML = vendas.slice().reverse().map(venda => `
//            <div class="card mb-3">
//                <div class="flex-between mb-2">
//                    <div>
//                        <p style="font-weight: 600;">Venda #${venda.id.slice(-6)}</p>
//                        <p style="font-size: 0.875rem; color: var(--muted-foreground);">
//                            ${new Date(venda.data).toLocaleDateString('pt-BR')} às ${new Date(venda.data).toLocaleTimeString('pt-BR')}
//                        </p>
//                    </div>
//                    <span style="font-weight: 700; color: var(--primary); font-size: 1.125rem;">R$ ${venda.total.toFixed(2)}</span>
//                </div>
//                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
//                    ${venda.itens.map(item => `
//                        <div class="flex-between" style="padding: 0.5rem; background-color: var(--background); border-radius: 0.5rem; font-size: 0.875rem;">
//                            <span>${item.produto.nome} x${item.quantidade}</span>
//                            <span style="font-weight: 500;">R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</span>
//                        </div>
//                    `).join('')}
//                </div>
//            </div>
//        `).join('');
//    }
//
//    modal.classList.add('active');
//    lucide.createIcons();
//}
//
//function fecharHistorico() {
//    document.getElementById('modalHistorico').classList.remove('active');
//}


let carrinho = []; // Memória do carrinho

// Chamado pelo th:onclick do HTML
function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarVisualDoCarrinho();
}

function atualizarVisualDoCarrinho() {
    const divItens = document.getElementById('itensCarrinho');
    const spanTotal = document.getElementById('totalValor'); // ID corrigido
    const footer = document.getElementById('carrinhoFooter'); // Pega o rodapé escondido

    if (!divItens || !spanTotal) return;

    divItens.innerHTML = '';
    let totalDaVenda = 0;

    carrinho.forEach((item) => {
        const subtotal = item.preco * item.quantidade;
        totalDaVenda += subtotal;

        divItens.innerHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
                <div>
                    <h5 style="margin: 0 0 0.25rem 0; font-size: 0.95rem;">${item.nome}</h5>
                    <div style="font-size: 0.8rem; color: gray;">
                        ${item.quantidade}x R$ ${item.preco.toFixed(2)}
                    </div>
                </div>
                <div style="font-weight: 600; color: var(--primary);">
                    R$ ${subtotal.toFixed(2)}
                </div>
            </div>
        `;
    });

    // Atualiza o valor e mostra o rodapé
    spanTotal.textContent = 'R$ ' + totalDaVenda.toFixed(2);

    if (carrinho.length > 0) {
        footer.style.display = 'block'; // Mostra o botão Finalizar
    } else {
        footer.style.display = 'none'; // Esconde se estiver vazio
    }
}

function finalizarVenda() {
    // 1. Verifica se tem algo no carrinho
    if (carrinho.length === 0) {
        alert("Adicione produtos ao carrinho antes de finalizar!");
        return;
    }

    // 2. Prepara os dados e envia para o Java via POST
    fetch('/vendas/finalizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Avisa o Java que estamos mandando um JSON
        },
        body: JSON.stringify(carrinho) // Transforma a nossa lista numa string para viajar pela internet
    })
    .then(response => {
        if (response.ok) {
            alert("Venda finalizada com sucesso!");
            window.location.reload(); // Recarrega a página para zerar o carrinho
        } else {
            alert("Erro ao finalizar a venda no servidor.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro de comunicação com o servidor.");
    });
}