package com.example.SweetBox.service;

import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository; // acesso ao repository

    // cadastro validações
    public void salvarNovoUsuario(Usuario usuario) {


    // 1. Validação do Nome
        if (usuario.getNomeCompletoUsuario() == null || usuario.getNomeCompletoUsuario().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome não pode estar vazio!");
        }

        // 2. Validação do Email (Não vazio e precisa conter '@')
        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("O e-mail não pode estar vazio!");
        }
        if (!usuario.getEmail().contains("@")) {
            throw new IllegalArgumentException("O e-mail digitado é inválido (falta o @)!");
        }

        // 3. Validação das Senhas Iguais
        if (usuario.getSenha() == null || usuario.getConfirmacaoSenha() == null) {
            throw new IllegalArgumentException("A senha e a confirmação são obrigatórias!");
        }
        if (!usuario.getSenha().equals(usuario.getConfirmacaoSenha())) {
            throw new IllegalArgumentException("A senha e a confirmação de senha não são iguais!");
        }

        // 4. Requisitos da Senha (Mínimo 8 caracteres, Maiúscula, Minúscula, Número e Especial)
        String senha = usuario.getSenha();

        if (senha.length() < 8) {
            throw new IllegalArgumentException("A senha deve ter no mínimo 8 caracteres!");
        }
        if (!senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra maiúscula!");
        }
        if (!senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra minúscula!");
        }
        if (!senha.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um número!");
        }
        if (!senha.matches(".*[!@#$%^&*].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um caractere especial (!@#$%^&*)!");
        }

        // 5. Validação do Tipo de Usuário (Gestor ou Funcionário)
        if (usuario.getTipoUsuario() == null || usuario.getTipoUsuario().isEmpty()) {
            throw new IllegalArgumentException("Você precisa selecionar se é Gestor ou Funcionário!");
        }

        usuarioRepository.save(usuario);
    }


    // Método de Login
    public Usuario autenticarUsuario(String email, String senha) {
        // 1. Vai no banco e tenta achar o usuário com esse e-mail
        Usuario usuarioEncontrado = usuarioRepository.findByEmail(email);

        // 2. Verifica se o usuário existe
        if (usuarioEncontrado == null) {
            throw new IllegalArgumentException("E-mail não cadastrado no sistema!");
        }

        // 3. Verifica se a senha está correta
        if (!usuarioEncontrado.getSenha().equals(senha)) {
            throw new IllegalArgumentException("Senha incorreta!");
        }

        // Se deu tudo certo, devolve o usuário logado
        return usuarioEncontrado;
    }
}







