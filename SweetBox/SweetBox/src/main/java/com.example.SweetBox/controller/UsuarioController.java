package com.example.SweetBox.controller;

import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
        usuarioRepository.save(usuario);
        System.out.println("Usuário salvo no banco com sucesso!");

        return "redirect:/";
    }


}