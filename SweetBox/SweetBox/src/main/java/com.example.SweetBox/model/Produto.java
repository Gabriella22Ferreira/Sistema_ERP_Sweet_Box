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
    private Long idProduto;

    private String nomeProduto;
    private String descricao;
    private String categoria;
    private Integer quantidadeProduto ;
    private Double valorUnidade;
    private Integer estoqueMin;


    public Produto(){}

    public Produto(
            Long idProduto,
            String nomeProduto,
            String descricao,
            String categoria,
            Integer quantidadeProduto,
            Double valorUnidade,
            Integer estoqueMin ) {}

    //GETS
    public Long getIdProduto() {
        return idProduto;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public String getDescricao() { return descricao; }

    public String getCategoria() { return categoria;}

    public Integer getQuantidadeProduto() {
        return quantidadeProduto;
    }

    public Double getValorUnidade() {
        return valorUnidade;
    }

    public Integer getEstoqueMin() {return estoqueMin; }


    //SETS
    public void setIdProduto(Long idProduto) {
        this.idProduto = idProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public void setDescricao(String descricao) {this.descricao = descricao;}

    public void setCategoria(String categoria) {this.categoria = categoria;}

    public void setQuantidadeProduto(Integer quantidadeProduto) {
        this.quantidadeProduto = quantidadeProduto;
    }

    public void setValorUnidade(Double valorUnidade) {
        this.valorUnidade = valorUnidade;
    }

    public void setEstoqueMin(Integer estoqueMin) {this.estoqueMin = estoqueMin;}

}

