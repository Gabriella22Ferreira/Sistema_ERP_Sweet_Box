package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.service.ProdutoService;
import com.example.SweetBox.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private ProdutoService produtoService;

    // ==========================================
    // ROTAS DE TELA INICIAL E CADASTRO
    // ==========================================

    @GetMapping("/")
    public String entradaInicio(){
        return "index";
    }

    @GetMapping("/cadastro")
    public String abrirTelaDeCadastro(){
        return "cadastro";
    }

    @PostMapping("/cadastro")
    public String cadastrarUsuario(Usuario usuario, org.springframework.ui.Model model){
        try {
            // Tenta
            usuarioService.salvarNovoUsuario(usuario);
            System.out.println("Usuário cadastrado com sucesso!");
            return "redirect:/?sucesso=true";

        } catch (IllegalArgumentException e) {
            // Se rejeitar, mensagem de erro
            model.addAttribute("mensagemErro", e.getMessage());
            // Mantém os dados para não ter que reescrever
            model.addAttribute("usuario", usuario);
            return "cadastro"; // Recarrega exibindo o erro
        }
    }



    // ==========================================
    // ROTA DE LOGIN
    // ==========================================
    @PostMapping("/login")
    public String fazerLogin(@RequestParam String email,
                             @RequestParam String senha,
                             Model model,
                             HttpSession session) {
        try {
            Usuario usuarioLogado = usuarioService.autenticarUsuario(email, senha);
            session.setAttribute("usuarioLogado", usuarioLogado);
            if ("gestor".equals(usuarioLogado.getTipoUsuario())) {
                return "redirect:/dashboard";
            } else {
                return "redirect:/vendas";
            }

        } catch (IllegalArgumentException e) {
            model.addAttribute("erroLogin", e.getMessage());
            return "index";
        }
    }

    // ==========================================
    // ROTAS DO SISTEMA (PÓS-LOGIN)
    // ==========================================

//    @GetMapping("/dashboard")
//    public String abrirDashboard(HttpSession session) {
//        // Bloqueia o acesso se não estiver logado
//        if (session.getAttribute("usuarioLogado") == null) {
//            return "redirect:/";
//        }
//        return "dashboard";
//    }

    //ir para o estoque
    @GetMapping("/estoque")
    public String paginaEstoque() {

        return "estoque";
    }


    // ==========================================
    // ROTA DE LOGOUT (Sair do Sistema)
    // ==========================================
    @GetMapping("/logout")
    public String fazerLogout(jakarta.servlet.http.HttpSession session) {
        // fecha a sessão.
        session.invalidate();

        return "redirect:/";
    }
}