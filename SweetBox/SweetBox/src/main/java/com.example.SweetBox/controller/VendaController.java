package com.example.SweetBox.controller;

import com.example.SweetBox.model.ItensVenda;
import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.model.Venda;
import com.example.SweetBox.repository.ProdutoRepository;
import com.example.SweetBox.repository.VendaRepository;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
public class VendaController {

    @Autowired
    private ProdutoService produtoService;
    @Autowired
    private ProdutoRepository produtoRepository;
    @Autowired
    private VendaRepository vendaRepository;

    // --- TRUQUE MÁGICO: CLASSE PARA RECEBER O JAVASCRIPT ---
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
    // -------------------------------------------------------

    @GetMapping("/vendas")
    public String abrirVendas(Model model, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) return "redirect:/";

        model.addAttribute("usuario", usuarioLogado);
        model.addAttribute("produtos", produtoService.listarTodos());
        return "vendas";
    }





    @PostMapping("/vendas/finalizar")
    public ResponseEntity<String> finalizarCompra(@RequestBody List<CarrinhoItem> itensDoCarrinho, HttpSession session) {
        System.out.println("=> SERVIDOR RECEBEU O PEDIDO DE VENDA!");

        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) return ResponseEntity.status(401).body("Usuário não logado");

        Venda novaVenda = new Venda();
        novaVenda.setVendedor(usuarioLogado);
        Double totalDaVenda = 0.0;

        // Converte o "CarrinhoItem" (Internet) em "ItensVenda" (Banco de Dados)
        for (CarrinhoItem itemInternet : itensDoCarrinho) {

            if(itemInternet.getId() == null) continue; // Pula se vier com erro do JS

            Produto produtoBanco = produtoRepository.findById(itemInternet.getId()).orElse(null);

            if(produtoBanco != null) {
                // 1. Abate estoque
                produtoBanco.setQuantidadeProduto(produtoBanco.getQuantidadeProduto() - itemInternet.getQuantidade());
                produtoRepository.save(produtoBanco);

                // 2. Prepara o item pro banco
                ItensVenda itemBanco = new ItensVenda();
                itemBanco.setProduto(produtoBanco);
                itemBanco.setQuantidade(itemInternet.getQuantidade());
                itemBanco.setPrecoUnitario(itemInternet.getPreco());
                itemBanco.setVenda(novaVenda); // Conecta o item à Venda (Histórico)

                novaVenda.getItens().add(itemBanco); // Guarda na lista
                totalDaVenda += (itemInternet.getPreco() * itemInternet.getQuantidade());
            }
        }

        novaVenda.setValorTotal(totalDaVenda);
        vendaRepository.save(novaVenda); // Salva no banco!

        System.out.println("=> VENDA SALVA NO BANCO! Total: R$ " + totalDaVenda);
        return ResponseEntity.ok("Venda processada com sucesso");
    }






    // 1. Estrutura auxiliar para o histórico viajar leve e limpo até o JavaScript
    public static class HistoricoVendaDTO {
        private Long id;
        private String dataHora;
        private Double valorTotal;
        private String vendedor;
        private List<String> produtos;

        // Getters e Setters
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

    // 2. Rota que lê o histórico completo cruzando as tabelas
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

            // Junta as linhas da tabela itens_venda em textos legíveis
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