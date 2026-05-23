package com.example.SweetBox.service;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Regra para Salvar
    public void salvarNovoProduto(Produto produto) {
        if (produto.getNomeProduto() == null || produto.getNomeProduto().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do produto não pode estar vazio!");
        }
        if (produto.getValorUnidade() == null || produto.getValorUnidade() <= 0) {
            throw new IllegalArgumentException("O preço do produto deve ser maior que zero!");
        }
        if (produto.getQuantidadeProduto() == null || produto.getQuantidadeProduto() < 0) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser negativa!");
        }

        produtoRepository.save(produto);
    }

    // Regra para Listar todos na tabela
    public List<Produto> listarTodosProdutos() {
        return produtoRepository.findAll();
    }

    // BUSCAR POR ID (editar)
    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
    }

    public void deletarProduto(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado!");
        }
        produtoRepository.deleteById(id);
    }

    public Produto atualizarProduto(Long id, Produto produtoAtualizado) {

        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        produtoExistente.setNomeProduto(produtoAtualizado.getNomeProduto());
        produtoExistente.setValorUnidade(produtoAtualizado.getValorUnidade());
        produtoExistente.setQuantidadeProduto(produtoAtualizado.getQuantidadeProduto());

        return produtoRepository.save(produtoExistente);
    }

}
