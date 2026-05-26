package com.example.SweetBox.service;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    private Produto produtoPadrao;

    @BeforeEach
    void setUp() {
        produtoPadrao = new Produto();
        produtoPadrao.setIdProduto(1L);
        produtoPadrao.setNomeProduto("Caixa de Trufas");
        produtoPadrao.setQuantidadeProduto(20);
        produtoPadrao.setValorUnidade(45.50);
        produtoPadrao.setAtivo(true);
    }

    @Test
    @DisplayName("Deve salvar produto válido")
    void salvarNovoProduto_ComSucesso() {
        assertDoesNotThrow(() -> produtoService.salvarNovoProduto(produtoPadrao));
        verify(produtoRepository, times(1)).save(produtoPadrao);
    }

    @Test
    @DisplayName("Não deve salvar produto com valor negativo ou zero")
    void salvarNovoProduto_ValorInvalido_DeveLancarExcecao() {
        produtoPadrao.setValorUnidade(0.0);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> produtoService.salvarNovoProduto(produtoPadrao));
        assertEquals("O preço do produto deve ser maior que zero!", ex.getMessage());
    }

    @Test
    @DisplayName("Deve dar baixa no estoque corretamente")
    void darBaixaEstoque_ComSucesso() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoPadrao));

        produtoService.darBaixaEstoque(1L, 5); // Vende 5 (Tinha 20)

        assertEquals(15, produtoPadrao.getQuantidadeProduto());
        verify(produtoRepository, times(1)).save(produtoPadrao);
    }

    @Test
    @DisplayName("Deve impedir baixa se quantidade for maior que o estoque")
    void darBaixaEstoque_EstoqueInsuficiente_DeveLancarExcecao() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoPadrao));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> produtoService.darBaixaEstoque(1L, 25)); // Tenta vender 25 (Tinha 20)

        assertEquals("Estoque insuficiente para o produto: Caixa de Trufas", ex.getMessage());
        assertEquals(20, produtoPadrao.getQuantidadeProduto()); // Estoque não deve alterar
    }
}