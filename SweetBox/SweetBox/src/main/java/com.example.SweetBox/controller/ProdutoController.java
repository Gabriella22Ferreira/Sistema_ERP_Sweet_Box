package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.repository.ProdutoRepository;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import com.example.SweetBox.model.Movimentacao;
import com.example.SweetBox.repository.MovimentacaoRepository;
import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    // ==========================================
    // Cadastro de produtos
    // ==========================================
    @PostMapping("/produtos/cadastrar")
    public String cadastrarProduto(Produto produto, Model model, HttpSession session) {
        if(session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        try{
            produtoService.salvarNovoProduto(produto);
            System.out.println("Produto salvo com sucesso!");
            return "redirect:/produtos?sucesso=true";

        }  catch (IllegalArgumentException e) {
            // Se der erro de validação
            model.addAttribute("mensagemErro", e.getMessage());
            model.addAttribute("produtos", produtoService.listarTodos());
            return "produtos";
        }
    }


    // ==========================================
    // Abrir em produtos e mostrar produtos na tela
    // ==========================================
    @GetMapping("/produtos")
    public String abrirProdutos(Model model, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return "redirect:/";
        }

        // Envia o usuário para a tela (para o menu funcionar)
        model.addAttribute("usuario", usuarioLogado);

        // 1. Busca lista de ATIVOS no banco e envia para os cards
        List<Produto> listaDeProdutos = produtoService.listarTodos();
        model.addAttribute("produtos", listaDeProdutos);

        // 2. Busca lista de EXCLUÍDOS no banco e envia para o MODAL da lixeira
        List<Produto> excluidos = produtoService.listarExcluidos();
        model.addAttribute("produtosExcluidos", excluidos);

        return "produtos";
    }


    // ==========================================
    // Atualizar Produto (Rota ajustada para /editar)
    // ==========================================
    @PostMapping("/produtos/editar/{id}")
    public String atualizarProduto(@PathVariable Long id, Produto produto, HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        produtoService.atualizarProduto(id, produto);
        return "redirect:/produtos";
    }

    // ==========================================
    // Deletar Produto (Rota ajustada para /excluir)
    // ==========================================
    @GetMapping("/produtos/excluir/{id}")
    public String deletar(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        produtoService.deletarProduto(id);
        return "redirect:/produtos";
    }

    // ==========================================
    // Lixeira e Restauração
    // ==========================================



    @GetMapping("/produtos/lixeira")
    public String abrirLixeira(Model model, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return "redirect:/";
        }

        model.addAttribute("usuario", usuarioLogado);

        // Busca apenas os deletados (ativo = false)
        List<Produto> excluidos = produtoService.listarExcluidos();
        model.addAttribute("produtosExcluidos", excluidos);

        return "lixeira";
    }

    // ==========================================
    // Restauração
    // ==========================================
    @GetMapping("/produtos/restaurar/{id}")
    public String restaurar(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        produtoService.restaurarProduto(id);

        // Redireciona de volta para a página de produtos (onde está o modal)
        return "redirect:/produtos";
    }

    // ==========================================
    // Abrir o Estoque (Código limpo)
    // ==========================================
    @GetMapping("/estoque")
    public String abrirEstoque(Model model, HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        // Puxa do banco e manda pro HTML uma vez só
        List<Produto> listaDeProdutos = produtoService.listarTodos();
        model.addAttribute("produtos", listaDeProdutos);

        return "estoque";
    }


    @PostMapping("/estoque/entrada")
    @ResponseBody
    public ResponseEntity<String> registrarEntrada(@RequestBody Map<String, String> payload) {
        Long id = Long.parseLong(payload.get("id"));
        int qtd = Integer.parseInt(payload.get("quantidade"));
        String obs = payload.get("observacao");

        Produto produto = produtoRepository.findById(id).orElse(null);
        if (produto == null) return ResponseEntity.badRequest().body("Produto não encontrado");

        // 1. Atualiza estoque
        produto.setQuantidadeProduto(produto.getQuantidadeProduto() + qtd);
        produtoRepository.save(produto);

        // 2. Registra a Movimentação (Histórico)
        Movimentacao mov = new Movimentacao();
        mov.setProdutoNome(produto.getNomeProduto());
        mov.setQuantidade(qtd);
        mov.setTipo("entrada");
        mov.setData(LocalDateTime.now());
        mov.setObservacao(obs);
        movimentacaoRepository.save(mov);

        return ResponseEntity.ok("Entrada registrada!");
    }

    @GetMapping("/estoque/historico")
    @ResponseBody
    public List<Movimentacao> buscarHistorico() {
        return movimentacaoRepository.findAllByOrderByDataDesc();
    }

}
