package br.df.brasilia.unb.cic.todeolho


import android.os.Bundle
import android.preference.PreferenceManager
import android.support.v4.app.Fragment
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import br.df.brasilia.unb.cic.todeolho.utils.Constant
import com.google.gson.JsonParser
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.fragment_perfil.*


class FragmentPerfil : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_perfil, container, false)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val prefs = PreferenceManager.getDefaultSharedPreferences(view.context)
        val user = prefs.getString("user_id", "")

        val queue = Volley.newRequestQueue(view.context)
        val urlDen = "${Constant().API_URL}usuarioComImagem/$user"


        val stringRequest = StringRequest(Request.Method.GET, urlDen,
                Response.Listener<String> { response ->
                    val usuarios = JsonParser().parse(response).asJsonArray
                    val usuario = usuarios[0].asJsonObject


                        perfil_email.text = usuario["usu_email"].asString
                        perfil_nome.text = usuario["usu_nome"].asString
                        perfil_telefone.text = usuario["usu_telefone"].asString
                        perfil_confiabilidade.text = usuario["usu_confiabilidade"].asString
                        var id = usuario["fot_idfoto"].toString()
                        id = id.replace("\"", "")

                        val url = "${Constant().API_URL}usuario/uploads/$id"
                        Log.d("resp_alon", url)
                        Picasso.get()
                                .load(url)
                                .resize(200, 200)
                                .centerCrop()
                                .placeholder(R.drawable.ic_person_black_24dp)
                                .error(R.drawable.ic_person_black_24dp)
                                .into(perfil_foto)


                },
                Response.ErrorListener {
                    Toast.makeText(view.context, "Algo saiu errado, verifique sua conexao e tente novamente!", Toast.LENGTH_SHORT).show()
                })
        Log.d("logRequestQueue", "2")
        queue.add(stringRequest)
    }


}
