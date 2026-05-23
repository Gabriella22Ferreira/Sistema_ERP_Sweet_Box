
///////////OLHOS PARA SENHA
//document.getElementById('togglePassword').addEventListener('click', function() {
//            const senhaInput = document.getElementById('senha');
//            const eyeIcon = document.getElementById('eyeIcon');
//            if (senhaInput.type === 'password') {
//                senhaInput.type = 'text';
//                eyeIcon.setAttribute('data-lucide', 'eye-off');
//            } else {
//                senhaInput.type = 'password';
//                eyeIcon.setAttribute('data-lucide', 'eye');
//            }
//            lucide.createIcons();
//        });



////////////// NAVBAR
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



////////////// PRODUTO

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



////////////////////////
function carregarPagina() {
    const usuario = verificarAutenticacao();
    if (!usuario) return;
    carregarMenu(usuario);
    carregarInfoUsuario(usuario);
    atualizarRelatorios();
    lucide.createIcons();
}









//////////// VENDA
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
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
                <div>
                    <h5 style="margin: 0 0 0.25rem 0; font-size: 0.95rem;">${item.nome}</h5>
                    <div style="font-size: 0.8rem; color: gray;">${item.quantidade}x R$ ${item.preco.toFixed(2)}</div>
                </div>
                <div style="font-weight: 600; color: var(--primary);">R$ ${subtotal.toFixed(2)}</div>
            </div>
        `;
    });

    spanTotal.textContent = 'R$ ' + totalDaVenda.toFixed(2);
    footer.style.display = carrinho.length > 0 ? 'block' : 'none';
}

function finalizarVenda() {
    if (carrinho.length === 0) return;

    // Isso vai aparecer na aba CONSOLE (F12) do seu navegador
    console.log("Enviando JSON para o Java: ", JSON.stringify(carrinho));

    fetch('/vendas/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carrinho)
    })
    .then(response => {
        console.log("Resposta do Java: ", response.status); // Vai mostrar 200 se deu certo
        if (response.ok) {
            alert("Venda finalizada com sucesso!");
            window.location.reload();
        } else {
            alert("Erro do Servidor. Veja o console do IntelliJ.");
        }
    })
    .catch(error => {
        console.error("O JavaScript não conseguiu falar com o Java:", error);
        alert("Falha na comunicação com o servidor.");
    });
}




function abrirHistorico() {
    const modal = document.getElementById('modalHistorico');
    const conteudo = document.getElementById('historicoConteudo');

    if (!modal || !conteudo) return;

    // Altera a propriedade display para tornar a estrutura visível
    modal.style.display = 'flex';
    conteudo.innerHTML = '<p style="text-align: center; padding: 1rem;">Buscando vendas realizadas...</p>';

    // Faz a chamada para a nossa nova rota Java
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

            // Mapeia e constrói o visual de cada venda com seus respectivos itens
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
            console.error("Erro ao carregar histórico:", error);
            conteudo.innerHTML = '<p style="text-align: center; padding: 1rem; color: red;">Não foi possível carregar as informações.</p>';
        });
}

function fecharHistorico() {
    const modal = document.getElementById('modalHistorico');
    if (modal) {
        modal.style.display = 'none';
    }
}