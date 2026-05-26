// ==========================================
// dashboard.js - Lógica Exclusiva do Painel
// ==========================================

function setPeriodo(periodo) {
    // 1. Muda visual dos botões
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('btn-primary'));
    const btn = document.getElementById('btn' + periodo.charAt(0).toUpperCase() + periodo.slice(1));
    if (btn) {
        btn.classList.add('btn-primary');
    }

    // 2. Busca os dados no seu Controller Java
    fetch(`/dashboard/dados?periodo=${periodo}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar dados');
            return response.json();
        })
        .then(data => {
            // 3. Atualiza os números na tela
            const valorVendas = document.getElementById('valorVendas');
            if (valorVendas) {
                valorVendas.innerText = data.totalVendas;
            }

            const receitaDisplay = document.querySelector('.receita-total-display');
            if (receitaDisplay && receitaDisplay.nextElementSibling) {
                receitaDisplay.nextElementSibling.innerText =
                    'R$ ' + data.receitaTotal.toFixed(2).replace('.', ',');
            }
        })
        .catch(error => {
            console.error("Erro no dashboard:", error);
        });
}