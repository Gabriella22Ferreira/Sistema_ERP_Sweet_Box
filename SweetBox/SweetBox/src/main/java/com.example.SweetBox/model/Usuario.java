package com.example.SweetBox.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity // isso é uma tabela
public class Usuario {

    @Id // Chave Primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID  automatico

    private Long id_Usuario;
    private String nome_Completo_Usuario;
    private String email_Usuario;
    private String senha_Usuario;
    private String tipo_Usuario; //"gestor" ou "funcionario"

    @Transient //NÃO criar uma coluna para isso no banco, só me deixa usar como se tivesse
    private String confirmacao_Senha;

    public Usuario(){}

    public Usuario(Long id_Usuario, String nome_Completo_Usuario, String email_Usuario, String senha_Usuario, String tipo_Usuario) {}


    // GETS
    public Long getIdUsuario() {
        return id_Usuario;
    }

    public String getNomeCompletoUsuario() {
        return nome_Completo_Usuario;
    }

    public String getEmail() {
        return email_Usuario;
    }

    public String getSenha() {
        return senha_Usuario;
    }

    public String getTipoUsuario() {
        return tipo_Usuario;
    }

    public String getConfirmacaoSenha() { return confirmacao_Senha; }



    //SETS
    public void setIdUsuario(Long id_Usuario) {
        this.id_Usuario = id_Usuario;
    }

    public void setNomeCompletoUsuario(String nome_Completo_Usuario) {
        this.nome_Completo_Usuario = nome_Completo_Usuario;
    }

    public void setEmail(String email_Usuario) {
        this.email_Usuario = email_Usuario;
    }

    public void setSenha(String senha_Usuario) {
        this.senha_Usuario = senha_Usuario;
    }

    public void setTipoUsuario(String tipo_Usuario) {
        this.tipo_Usuario = tipo_Usuario;
    }

    public void setConfirmacaoSenha(String confirmacao_Senha) { this.confirmacao_Senha = confirmacao_Senha; }
}

