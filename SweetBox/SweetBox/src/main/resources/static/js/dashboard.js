// A única função necessária agora é a de trocar o período
function setPeriodo(periodo) {
    // 1. Muda visual dos botões
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('btn-primary'));
    document.getElementById('btn' + periodo.charAt(0).toUpperCase() + periodo.slice(1)).classList.add('btn-primary');

    // 2. Busca os dados no seu Controller Java
    fetch(`/dashboard/dados?periodo=${periodo}`)
        .then(response => response.json())
        .then(data => {
            // 3. Atualiza os números na tela
            document.getElementById('valorVendas').innerText = data.totalVendas;
            document.querySelector('.receita-total-display').nextElementSibling.innerText =
                'R$ ' + data.receitaTotal.toFixed(2).replace('.', ',');
        });
}