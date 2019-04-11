package br.df.brasilia.unb.cic.todeolho

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.preference.PreferenceManager
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import br.df.brasilia.unb.cic.todeolho.model.Denuncia
import br.df.brasilia.unb.cic.todeolho.utils.Constant
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import kotlinx.android.synthetic.main.activity_map.*
import org.osmdroid.events.DelayedMapListener
import org.osmdroid.events.MapListener
import org.osmdroid.events.ScrollEvent
import org.osmdroid.events.ZoomEvent
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.overlay.Marker
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL

class ActivityMap : AppCompatActivity() {

    private var locationManager : LocationManager? = null
    protected val DEFAULT_INACTIVITY_DELAY_IN_MILLISECS: Long = 400
    companion object {
        val REQUEST_ID_MULTIPLE_PERMISSIONS = 3
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map)
        checkAndRequestPermissions()
        locationManager = getSystemService(LOCATION_SERVICE) as LocationManager?

        setUpMap()
    }

    override fun onResume() {
        super.onResume()
        map.invalidate()
    }

    //define the listener
    private val locationListener: LocationListener = object : LocationListener {
        override fun onLocationChanged(location: Location) {
            val startPoint = GeoPoint(location.latitude,  location.longitude)
            val mapController = map.controller
            mapController.setCenter(startPoint)
        }
        override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
        override fun onProviderEnabled(provider: String) {}
        override fun onProviderDisabled(provider: String) {}
    }

    public fun addDenuncia(v: View) {
        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        val user = prefs.getString("user", "")
        if (user != null && !user.isEmpty() && !"-".equals(user)) {
            val intent = Intent(this, ActivityAddDisorder::class.java)
            val position = map.mapCenter as GeoPoint
            intent.putExtra("latitude", position.latitude)
            intent.putExtra("longitude", position.longitude)
            map.invalidate()
            startActivity(intent)
        } else {
            val intent = Intent(this, ActivityLogin::class.java)
            startActivity(intent)
        }
    }

    public fun goBack(v: View) {
        finish()
    }



     // Verifica e solicita permissoes necessarias para abri o mapa
    private fun checkAndRequestPermissions(): Boolean {

        val listPermissionsNeeded = ArrayList<String>()
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET)
                != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.INTERNET)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            listPermissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }

        if (!listPermissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(this, listPermissionsNeeded.toTypedArray(), REQUEST_ID_MULTIPLE_PERMISSIONS)
            return false
        }
        return true
    }

    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<String>, grantResults: IntArray) {
        when (requestCode) {
            REQUEST_ID_MULTIPLE_PERMISSIONS -> {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_DENIED) {
                    Toast.makeText(this, "Internet não permitida, o aplicativo pode nao funcionar como esperado", Toast.LENGTH_LONG).show()
                }

                if (grantResults.isNotEmpty() && grantResults[1] == PackageManager.PERMISSION_DENIED) {
                    Toast.makeText(this, "Acesso a armazenamento não permitido" +
                            ", o aplicativo pode nao funcionar como esperado", Toast.LENGTH_LONG).show()
                }

                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_DENIED) {
                    Toast.makeText(this, "GPS não permitido, o aplicativo pode nao funcionar como esperado", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    fun setUpMap() {
       // Aqui definimos qual vai ser o mapa usado. No caso MAPNIK
        map.setTileSource(TileSourceFactory.MAPNIK)

        // Aqui sao colocados os botoes de zoom
        map.setBuiltInZoomControls(true)
        map.setMultiTouchControls(true)

        // Aqui e definido o ponto central do mapa usando o controler
        val mapController = map.controller

        mapController.setZoom(15.5)
        val startPoint = GeoPoint(-15.7801,  -47.9292)
        mapController.setCenter(startPoint)



        try {
            // Request location updates
            locationManager?.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0L, 0f, locationListener);
        } catch(ex: SecurityException) {
            Toast.makeText(application, "Não foi possivel centralizar o mapa na sua posição. Verifique seu gps", Toast.LENGTH_LONG)
        }
        map.invalidate()

        val map =

        // If there is more than 200 millisecs no zoom/scroll update markers
        map.addMapListener(DelayedMapListener(object: MapListener {
            override fun onScroll(event: ScrollEvent?): Boolean {
                carregaDenuncias()
                return false
            }

            override fun onZoom(event: ZoomEvent?): Boolean {
                carregaDenuncias()
                return false
            }
        }, DEFAULT_INACTIVITY_DELAY_IN_MILLISECS));

        carregaDenuncias()
    }

    fun getBitmapFromURL(src: String): Bitmap? {
        try {
            val url = URL(src)
            val connection = url.openConnection() as HttpURLConnection
            connection.doInput = true
            connection.connect()
            val input = connection.inputStream
            return BitmapFactory.decodeStream(input)
        } catch (e: IOException) {
            // Log exception
            return null
        }

    }

    private fun carregaDenuncias() {
        val queue = Volley.newRequestQueue(this)
        val urlDen = "${Constant().API_URL}denunciasComImagens/${map.mapCenter.latitude}/${map.mapCenter.longitude}"
        map.overlays.clear()
        val stringRequest = StringRequest(Request.Method.GET, urlDen,
                Response.Listener<String> { response ->
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

                        val marker = Marker(map)
                        marker.position = GeoPoint(denunciaTO.latitude!!, denunciaTO.longitude!!)
                        marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                        marker.infoWindow = CustomInfoWindow(map, denunciaTO)
                        marker.title = denunciaTO.des_descricao
                        marker.snippet = denunciaTO.den_descricao
                        marker.image = BitmapDrawable(resources, getBitmapFromURL(denunciaTO.img_idarquivo.toString()))
                        marker.subDescription = denunciaTO.den_status
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            marker.image = getDrawable(R.drawable.person)
                        }


                        map.overlays.add(marker)
                    }


                    map.invalidate()

                },
                Response.ErrorListener {
                    Toast.makeText(this, "Algo saiu errado, verifique as permissooes e tente novamente!", Toast.LENGTH_SHORT).show()
                })
        Log.d("logRequestQueue", "5")
        queue.add(stringRequest)
    }

    val nullAsString = { x: JsonElement ->
        if (x.isJsonNull) "" else x.asString
    }
}
