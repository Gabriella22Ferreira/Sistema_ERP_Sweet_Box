package com.example.SweetBox.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
public class Venda {

    @Id // Chave Primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID  automatico
    private Long id;

    private Integer quantidade;
    private Double preco;

    // GETS
    public Long getId() { return id; }
    public Double getPreco() { return preco; }
    public Integer getQuantidade() { return quantidade; }

    //SETS
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public void setPreco(Double preco) { this.preco = preco; }
    public void setId(Long id) { this.id = id; }

}
