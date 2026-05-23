package com.example.SweetBox.model;

import jakarta.persistence.Column; // 1. IMPORTADO: Necessário para a nova coluna
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduto;

    private String nomeProduto;
    private String descricao;
    private String categoria;
    private Integer quantidadeProduto;
    private Double valorUnidade;
    private Integer estoqueMin;

    // 2. NOVO ATRIBUTO: Criado logo abaixo dos outros atributos
    @Column(name = "ativo")
    private Boolean ativo = true;


    public Produto(){}

    public Produto(
            Long idProduto,
            String nomeProduto,
            String descricao,
            String categoria,
            Integer quantidadeProduto,
            Double valorUnidade,
            Integer estoqueMin,
            Boolean ativo) {
        this.idProduto = idProduto;
        this.nomeProduto = nomeProduto;
        this.descricao = descricao;
        this.categoria = categoria;
        this.quantidadeProduto = quantidadeProduto;
        this.valorUnidade = valorUnidade;
        this.estoqueMin = estoqueMin;
        this.ativo = ativo;
    }

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

    // 3. NOVO GETTER: Adicionado aqui
    public Boolean getAtivo() {
        return ativo;
    }


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

    // 4. NOVO SETTER: Adicionado aqui no finalzinho
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}