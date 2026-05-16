package com.example.SweetBox.model;

public class Produto {

    private Long id_Produto;

    private String nome_Produto;
    private int qntd_Produto ;
    private double valor_Unitario_Produto;


    public Produto(){}

    public Produto(Long id_Produto,String nome_Produto, int qntd_Produto,double valor_Unitario_Produto){}

    //GETS
    public Long getIdProduto() {
        return id_Produto;
    }

    public String getNomeProduto() {
        return nome_Produto;
    }

    public int getQntdProduto() {
        return qntd_Produto;
    }

    public double getValorUnitarioProduto() {
        return valor_Unitario_Produto;
    }


    //SETS
    public void setId(Long id_Produto) {
        this.id_Produto = id_Produto;
    }

    public void setNomeProduto(String nome_Produto) {
        this.nome_Produto = nome_Produto;
    }

    public void setQntd_Produto(int qntd_Produto) {
        this.qntd_Produto = qntd_Produto;
    }

    public void setValorUnitarioProduto(double valor_Unitario_Produto) {
        this.valor_Unitario_Produto = valor_Unitario_Produto;
    }

}

