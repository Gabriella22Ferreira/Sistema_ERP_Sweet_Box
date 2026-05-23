package com.example.SweetBox.repository;

import com.example.SweetBox.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Não esqueça desse import!

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Cole esta linha aqui dentro:
    List<Produto> findByAtivoTrue();

    List<Produto> findByAtivoFalse();
}