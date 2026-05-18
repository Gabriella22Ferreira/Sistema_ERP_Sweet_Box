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
            model.addAttribute("produtos", produtoService.listarTodosProdutos());
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
        List<Produto> listaDeProdutos = produtoService.listarTodosProdutos();
        model.addAttribute("produtos", listaDeProdutos);

        return "produtos";
    }


}
