package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.model.Venda;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import java.util.List;


@Controller
public class VendaController {

    @Autowired
    public ProdutoService produtoService;


    @PostMapping("/vendas/finalizar")
    public ResponseEntity<String> receberVenda(@RequestBody List<Venda> itensDoCarrinho, HttpSession session) {

        // Verifica se está logado
        Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).body("Usuário não logado");
        }

        // Apenas para testar se chegou no Java!
        System.out.println("=== NOVA VENDA RECEBIDA ===");
        System.out.println("Vendedor: " + usuarioLogado.getNomeCompletoUsuario());
        System.out.println("Total de itens diferentes: " + itensDoCarrinho.size());

        for (Venda item : itensDoCarrinho) {
            System.out.println("ID Produto: " + item.getId() + " | Qtd: " + item.getQuantidade());
        }

        // AQUI NO FUTURO VOCÊ CHAMARÁ O SEU vendaService PARA:
        // 1. Salvar a Venda no Banco
        // 2. Abater a quantidade do Estoque do Produto

        return ResponseEntity.ok("Venda processada com sucesso");
    }


}
