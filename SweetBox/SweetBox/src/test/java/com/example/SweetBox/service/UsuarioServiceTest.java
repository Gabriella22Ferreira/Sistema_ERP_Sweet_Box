package com.example.SweetBox.service;

import com.example.SweetBox.model.Usuario;
import com.example.SweetBox.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioValido;

    @BeforeEach
    void setUp() {
        usuarioValido = new Usuario();
        usuarioValido.setNomeCompletoUsuario("João da Silva");
        usuarioValido.setEmail("joao@sweetbox.com");
        usuarioValido.setSenha("SenhaForte123!");
        usuarioValido.setConfirmacaoSenha("SenhaForte123!");
        usuarioValido.setTipoUsuario("Gestor");
    }

    @Test
    @DisplayName("Deve salvar usuário com todos os dados corretos")
    void salvarNovoUsuario_ComSucesso() {
        when(usuarioRepository.findByEmail(usuarioValido.getEmail())).thenReturn(null);

        assertDoesNotThrow(() -> usuarioService.salvarNovoUsuario(usuarioValido));
        verify(usuarioRepository, times(1)).save(usuarioValido);
    }

    @Test
    @DisplayName("Não deve salvar usuário com e-mail sem @")
    void salvarNovoUsuario_EmailInvalido_DeveLancarExcecao() {
        usuarioValido.setEmail("joaosweetbox.com"); // Faltando @

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> usuarioService.salvarNovoUsuario(usuarioValido));
        assertEquals("O e-mail digitado é inválido (falta o @)!", ex.getMessage());
    }

    @Test
    @DisplayName("Não deve salvar se a senha e a confirmação forem diferentes")
    void salvarNovoUsuario_SenhasDiferentes_DeveLancarExcecao() {
        usuarioValido.setConfirmacaoSenha("SenhaDiferente123!");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> usuarioService.salvarNovoUsuario(usuarioValido));
        assertEquals("A senha e a confirmação de senha não são iguais!", ex.getMessage());
    }

    @Test
    @DisplayName("Deve autenticar usuário com credenciais corretas")
    void autenticarUsuario_ComSucesso() {
        when(usuarioRepository.findByEmail("joao@sweetbox.com")).thenReturn(usuarioValido);

        Usuario logado = usuarioService.autenticarUsuario("joao@sweetbox.com", "SenhaForte123!");

        assertNotNull(logado);
        assertEquals("João da Silva", logado.getNomeCompletoUsuario());
    }

    @Test
    @DisplayName("Deve recusar login com senha errada")
    void autenticarUsuario_SenhaIncorreta_DeveLancarExcecao() {
        when(usuarioRepository.findByEmail("joao@sweetbox.com")).thenReturn(usuarioValido);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> usuarioService.autenticarUsuario("joao@sweetbox.com", "SenhaErrada"));
        assertEquals("Senha incorreta!", ex.getMessage());
    }
}