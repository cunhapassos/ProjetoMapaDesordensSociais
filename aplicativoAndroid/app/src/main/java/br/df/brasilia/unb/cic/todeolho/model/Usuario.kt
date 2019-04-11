package br.df.brasilia.unb.cic.todeolho.model

import java.io.Serializable

class Usuario(
    var login: String? = null,
    var senha: String? = null,
    var email: String? = null,
    var nascimento: String? = null,
    var cpf: String? = null,
    var nome: String? = null,
    var confia: String? = null,
    var tipo: String? = null,
    var telefone: String? = null
): Serializable {
}