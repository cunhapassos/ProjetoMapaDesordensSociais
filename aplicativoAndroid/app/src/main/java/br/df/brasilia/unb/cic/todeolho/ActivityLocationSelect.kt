package br.df.brasilia.unb.cic.todeolho

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.view.View
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_location_select.*
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint

class ActivityLocationSelect : AppCompatActivity() {
    private var locationManager : LocationManager? = null

    var lat = 0.0
    var long = 0.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_location_select)
        lat = intent.getDoubleExtra("lat", 0.0)
        long = intent.getDoubleExtra("lon", 0.0)
        setUpMap()
        checkAndRequestPermissions()
        locationManager = getSystemService(LOCATION_SERVICE) as LocationManager?
        try {
            // Request location updates
            locationManager?.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0L, 0f, locationListener);
        } catch(ex: SecurityException) {
            Toast.makeText(application, "Não foi possivel centralizar o mapa na sua posição. Verifique seu gps", Toast.LENGTH_LONG)
        }

    }

    //define the listener
    private val locationListener: LocationListener = object : LocationListener {
        override fun onLocationChanged(location: Location) {
            var startPoint = GeoPoint(location.latitude,  location.longitude)
            val mapController = location_select.controller

            if (lat != 0.0) {
                startPoint = GeoPoint(lat, long)
            }
            mapController.setCenter(startPoint)
            location_select.invalidate()
        }
        override fun onStatusChanged(provider: String, status: Int, extras: Bundle) {}
        override fun onProviderEnabled(provider: String) {}
        override fun onProviderDisabled(provider: String) {}
    }

    public fun confirmar(v: View) {
        val intent = Intent();
        val position = location_select.mapCenter as GeoPoint
        intent.putExtra("lat", position.latitude)
        intent.putExtra("lon", position.longitude)
        setResult(Activity.RESULT_OK, intent)
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
            ActivityCompat.requestPermissions(this, listPermissionsNeeded.toTypedArray(), ActivityMap.REQUEST_ID_MULTIPLE_PERMISSIONS)
            return false
        }
        return true
    }

    override fun onRequestPermissionsResult(requestCode: Int,
                                            permissions: Array<String>, grantResults: IntArray) {
        when (requestCode) {
            ActivityMap.REQUEST_ID_MULTIPLE_PERMISSIONS -> {
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
        location_select.setTileSource(TileSourceFactory.MAPNIK)

        // Aqui sao colocados os botoes de zoom
        location_select.setBuiltInZoomControls(true)
        location_select.setMultiTouchControls(true)

        // Aqui e definido o ponto central do mapa usando o controler
        val mapController = location_select.controller
        mapController.setZoom(15.5)
        val startPoint = GeoPoint(-15.7801,  -47.9292)
        mapController.setCenter(startPoint)
        location_select.invalidate()

    }


}
