// 1. Quando a página carregar, busca o histórico automaticamente
document.addEventListener("DOMContentLoaded", function() {
    carregarEExibirMovimentacoes();
});

// 2. Função unificada: Busca no Java e desenha na tela
function carregarEExibirMovimentacoes() {
    fetch('/estoque/historico')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('movimentacoes');
            if (!container) return; // Segurança

            if (data.length === 0) {
                container.innerHTML = '<p class="text-center" style="color: var(--muted-foreground); padding: 2rem;">Nenhuma movimentação registrada</p>';
                return;
            }

            container.innerHTML = data.map(mov => `
                <div class="card mb-2" style="background-color: var(--muted); padding: 0.75rem;">
                    <div class="flex gap-2 mb-2">
                        <i data-lucide="${mov.tipo === 'entrada' ? 'trending-up' : 'trending-down'}" class="icon"
                           style="color: ${mov.tipo === 'entrada' ? '#10b981' : 'var(--destructive)'};"></i>
                        <div style="flex: 1;">
                            <p style="font-weight: 500; font-size: 0.875rem;">${mov.produtoNome}</p>
                            <p style="font-size: 0.75rem; color: var(--muted-foreground);">
                                ${formatarData(mov.data)}
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

            // Re-renderiza os ícones do Lucide
            lucide.createIcons();
        })
        .catch(err => console.error("Erro ao buscar histórico:", err));
}

// Auxiliar para formatar a data que vem do Java
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// --- Funções de Modal ---
function abrirModal() {
    document.getElementById('entradaForm').reset();
    document.getElementById('modalEntrada').classList.add('active');
}

function fecharModal() {
    document.getElementById('modalEntrada').classList.remove('active');
}

// --- Registro de Entrada ---
document.getElementById('entradaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dados = {
        id: document.getElementById('produtoId').value,
        quantidade: document.getElementById('quantidade').value,
        observacao: document.getElementById('observacao').value
    };

    fetch('/estoque/entrada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (response.ok) {
            alert('Entrada registrada com sucesso!');
            window.location.reload();
        } else {
            alert('Erro ao registrar entrada.');
        }
    });
});