package com.example.SweetBox.controller;

//import ch.qos.logback.core.model.Model;
import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;


@Controller
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;


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
    // Abrir em produtos e mostrar produtos em produtos depois do cadastro
    // ==========================================

    @GetMapping("/produtos")
    public String abrirProdutos(Model model, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return "redirect:/";
        }

        // 2. Envia o usuário para a tela (para o menu funcionar)
        model.addAttribute("usuario", usuarioLogado);

        // 3. Busca lista no banco e envia para a tela
        List<Produto> listaDeProdutos = produtoService.listarTodos();
        model.addAttribute("produtos", listaDeProdutos);

        return "produtos";
    }

    @PostMapping("/produtos/atualizar/{id}")
    public String atualizarProduto(@PathVariable Long id, Produto produto, HttpSession session) {

        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        produtoService.atualizarProduto(id, produto);

        return "redirect:/produtos";
    }

    @GetMapping("/produtos/deletar/{id}")
    public String deletar(@PathVariable Long id, HttpSession session) {

        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        produtoService.deletarProduto(id);

        return "redirect:/produtos";
    }

    // NOVO: Abre a página da lixeira e lista os produtos inativos
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

        return "lixeira"; // Vai procurar o arquivo lixeira.html
    }

    // NOVO: Processa a restauração do produto
    @GetMapping("/produtos/restaurar/{id}")
    public String restaurar(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/";
        }

        produtoService.restaurarProduto(id);

        return "redirect:/produtos/lixeira"; // Recarrega a lixeira
    }



    // ==========================================
    // Abrir o Estoque
    // ==========================================
    @GetMapping("/estoque")
    public String abrirEstoque(Model model, HttpSession session) {
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return "redirect:/";
        }

        // 1. Envia o usuário logado para manter o cabeçalho/menu funcionando
        model.addAttribute("usuario", usuarioLogado);

        // 2. Busca todos os produtos do banco e envia para a página
        List<Produto> listaDeProdutos = produtoService.listarTodos();
        model.addAttribute("produtos", listaDeProdutos);

        return "estoque"; // Procura o arquivo estoque.html
    }

}
