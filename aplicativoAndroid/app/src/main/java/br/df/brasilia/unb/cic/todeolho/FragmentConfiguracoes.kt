package br.df.brasilia.unb.cic.todeolho


import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import kotlinx.android.synthetic.main.fragment_configuracoes.*


class FragmentConfiguracoes : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_configuracoes, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        configuracoes_avancado.setOnClickListener{showAdvancedConfigurations(it)}
    }

    public fun showAdvancedConfigurations(v: View) {
        when (configuracoes_avancadas.visibility) {
            View.VISIBLE -> {
                configuracoes_avancadas.visibility = View.GONE
            }
            View.GONE -> {
                configuracoes_avancadas.visibility = View.VISIBLE
            }
        }
    }

}
