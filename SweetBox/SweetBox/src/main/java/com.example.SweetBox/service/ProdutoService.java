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

    public List<Produto> listarTodos() {
        return produtoRepository.findByAtivoTrue();
    }

    public void darBaixaEstoque(Long id, Integer quantidadeVendida) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));

        if (produto.getQuantidadeProduto() < quantidadeVendida) {
            throw new IllegalArgumentException("Estoque insuficiente para o produto: " + produto.getNomeProduto());
        }

        produto.setQuantidadeProduto(produto.getQuantidadeProduto() - quantidadeVendida);
        produtoRepository.save(produto);
    }

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

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado!"));
    }

    public void deletarProduto(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    public Produto atualizarProduto(Long id, Produto produtoAtualizado) {
        Produto produtoExistente = buscarPorId(id);
        produtoExistente.setNomeProduto(produtoAtualizado.getNomeProduto());
        produtoExistente.setValorUnidade(produtoAtualizado.getValorUnidade());
        produtoExistente.setQuantidadeProduto(produtoAtualizado.getQuantidadeProduto());
        return produtoRepository.save(produtoExistente);
    }

    public List<Produto> listarExcluidos() {
        return produtoRepository.findByAtivoFalse();
    }

    public void restaurarProduto(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(true);
        produtoRepository.save(produto);
    }
}