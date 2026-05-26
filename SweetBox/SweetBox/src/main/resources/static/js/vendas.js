// ==========================================
// vendas.js - Lógica Exclusiva da Tela de Vendas
// ==========================================

let carrinho = [];

function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id: id, nome: nome, preco: preco, quantidade: 1 });
    }
    atualizarVisualDoCarrinho();
}

function atualizarVisualDoCarrinho() {
    const divItens = document.getElementById('itensCarrinho');
    const spanTotal = document.getElementById('totalValor');
    const footer = document.getElementById('carrinhoFooter');

    if (!divItens || !spanTotal) return;

    divItens.innerHTML = '';
    let totalDaVenda = 0;

    carrinho.forEach((item) => {
        const subtotal = item.preco * item.quantidade;
        totalDaVenda += subtotal;

        divItens.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
                <div>
                    <h5 style="margin: 0 0 0.25rem 0; font-size: 0.95rem;">${item.nome}</h5>
                    <div style="font-size: 0.8rem; color: var(--primary);">
                        <button onclick="ajustarQuantidade(${item.id}, -1)" style="border:none; cursor:pointer;">➖</button>
                        ${item.quantidade}x R$ ${item.preco.toFixed(2)}
                        <button onclick="ajustarQuantidade(${item.id}, 1)" style="border:none; cursor:pointer;">➕</button>
                    </div>
                </div>
                <div style="font-weight: 600; color: var(--primary);">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
    });

    // Se o carrinho tiver itens, adiciona o botão de limpar no final
    if (carrinho.length > 0) {
        divItens.innerHTML += `
            <button onclick="limparCarrinho()" style="width: 100%; padding: 0.5rem; background: #ffe6e6; color: #d9534f; border: 1px solid #d9534f; border-radius: 4px; cursor: pointer;">
                Limpar Carrinho
            </button>
        `;
    }

    spanTotal.textContent = 'R$ ' + totalDaVenda.toFixed(2);
    if (footer) footer.style.display = carrinho.length > 0 ? 'block' : 'none';
}

function finalizarCompra() {
    if (carrinho.length === 0) return;

    fetch('/vendas/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrinho)
    })
    .then(async response => {
        if (response.ok) {
            alert("Venda finalizada com sucesso!");
            window.location.reload();
        } else {
            const erro = await response.text();
            alert("Erro: " + erro);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Falha na comunicação com o servidor.");
    });
}

// Funções do Histórico
function abrirHistorico() {
    const modal = document.getElementById('modalHistorico');
    const conteudo = document.getElementById('historicoConteudo');

    if (!modal || !conteudo) return;

    modal.style.display = 'flex';
    conteudo.innerHTML = '<p style="text-align: center; padding: 1rem;">Buscando vendas realizadas...</p>';

    fetch('/vendas/historico')
        .then(response => {
            if (!response.ok) throw new Error('Erro na comunicação.');
            return response.json();
        })
        .then(vendas => {
            if (vendas.length === 0) {
                conteudo.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--muted-foreground);">Nenhuma venda registrada até o momento.</p>';
                return;
            }

            conteudo.innerHTML = vendas.map(venda => `
                <div style="background: #fff; padding: 1rem; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); color: #000;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600;">
                        <span>Venda #${venda.id}</span>
                        <span style="color: var(--primary);">R$ ${venda.valorTotal.toFixed(2)}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: gray; margin-bottom: 0.75rem;">
                        <div>Horário: ${venda.dataHora}</div>
                        <div>Caixa: ${venda.vendedor}</div>
                    </div>
                    <div style="border-top: 1px dashed #eee; padding-top: 0.5rem;">
                        <h6 style="margin: 0 0 0.25rem 0; font-size: 0.85rem; font-weight: 600;">Itens Registrados:</h6>
                        <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.85rem; color: #333; list-style-type: disc;">
                            ${venda.produtos.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            conteudo.innerHTML = '<p style="text-align: center; padding: 1rem; color: red;">Não foi possível carregar as informações.</p>';
        });
}

function fecharHistorico() {
    const modal = document.getElementById('modalHistorico');
    if (modal) modal.style.display = 'none';
}

// Aumenta ou diminui a quantidade de um item específico
function ajustarQuantidade(id, delta) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade += delta;
        // Se a quantidade chegar a 0, remove o item do carrinho
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(item => item.id !== id);
        }
        atualizarVisualDoCarrinho();
    }
}

// Limpa o carrinho todo
function limparCarrinho() {
    carrinho = [];
    atualizarVisualDoCarrinho();
}