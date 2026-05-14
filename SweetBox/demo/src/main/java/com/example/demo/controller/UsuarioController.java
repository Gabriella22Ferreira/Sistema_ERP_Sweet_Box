package com.example.demo.controller;

import com.example.demo.modal.Usuario;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UsuarioController {

    @GetMapping("/")
    public String entradaInicio(){
        return "index";
    }

    @GetMapping("/cadastro")
    public String abrirTelaDeCadastro(){
        return "cadastro";
    }

    @PostMapping("/cadastro")
    public String cadastrarUsuario(Usuario usuario){
        System.out.println("Usuário cadastrado: " + usuario.getNomeCompletoUsuario());
        return "redirect:/index";
    }
}
