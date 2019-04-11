package br.df.brasilia.unb.cic.todeolho

import android.widget.ImageView
import br.df.brasilia.unb.cic.todeolho.model.Denuncia
import br.df.brasilia.unb.cic.todeolho.utils.Constant
import com.squareup.picasso.Picasso
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.infowindow.MarkerInfoWindow

class CustomInfoWindow(mapView: MapView, private val den: Denuncia) : MarkerInfoWindow(R.layout.custom_info_window, mapView) {
    override fun onOpen(item: Any?) {
        super.onOpen(item)
        val url = "${Constant().API_URL}denuncia/uploads/${den.img_idarquivo.toString()}"

        Picasso.get()
                .load(url)
                .resize(150, 150)
                .centerCrop()
                .placeholder(R.drawable.ic_local_see_black_24dp)
                .error(R.drawable.ic_local_see_black_24dp)
                .into(getView().findViewById<ImageView>(R.id.bubble_image))
    }
}