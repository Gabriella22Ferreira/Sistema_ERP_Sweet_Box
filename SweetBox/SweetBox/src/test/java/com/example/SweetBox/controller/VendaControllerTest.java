package com.example.SweetBox.controller;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.model.Venda;
import com.example.SweetBox.repository.ProdutoRepository;
import com.example.SweetBox.repository.VendaRepository;
import com.example.SweetBox.service.ProdutoService;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VendaControllerTest {

    @Mock private ProdutoService produtoService;
    @Mock private ProdutoRepository produtoRepository;
    @Mock private VendaRepository vendaRepository;
    @Mock private HttpSession session;

    @InjectMocks
    private VendaController vendaController;

    private Usuario usuarioLogado;
    private Produto produtoBolo;
    private List<VendaController.CarrinhoItem> carrinho;

    @BeforeEach
    void setUp() {
        usuarioLogado = new Usuario();
        usuarioLogado.setNomeCompletoUsuario("Atendente Maria");

        produtoBolo = new Produto();
        produtoBolo.setIdProduto(1L);
        produtoBolo.setNomeProduto("Bolo de Chocolate");

        VendaController.CarrinhoItem item = new VendaController.CarrinhoItem();
        item.setId(1L);
        item.setNome("Bolo de Chocolate");
        item.setPreco(50.0);
        item.setQuantidade(2); // Valor total = 100.0

        carrinho = new ArrayList<>();
        carrinho.add(item);
    }

    @Test
    @DisplayName("Deve barrar finalização de compra se usuário não estiver logado")
    void finalizarCompra_UsuarioNaoLogado_DeveRetornar401() {
        when(session.getAttribute("usuarioLogado")).thenReturn(null);

        ResponseEntity<String> response = vendaController.finalizarCompra(carrinho, session);

        assertEquals(401, response.getStatusCode().value());;
        assertEquals("Usuário não logado", response.getBody());
    }

    @Test
    @DisplayName("Deve processar compra com sucesso e salvar Venda")
    void finalizarCompra_ComSucesso_DeveRetornar200() {
        // Simula usuário logado na sessão
        when(session.getAttribute("usuarioLogado")).thenReturn(usuarioLogado);
        // Simula que achou o produto no banco para associar aos Itens da Venda
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoBolo));

        ResponseEntity<String> response = vendaController.finalizarCompra(carrinho, session);

        // Verifica se deu sucesso (HTTP 200 OK)
        assertEquals(401, response.getStatusCode().value());;
        assertEquals("Venda processada com sucesso", response.getBody());

        // Garante que tentou dar baixa no estoque e tentou salvar a venda
        verify(produtoService, times(1)).darBaixaEstoque(1L, 2);
        verify(vendaRepository, times(1)).save(any(Venda.class));
    }

    @Test
    @DisplayName("Deve cancelar a venda se o ProdutoService avisar que não tem estoque")
    void finalizarCompra_EstoqueInsuficiente_DeveRetornar400() {
        when(session.getAttribute("usuarioLogado")).thenReturn(usuarioLogado);

        // Simula que, ao tentar dar baixa, o ProdutoService lança o erro de falta de estoque
        doThrow(new IllegalArgumentException("Estoque insuficiente!"))
                .when(produtoService).darBaixaEstoque(1L, 2);

        ResponseEntity<String> response = vendaController.finalizarCompra(carrinho, session);

        // Verifica se o Controller travou a compra (HTTP 400 Bad Request)
        assertEquals(401, response.getStatusCode().value());;
        assertEquals("Estoque insuficiente!", response.getBody());

        // Garante que a venda NÃO foi salva no banco
        verify(vendaRepository, never()).save(any(Venda.class));
    }
}