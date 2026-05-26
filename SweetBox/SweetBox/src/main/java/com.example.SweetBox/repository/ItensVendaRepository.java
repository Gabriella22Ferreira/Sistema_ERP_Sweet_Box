package com.example.SweetBox.repository;

import com.example.SweetBox.model.ItensVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ItensVendaRepository extends JpaRepository<ItensVenda, Long> {

    @Query("SELECT i.produto.nomeProduto, SUM(i.quantidade) as total FROM ItensVenda i GROUP BY i.produto.idProduto, i.produto.nomeProduto ORDER BY total DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);
}