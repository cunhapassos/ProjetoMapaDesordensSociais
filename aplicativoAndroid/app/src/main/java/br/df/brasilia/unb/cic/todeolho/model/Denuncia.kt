package br.df.brasilia.unb.cic.todeolho.model

import java.io.Serializable

class Denuncia(
        var latitude: Double?,
        var longitude: Double?,
        var den_status: String?,
        var den_descricao: String?,
        var den_iddenuncia: Int?,
        var den_idusuario: Int?,
        var den_nivel_confiabilidade: Int?,
        var den_anonimato: Int?,
        var usu_nome: String?,
        var des_descricao: String?,
        var img_idarquivo: String?,
        var confirmacao: Int?
): Serializable {
}