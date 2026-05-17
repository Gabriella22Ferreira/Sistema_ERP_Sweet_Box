package com.example.SweetBox.controller;

import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import jakarta.servlet.http.HttpSession;

@Controller
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

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
            // Tenta salvar usando as regras do Service
            usuarioService.salvarNovoUsuario(usuario);
            System.out.println("Usuário cadastrado com sucesso!");
            return "redirect:/?sucesso=true";

        } catch (IllegalArgumentException e) {
            // Se o Service rejeitar, pegamos a mensagem de erro
            model.addAttribute("mensagemErro", e.getMessage());
            // Mantém os dados que o usuário já digitou para ele não ter que reescrever tudo
            model.addAttribute("usuario", usuario);
            return "cadastro"; // Recarrega a própria página de cadastro exibindo o erro
        }
    }

    @PostMapping("/login")
    public String fazerLogin(@org.springframework.web.bind.annotation.RequestParam String email,
                             @org.springframework.web.bind.annotation.RequestParam String senha,
                             org.springframework.ui.Model model,
                             jakarta.servlet.http.HttpSession session) {
        try {
            // Tenta autenticar usando o Service
            Usuario usuarioLogado = usuarioService.autenticarUsuario(email, senha);

            // Salva o usuário na Sessão (O navegador agora "lembra" dele)
            session.setAttribute("usuarioLogado", usuarioLogado);

            // Redireciona dependendo do cargo
            if ("gestor".equals(usuarioLogado.getTipoUsuario())) {
                return "redirect:/dashboard.html"; // Mude para a rota correta do seu dashboard depois
            } else {
                return "redirect:/vendas.html"; // Mude para a rota correta de vendas depois
            }

        } catch (IllegalArgumentException e) {
            // Se errar a senha ou email, devolve a mensagem de erro para a tela de login
            model.addAttribute("erroLogin", e.getMessage());
            return "index"; // Recarrega a tela de login
        }
    }


}