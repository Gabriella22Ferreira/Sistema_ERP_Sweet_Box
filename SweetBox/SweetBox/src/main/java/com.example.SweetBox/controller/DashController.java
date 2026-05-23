package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Venda;
import com.example.SweetBox.repository.ProdutoRepository;
import com.example.SweetBox.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;
import java.util.List;

@Controller
public class DashController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private VendaRepository vendaRepository;

    @GetMapping("/dashboard")
    public String carregarDashboard(Model model, HttpSession session) {
        // Proteção de rota: só acessa se estiver logado
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        // 1. Total de Produtos
        List<Produto> todosProdutos = produtoRepository.findAll();
        long totalProdutos = todosProdutos.size();

        // 2. Estoque em Alerta (Baseado na lógica do seu arquivo JS original)
        long estoqueBaixo = todosProdutos.stream()
                .filter(p -> p.getQuantidadeProduto() != null && p.getEstoqueMin() != null
                        && p.getQuantidadeProduto() <= p.getEstoqueMin())
                .count();

        // 3. Vendas e 4. Receita
        List<Venda> todasVendas = vendaRepository.findAll();
        long totalVendas = todasVendas.size();

        double receitaTotal = todasVendas.stream()
                .mapToDouble(Venda::getValorTotal) // Usa o método getValorTotal() da sua classe Venda
                .sum();

        // Enviando tudo para o HTML (Thymeleaf)
        model.addAttribute("totalProdutos", totalProdutos);
        model.addAttribute("estoqueBaixo", estoqueBaixo);
        model.addAttribute("totalVendas", totalVendas);
        model.addAttribute("receitaTotal", receitaTotal);

        return "dashboard";
    }
}