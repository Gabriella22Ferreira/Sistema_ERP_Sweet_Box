function renderizarGraficos(labels, dadosVendas, dadosReceita) {
    const ctxVendas = document.getElementById('chartVendas');
    const ctxReceita = document.getElementById('chartReceita');

    if(ctxVendas) {
        new Chart(ctxVendas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendas',
                    data: dadosVendas,
                    backgroundColor: '#e91e8c', // Rosa principal da SweetBox
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }

    if(ctxReceita) {
        new Chart(ctxReceita, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Receita (R$)',
                    data: dadosReceita,
                    borderColor: '#e91e8c',
                    backgroundColor: 'rgba(233, 30, 140, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
}

function setPeriodo(novoPeriodo) {
    periodo = novoPeriodo;
    document.getElementById('btnDiario').className = novoPeriodo === 'diario' ? 'btn btn-primary' : 'btn btn-outline';
    document.getElementById('btnMensal').className = novoPeriodo === 'mensal' ? 'btn btn-primary' : 'btn btn-outline';
    document.getElementById('btnAnual').className = novoPeriodo === 'anual' ? 'btn btn-primary' : 'btn btn-outline';
    atualizarDashboard();
}

function atualizarDashboard() {
    const produtos = JSON.parse(localStorage.getItem('sweetbox_produtos') || '[]');
    const vendas = JSON.parse(localStorage.getItem('sweetbox_vendas') || '[]');
    const hoje = new Date();
    let vendasFiltradas = [];
    let labels = [];
    let dadosVendas = [];
    let dadosReceita = [];

    if (periodo === 'diario') {
        vendasFiltradas = vendas.filter(v => new Date(v.data).toDateString() === hoje.toDateString());
        for (let i = 0; i < 24; i++) {
            labels.push(i + 'h');
            const vendasHora = vendas.filter(v => {
                const d = new Date(v.data);
                return d.toDateString() === hoje.toDateString() && d.getHours() === i;
            });
            dadosVendas.push(vendasHora.length);
            dadosReceita.push(vendasHora.reduce((acc, v) => acc + v.total, 0));
        }
        document.getElementById('tituloVendas').textContent = 'Vendas por Hora';
        document.getElementById('tituloReceita').textContent = 'Receita por Hora';
        document.getElementById('tituloProdutos').textContent = 'Produtos Mais Vendidos - Hoje';
    } else if (periodo === 'mensal') {
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        vendasFiltradas = vendas.filter(v => new Date(v.data) >= inicioMes);
        const diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= diasMes; i++) {
            labels.push(i.toString());
            const vendasDia = vendas.filter(v => {
                const d = new Date(v.data);
                return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear() && d.getDate() === i;
            });
            dadosVendas.push(vendasDia.length);
            dadosReceita.push(vendasDia.reduce((acc, v) => acc + v.total, 0));
        }
        document.getElementById('tituloVendas').textContent = 'Vendas por Dia';
        document.getElementById('tituloReceita').textContent = 'Receita por Dia';
        document.getElementById('tituloProdutos').textContent = 'Produtos Mais Vendidos - Este Mês';
    } else {
        const inicioAno = new Date(hoje.getFullYear(), 0, 1);
        vendasFiltradas = vendas.filter(v => new Date(v.data) >= inicioAno);
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        meses.forEach((mes, i) => {
            labels.push(mes);
            const vendasMes = vendas.filter(v => {
                const d = new Date(v.data);
                return d.getFullYear() === hoje.getFullYear() && d.getMonth() === i;
            });
            dadosVendas.push(vendasMes.length);
            dadosReceita.push(vendasMes.reduce((acc, v) => acc + v.total, 0));
        });
        document.getElementById('tituloVendas').textContent = 'Vendas por Mês';
        document.getElementById('tituloReceita').textContent = 'Receita por Mês';
        document.getElementById('tituloProdutos').textContent = 'Produtos Mais Vendidos - Este Ano';
    }

    const receitaPeriodo = vendasFiltradas.reduce((acc, v) => acc + v.total, 0);
    const baixoEstoque = produtos.filter(p => p.quantidade <= p.estoqueMinimo).length;
    const periodoTexto = { diario: 'Hoje', mensal: 'Este Mês', anual: 'Este Ano' };

    document.getElementById('statsCards').innerHTML = `
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Total de Produtos</p><h3>${produtos.length}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--primary), var(--accent));">
                    <i data-lucide="package" class="icon-lg"></i>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Vendas - ${periodoTexto[periodo]}</p><h3>${vendasFiltradas.length}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--accent), var(--secondary));">
                    <i data-lucide="shopping-cart" class="icon-lg"></i>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Receita - ${periodoTexto[periodo]}</p><h3>R$ ${receitaPeriodo.toFixed(2)}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--secondary), var(--primary));">
                    <i data-lucide="trending-up" class="icon-lg"></i>
                </div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-content">
                <div class="stat-card-info"><p>Estoque Baixo</p><h3>${baixoEstoque}</h3></div>
                <div class="stat-card-icon" style="background: linear-gradient(135deg, var(--destructive), var(--accent));">
                    <i data-lucide="alert-circle" class="icon-lg"></i>
                </div>
            </div>
        </div>
    `;

    if (chartVendas) chartVendas.destroy();
    if (chartReceita) chartReceita.destroy();

    chartVendas = new Chart(document.getElementById('chartVendas'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vendas',
                data: dadosVendas,
                backgroundColor: '#e91e8c',
                borderRadius: 8
            }]
        },
        options: { responsive: true, maintainAspectRatio: true }
    });

    chartReceita = new Chart(document.getElementById('chartReceita'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita (R$)',
                data: dadosReceita,
                borderColor: '#e91e8c',
                backgroundColor: 'rgba(233, 30, 140, 0.1)',
                tension: 0.4,
                fill: true
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

    if (topProdutos.length === 0) {
        document.getElementById('produtosMaisVendidos').innerHTML = '<p class="text-center" style="color: var(--muted-foreground); padding: 2rem;">Nenhuma venda no período</p>';
    } else {
        const cores = ['#e91e8c', '#ff6bb5', '#ffc4dd', '#ff9fd1', '#ffb3db'];
        document.getElementById('produtosMaisVendidos').innerHTML = topProdutos.map((p, i) => `
            <div class="flex-between" style="padding: 0.75rem; background-color: var(--muted); border-radius: 0.5rem; margin-bottom: 0.5rem;">
                <div class="flex gap-2">
                    <div style="width: 1rem; height: 1rem; border-radius: 50%; background-color: ${cores[i]};"></div>
                    <span style="font-weight: 500;">${p.nome}</span>
                </div>
                <span style="font-weight: 700; color: var(--primary);">${p.quantidade} un.</span>
            </div>
        `).join('');
    }

    lucide.createIcons();
}