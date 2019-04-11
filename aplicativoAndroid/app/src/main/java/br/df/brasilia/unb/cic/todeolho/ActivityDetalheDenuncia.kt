package br.df.brasilia.unb.cic.todeolho

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import br.df.brasilia.unb.cic.todeolho.model.Denuncia
import br.df.brasilia.unb.cic.todeolho.utils.Constant
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_detalhe_denuncia.*

class ActivityDetalheDenuncia : AppCompatActivity() {
    var denuncia: Denuncia? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalhe_denuncia)
        denuncia = intent.extras["denuncia"] as Denuncia

        detalhe_denuncia_descricao.text = denuncia?.den_descricao
        detalhe_denuncia_desordem.text = denuncia?.des_descricao
        detalhe_denuncia_local.text = "${denuncia?.latitude} ${denuncia?.longitude}"
        detalhe_denuncia_status.text = denuncia?.den_status
        detalhe_denuncia_usuario.visibility = if (denuncia?.den_anonimato == 1) View.VISIBLE else View.GONE
        detalhe_denuncia_usuario.text = denuncia?.usu_nome
        val url = "${Constant().API_URL}denuncia/uploads/${denuncia?.img_idarquivo.toString()}"
        Picasso.get()
                .load(url)
                .resize(150, 150)
                .centerCrop()
                .placeholder(R.drawable.ic_local_see_black_24dp)
                .error(R.drawable.ic_local_see_black_24dp)
                .into(detalhe_denuncia_imagem)
    }
}
