package com.example.SweetBox.service;

import com.example.SweetBox.model.Produto;
import com.example.SweetBox.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;
}
