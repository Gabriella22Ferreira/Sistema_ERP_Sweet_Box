package com.example.SweetBox.model;

import jakarta.persistence.*;

@Entity
public class ItensVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItensVenda;

    private Integer quantidade;
    private Double precoUnitario;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "id_venda")
    private Venda venda;

    // GETS
    public Long getIdItensVenda() { return idItensVenda; }
    public Integer getQuantidade() { return quantidade; }
    public Double getPrecoUnitario() { return precoUnitario; }
    public Produto getProduto() { return produto; }
    public Venda getVenda() { return venda; }

    // SETS
    public void setIdItensVenda(Long idItensVenda) { this.idItensVenda = idItensVenda; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
    public void setPrecoUnitario(Double precoUnitario) { this.precoUnitario = precoUnitario; }
    public void setProduto(Produto produto) { this.produto = produto; }
    public void setVenda(Venda venda) { this.venda = venda; }
}