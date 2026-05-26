package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Venda;
import com.example.SweetBox.repository.ItensVendaRepository;
import com.example.SweetBox.repository.ProdutoRepository;
import com.example.SweetBox.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Controller
public class DashController {

    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private VendaRepository vendaRepository;
    @Autowired private ItensVendaRepository itensVendaRepository;

    @GetMapping("/dashboard")
    public String carregarDashboard(Model model, HttpSession session) {
        // Proteção de rota
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        // 1. Total de Produtos
        List<Produto> todosProdutos = produtoRepository.findAll();
        model.addAttribute("totalProdutos", (long) todosProdutos.size());

        // 2. Estoque em Alerta
        long estoqueBaixo = todosProdutos.stream()
                .filter(p -> p.getQuantidadeProduto() != null && p.getEstoqueMin() != null
                        && p.getQuantidadeProduto() <= p.getEstoqueMin())
                .count();
        model.addAttribute("estoqueBaixo", estoqueBaixo);

        // 3. Vendas e 4. Receita
        List<Venda> todasVendas = vendaRepository.findAll();
        model.addAttribute("totalVendas", (long) todasVendas.size());
        model.addAttribute("receitaTotal", todasVendas.stream().mapToDouble(Venda::getValorTotal).sum());

        // 5. Lógica dos Produtos Mais Vendidos
        List<Object[]> resultados = itensVendaRepository.findTopSellingProducts(PageRequest.of(0, 5));
        List<ProdutoMaisVendidoDTO> maisVendidos = resultados.stream()
                .map(obj -> new ProdutoMaisVendidoDTO((String) obj[0], ((Number) obj[1]).longValue()))
                .collect(Collectors.toList());

        model.addAttribute("maisVendidos", maisVendidos);

        return "dashboard";
    }

    // DTO como classe estática interna para organizar
    public static class ProdutoMaisVendidoDTO {
        private String nome;
        private Long quantidade;

        public ProdutoMaisVendidoDTO(String nome, Long quantidade) {
            this.nome = nome;
            this.quantidade = quantidade;
        }
        public String getNome() { return nome; }
        public Long getQuantidade() { return quantidade; }
    }

    @GetMapping("/dashboard/dados")
    @ResponseBody
    public Map<String, Object> getDadosPeriodo(@RequestParam String periodo) {
        List<Venda> todasVendas = vendaRepository.findAll();
        LocalDateTime agora = LocalDateTime.now();

        List<Venda> filtradas = todasVendas.stream().filter(v -> {
            if (v.getDataHora() == null) return false;

            if ("diario".equals(periodo)) {
                return v.getDataHora().toLocalDate().isEqual(agora.toLocalDate());
            } else if ("mensal".equals(periodo)) {
                return v.getDataHora().getMonth() == agora.getMonth()
                        && v.getDataHora().getYear() == agora.getYear();
            } else if ("anual".equals(periodo)) {
                return v.getDataHora().getYear() == agora.getYear();
            }
            return true;
        }).collect(Collectors.toList());

        Map<String, Object> dados = new HashMap<>();
        dados.put("totalVendas", (long) filtradas.size());
        dados.put("receitaTotal", filtradas.stream().mapToDouble(Venda::getValorTotal).sum());

        return dados;
    }
}