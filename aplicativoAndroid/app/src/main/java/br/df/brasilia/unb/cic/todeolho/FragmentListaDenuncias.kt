package br.df.brasilia.unb.cic.todeolho


import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import br.df.brasilia.unb.cic.todeolho.model.Denuncia
import br.df.brasilia.unb.cic.todeolho.utils.Constant
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import kotlinx.android.synthetic.main.fragment_lista_desordens.*


class FragmentListaDenuncias : Fragment() {

    var rv: RecyclerView? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_lista_desordens, container, false)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        rv = disorder_recicler_view
        rv?.layoutManager = LinearLayoutManager(view.context)
        rv?.adapter = AdapterListaDenuncias(listOf(), view.context)

        recuperaListaDesordens(view)

    }

    fun recuperaListaDesordens(view: View) {
        var arrayDisordem: ArrayList<Denuncia> = ArrayList()
        val queue = Volley.newRequestQueue(view.context)
        val url = "${Constant().API_URL}denunciasComImagens"


        val stringRequest = StringRequest(Request.Method.GET, url,
                Response.Listener<String> { response ->
                    Log.d("alon-mota", response.toString())
                    val denuncias = JsonParser().parse(response).asJsonArray

                    //Toast.makeText(context, denuncias.toString(), Toast.LENGTH_LONG).show()
                    for (i in 0..(denuncias.size() - 1)) {
                        val denuncia = denuncias[i].asJsonObject
                        var denunciaTO = Denuncia(
                                latitude = denuncia["latitude"].asDouble,
                                longitude = denuncia["longitude"].asDouble,
                                den_status = denuncia["den_status"].asString,
                                den_descricao = denuncia["den_descricao"].asString,
                                den_iddenuncia = denuncia["den_iddenuncia"].asInt,
                                den_idusuario = denuncia["den_idusuario"].asInt,
                                den_nivel_confiabilidade = denuncia["den_nivel_confiabilidade"].asInt,
                                den_anonimato = denuncia["den_anonimato"].asInt,
                                usu_nome = denuncia["usu_nome"].asString,
                                des_descricao = denuncia["des_descricao"].asString,
                                img_idarquivo = nullAsString(denuncia["img_idarquivo"]),
                                confirmacao = -1
                        )
                        arrayDisordem.add(denunciaTO)

                    }
                    rv?.adapter = AdapterListaDenuncias(arrayDisordem, view.context)
                },
                Response.ErrorListener {
                    Toast.makeText(view.context, "Algo saiu errado, verifique as permissooes e tente novamente!", Toast.LENGTH_SHORT).show()
                })

        // Add the request to the RequestQueue.
        Log.d("logRequestQueue", "3")
        queue.add(stringRequest)
    }


    val nullAsString = { x: JsonElement ->
        if (x.isJsonNull) "" else x.asString
    }

}
