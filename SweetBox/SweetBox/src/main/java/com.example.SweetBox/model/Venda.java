package com.example.SweetBox.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valorTotal;
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario vendedor;

    // CascadeType.ALL = Quando salvar a Venda, salva os itens do carrinho automaticamente!
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItensVenda> itens = new ArrayList<>();

    public Venda() {
        this.dataHora = LocalDateTime.now();
    }

    // GETS
    public Long getId() { return id; }
    public Double getValorTotal() { return valorTotal; }
    public LocalDateTime getDataHora() { return dataHora; }
    public Usuario getVendedor() { return vendedor; }
    public List<ItensVenda> getItens() { return itens; }

    // SETS
    public void setId(Long id) { this.id = id; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public void setVendedor(Usuario vendedor) { this.vendedor = vendedor; }
    public void setItens(List<ItensVenda> itens) { this.itens = itens; }

    public String getDataHoraFormatada() {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dataHora.format(formatador);
    }
}