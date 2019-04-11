package br.df.brasilia.unb.cic.todeolho.model

class Desordem (
    val id: Int = -1,
    val tipo: Int = -1,
    val descricao: String = "",
    val idOrgao: Int = -1
) {
    override fun toString(): String {
        return descricao
    }
}