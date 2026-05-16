let chartVendas, chartProdutos;

function carregarPagina() {
    const usuario = verificarAutenticacao();
    if (!usuario) return;
    carregarMenu(usuario);
    carregarInfoUsuario(usuario);
    atualizarRelatorios();
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

function atualizarRelatorios() {
    const periodo = document.getElementById('periodo').value;
    const vendas = JSON.parse(localStorage.getItem('sweetbox_vendas') || '[]');
    const hoje = new Date();
    let dataInicio = new Date();
    
    if (periodo === '7dias') {
        dataInicio.setDate(hoje.getDate() - 7);
    } else if (periodo === '30dias') {
        dataInicio.setDate(hoje.getDate() - 30);
    } else {
        dataInicio = new Date(0);
    }
    
    const vendasFiltradas = vendas.filter(v => new Date(v.data) >= dataInicio);
    const receitaTotal = vendasFiltradas.reduce((acc, v) => acc + v.total, 0);
    const totalVendas = vendasFiltradas.length;
    const ticketMedio = totalVendas > 0 ? receitaTotal / totalVendas : 0;
    
    document.getElementById('statsCards').innerHTML = `
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Receita Total</p><h3>R$ ${receitaTotal.toFixed(2)}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--primary), var(--accent));">
                    <i data-lucide="dollar-sign" class="icon-lg"></i>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Total de Vendas</p><h3>${totalVendas}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--accent), var(--secondary));">
                    <i data-lucide="trending-up" class="icon-lg"></i>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Ticket Médio</p><h3>R$ ${ticketMedio.toFixed(2)}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--secondary), var(--primary));">
                    <i data-lucide="calendar" class="icon-lg"></i>
                </div>
            </div>
        </div>
    `;
    
    const vendasPorDia = vendasFiltradas.reduce((acc, v) => {
        const data = new Date(v.data).toLocaleDateString('pt-BR');
        if (!acc[data]) acc[data] = { data, vendas: 0, receita: 0 };
        acc[data].vendas += 1;
        acc[data].receita += v.total;
        return acc;
    }, {});
    
    const dadosGrafico = Object.values(vendasPorDia).slice(-10);
    
    if (chartVendas) chartVendas.destroy();
    chartVendas = new Chart(document.getElementById('chartVendas'), {
        type: 'bar',
        data: {
            labels: dadosGrafico.map(d => d.data),
            datasets: [{
                label: 'Receita (R$)',
                data: dadosGrafico.map(d => d.receita),
                backgroundColor: '#e91e8c',
                borderRadius: 8
            }]
        },
        options: { responsive: true, maintainAspectRatio: true }
    });
    
    const produtosContagem = vendasFiltradas.flatMap(v => v.itens).reduce((acc, item) => {
        const nome = item.produto.nome;
        if (!acc[nome]) acc[nome] = { nome, quantidade: 0 };
        acc[nome].quantidade += item.quantidade;
        return acc;
    }, {});
    
    const topProdutos = Object.values(produtosContagem).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5);
    const cores = ['#e91e8c', '#ff6bb5', '#ffc4dd', '#ff9fd1', '#ffb3db'];
    
    if (chartProdutos) chartProdutos.destroy();
    chartProdutos = new Chart(document.getElementById('chartProdutos'), {
        type: 'pie',
        data: {
            labels: topProdutos.map(p => p.nome),
            datasets: [{
                data: topProdutos.map(p => p.quantidade),
                backgroundColor: cores
            }]
        },
        options: { responsive: true, maintainAspectRatio: true }
    });
    
    const tbody = document.getElementById('tabelaVendas');
    if (vendasFiltradas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="padding: 2rem; color: var(--muted-foreground);">Nenhuma venda no período</td></tr>';
    } else {
        tbody.innerHTML = vendasFiltradas.slice().reverse().slice(0, 10).map(v => `
            <tr>
                <td>${new Date(v.data).toLocaleDateString('pt-BR')} ${new Date(v.data).toLocaleTimeString('pt-BR')}</td>
                <td>${v.itens.length} produto(s)</td>
                <td style="text-align: right; font-weight: 600; color: var(--primary);">R$ ${v.total.toFixed(2)}</td>
            </tr>
        `).join('');
    }
    
    lucide.createIcons();
}
