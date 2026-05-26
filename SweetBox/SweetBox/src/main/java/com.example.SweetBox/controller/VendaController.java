package com.example.SweetBox.controller;

import com.example.SweetBox.model.*;
import com.example.SweetBox.repository.ProdutoRepository;
import com.example.SweetBox.repository.VendaRepository;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class VendaController {

    @Autowired private ProdutoService produtoService;
    @Autowired private ProdutoRepository produtoRepository;
    @Autowired private VendaRepository vendaRepository;

    public static class CarrinhoItem {
        private Long id;
        private String nome;
        private Integer quantidade;
        private Double preco;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
        public Double getPreco() { return preco; }
        public void setPreco(Double preco) { this.preco = preco; }
    }

    @GetMapping("/vendas")
    public String abrirVendas(Model model, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) return "redirect:/";
        model.addAttribute("usuario", usuarioLogado);
        model.addAttribute("produtos", produtoService.listarTodos());
        return "vendas";
    }

    @PostMapping("/vendas/finalizar")
    @ResponseBody
    @Transactional
    public ResponseEntity<String> finalizarCompra(@RequestBody List<CarrinhoItem> itensDoCarrinho, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) return ResponseEntity.status(401).body("Usuário não logado");

        Venda novaVenda = new Venda();
        novaVenda.setVendedor(usuarioLogado);
        Double totalDaVenda = 0.0;

        try {
            for (CarrinhoItem itemInternet : itensDoCarrinho) {
                // O método abaixo já valida o estoque e subtrai
                produtoService.darBaixaEstoque(itemInternet.getId(), itemInternet.getQuantidade());

                Produto produtoBanco = produtoRepository.findById(itemInternet.getId()).get();

                ItensVenda itemBanco = new ItensVenda();
                itemBanco.setProduto(produtoBanco);
                itemBanco.setQuantidade(itemInternet.getQuantidade());
                itemBanco.setPrecoUnitario(itemInternet.getPreco());
                itemBanco.setVenda(novaVenda);

                novaVenda.getItens().add(itemBanco);
                totalDaVenda += (itemInternet.getPreco() * itemInternet.getQuantidade());
            }

            novaVenda.setValorTotal(totalDaVenda);
            vendaRepository.save(novaVenda);

            return ResponseEntity.ok("Venda processada com sucesso");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    public static class HistoricoVendaDTO {
        private Long id;
        private String dataHora;
        private Double valorTotal;
        private String vendedor;
        private List<String> produtos;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getDataHora() { return dataHora; }
        public void setDataHora(String dataHora) { this.dataHora = dataHora; }
        public Double getValorTotal() { return valorTotal; }
        public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
        public String getVendedor() { return vendedor; }
        public void setVendedor(String vendedor) { this.vendedor = vendedor; }
        public List<String> getProdutos() { return produtos; }
        public void setProdutos(List<String> produtos) { this.produtos = produtos; }
    }

    @GetMapping("/vendas/historico")
    @ResponseBody
    public ResponseEntity<List<HistoricoVendaDTO>> obterHistorico() {
        List<Venda> vendas = vendaRepository.findAll();
        List<HistoricoVendaDTO> listaHistorico = new ArrayList<>();
        for (Venda v : vendas) {
            HistoricoVendaDTO dto = new HistoricoVendaDTO();
            dto.setId(v.getId());
            dto.setDataHora(v.getDataHoraFormatada());
            dto.setValorTotal(v.getValorTotal());
            dto.setVendedor(v.getVendedor() != null ? v.getVendedor().getNomeCompletoUsuario() : "Desconhecido");
            List<String> produtosTexto = new ArrayList<>();
            for (ItensVenda item : v.getItens()) {
                if (item.getProduto() != null) {
                    produtosTexto.add(item.getQuantidade() + "x " + item.getProduto().getNomeProduto());
                }
            }
            dto.setProdutos(produtosTexto);
            listaHistorico.add(dto);
        }
        return ResponseEntity.ok(listaHistorico);
    }
}