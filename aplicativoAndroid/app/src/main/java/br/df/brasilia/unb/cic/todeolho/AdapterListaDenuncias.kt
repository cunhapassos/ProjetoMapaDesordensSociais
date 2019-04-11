package br.df.brasilia.unb.cic.todeolho

import android.content.Context
import android.content.Intent
import android.support.v7.widget.RecyclerView
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import br.df.brasilia.unb.cic.todeolho.model.Denuncia
import br.df.brasilia.unb.cic.todeolho.utils.Constant
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.item_disorder.view.*
import android.preference.PreferenceManager
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.gson.JsonParser
import org.json.JSONException
import org.json.JSONObject


class AdapterListaDenuncias(
        private val desordens: List<Denuncia>,
        private val context: Context
): RecyclerView.Adapter<AdapterListaDenuncias.Holder>() {

    //Holder para cada item
    inner class Holder(item: View): RecyclerView.ViewHolder(item) {
        val desordem = item.rv_disorder_desordem
        val descricao = item.rv_disorder_descricao
        val imagem = item.rv_disorder_image
        val btnLike = item.rv_disorder_validar
        val btnDslike = item.rv_disorder_invalidar

        init {


            item.setOnClickListener {
                var pos = adapterPosition
                if (pos !== RecyclerView.NO_POSITION) {
                    val clickedItem = desordens[pos]
                    val intent = Intent(it.context, ActivityDetalheDenuncia::class.java)
                    intent.putExtra("denuncia", clickedItem)
                    this@AdapterListaDenuncias.context.startActivity(intent)
                }
            }
            btnLike.setOnClickListener {
                var pos = adapterPosition
                if (pos !== RecyclerView.NO_POSITION) {
                    val clickedItem = desordens[pos]
                    this@AdapterListaDenuncias.confirmaDenuncia(it, clickedItem, 1, btnLike, btnDslike)
                }
            }
            btnDslike.setOnClickListener{
                var pos = adapterPosition
                if (pos !== RecyclerView.NO_POSITION) {
                    val clickedItem = desordens[pos]
                    this@AdapterListaDenuncias.confirmaDenuncia(it, clickedItem, 0, btnLike, btnDslike)
                }
            }
        }
//        val status = item.rv_disorder_status
//        val local = item.rv_disorder_local

        fun setValues(_den: Denuncia) {
            this.desordem.text = _den.des_descricao
            this.descricao.text = _den.den_descricao

            val prefs = PreferenceManager.getDefaultSharedPreferences(context)
            val iduser = prefs.getString("user_id", "")

            btnLike.setBackgroundResource(R.drawable.input_border)
            btnDslike.setBackgroundResource(R.drawable.input_border)
            val queue = Volley.newRequestQueue(context)
            val urlC = "${Constant().API_URL}confirmacao/$iduser/${_den.den_iddenuncia}"
            val stringRequest = StringRequest(Request.Method.GET, urlC,
                    Response.Listener<String> { response ->
                        if (response != null && response.isNotEmpty()) {
                            val resp = JsonParser().parse(response).asJsonObject
                            val confim = resp["con_confirmacao"].asInt
                            if(confim == 1) {
                                btnLike.setBackgroundResource(R.drawable.btn_fill)
                            } else if (confim == 0) {
                                btnDslike.setBackgroundResource(R.drawable.btn_fill_negative)
                            }
                        }
                    },
                    Response.ErrorListener {
                        Toast.makeText(context, "Algo saiu errado, verifique as permissooes e tente novamente!", Toast.LENGTH_SHORT).show()
                    })

            // Add the request to the RequestQueue.
            Log.d("logRequestQueue", "4")
            queue.add(stringRequest)



            Log.d("alonmota", "${Constant().API_URL}denuncia/uploads/${_den.img_idarquivo.toString()}")
            val url = "${Constant().API_URL}denuncia/uploads/${_den.img_idarquivo.toString()}"
            Picasso.get()
                    .load(url)
                    .resize(150, 150)
                    .centerCrop()
                    .placeholder(R.drawable.ic_local_see_black_24dp)
                    .error(R.drawable.ic_local_see_black_24dp)
                    .into(imagem)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): Holder {
        val view = LayoutInflater.from(context).inflate(R.layout.item_disorder, parent, false)
        return Holder(view)
    }

    override fun getItemCount(): Int {
        return desordens.size
    }

    override fun onBindViewHolder(holder: Holder, position: Int) {
        val desordem = desordens[position]
        holder.setValues(desordem)
    }

    fun confirmaDenuncia(v: View, den: Denuncia, tipo: Int, btnLike: View, btnDslike: View) {
        try {
            val prefs = PreferenceManager.getDefaultSharedPreferences(v.context)
            val iduser = prefs.getString("user_id", "")

            if (iduser.isNotEmpty()) {
                val body = JSONObject()
                body.put("iddenuncia", den.den_iddenuncia)
                body.put("comentario", "")
                body.put("confirmacao", tipo)
                body.put("idusuario", iduser)

                val requestQueue = Volley.newRequestQueue(v.context)
                val url = "${Constant().API_URL}confirmacao"
                val jsonObj = JsonObjectRequest(Request.Method.POST, url, body,
                        Response.Listener<JSONObject> { response ->
                            if(response.getBoolean("sucesso")) {

                                if (response.getInt("res") == 1){
                                    v.setBackgroundResource(R.drawable.btn_fill)
                                    btnDslike.setBackgroundResource(R.drawable.input_border)
                                }else if (response.getInt("res") == 0){
                                    v.setBackgroundResource(R.drawable.btn_fill_negative)
                                    btnLike.setBackgroundResource(R.drawable.input_border)
                                } else if(response.getInt("res") == -1) {

                                    v.setBackgroundResource(R.drawable.input_border)
                                }


                            } else {
                                Toast.makeText(v.context, "Desculpe, ocorreu um erro!", Toast.LENGTH_SHORT).show()
                            }
                        },
                        Response.ErrorListener { error ->
                            Log.d("RESPONSE", error.toString())
                        }
                )
                Log.d("logRequestQueue", "1")
                requestQueue.add(jsonObj)
            } else {
                val intent = Intent(context, ActivityLogin::class.java)
                this.context.startActivity(intent)
            }

        } catch (e: JSONException) {
            e.printStackTrace()
        }
    }

}