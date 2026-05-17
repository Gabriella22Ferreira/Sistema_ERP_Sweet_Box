package com.example.SweetBox.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity // isso é uma tabela
public class Produto {


    @Id // Chave Primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID  automatico
    private Long id_Produto;

    private String nome_Produto;
    private String descricao;
    private String categoria;
    private int quantidade_Produto ;
    private double valor_Unitario_Produto;
    private int estoque_Min;


    public Produto(){}

    public Produto(
            Long id_Produto,
            String nome_Produto,
            String descricao,
            String categoria,
            int quantidade_Produto,
            double valor_Unitario_Produto,
            int estoque_Min ) {}

    //GETS
    public Long getIdProduto() {
        return id_Produto;
    }

    public String getNomeProduto() {
        return nome_Produto;
    }

    public String getDescricao() { return descricao; }

    public String getCategoria() { return categoria;}

    public int getQntdProduto() {
        return quantidade_Produto;
    }

    public double getValorUnitarioProduto() {
        return valor_Unitario_Produto;
    }

    public int getEstoqueMin() {return estoque_Min; }


    //SETS
    public void setId(Long id_Produto) {
        this.id_Produto = id_Produto;
    }

    public void setNomeProduto(String nome_Produto) {
        this.nome_Produto = nome_Produto;
    }

    public void setDescricao(String descricao) {this.descricao = descricao;}

    public void setCategoria(String categoria) {this.categoria = categoria;}

    public void setQntd_Produto(int quantidade_Produto) {
        this.quantidade_Produto = quantidade_Produto;
    }

    public void setValorUnitarioProduto(double valor_Unitario_Produto) {
        this.valor_Unitario_Produto = valor_Unitario_Produto;
    }

    public void setEstoque_Min(int estoque_Min) {this.estoque_Min = estoque_Min;}

}

