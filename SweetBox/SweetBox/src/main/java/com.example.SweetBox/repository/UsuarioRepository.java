package com.example.SweetBox.repository;

import com.example.SweetBox.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // ele já cria o código SQL sozinho para buscar no banco!
    Usuario findByEmail(String email);

}