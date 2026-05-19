package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class VendaController {

    @Autowired
    public ProdutoService produtoService;

//    @GetMapping("/vendas")
//    public String abrirJanelaDeVendas(Model model, HttpSession session) {
//        // 1. Verifica se está logado
//        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
//        if (usuarioLogado == null) {
//            return "redirect:/";
//        }
//        model.addAttribute("usuario", usuarioLogado);
//
//
//
//        return "vendas";
//    }
}
