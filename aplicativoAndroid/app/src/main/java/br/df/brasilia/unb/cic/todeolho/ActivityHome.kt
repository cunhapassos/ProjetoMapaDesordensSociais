package br.df.brasilia.unb.cic.todeolho

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.preference.PreferenceManager
import android.view.View
import kotlinx.android.synthetic.main.activity_home.*

class ActivityHome : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        val user = prefs.getString("user", "")
        if (user != null && !user.isEmpty() && !"-".equals(user)) {
            home_login_logout.text = "Sair"
        } else {
            home_login_logout.text = "Entrar"
        }

        home_login_logout.setOnClickListener  {
            val _prefs = PreferenceManager.getDefaultSharedPreferences(this)
            val _user = _prefs.getString("user", "")
            if (_user != null && !_user.isEmpty() && !"-".equals(_user)) {
                val prefs = PreferenceManager.getDefaultSharedPreferences(this)
                val editor = prefs.edit()
                editor.remove("user")
                editor.remove("user_id")
                editor.apply()
                home_login_logout.text = "Entrar"

            } else {
                val intent = Intent(this, ActivityLogin::class.java)
                startActivityForResult(intent, 1)
            }
        }
    }

    fun irParaMapa(v: View) {
        val intent = Intent(this, ActivityMap::class.java)
        startActivity(intent)
    }

    fun adicionarDenuncia(c: View) {
        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        val user = prefs.getString("user", "")
        if (user != null && !user.isEmpty() && !"-".equals(user)) {
            val intent = Intent(this, ActivityAddDisorder::class.java)
            startActivity(intent)
        } else {
            val intent = Intent(this, ActivityLogin::class.java)
            startActivity(intent)
        }
    }

    fun listarDenuncias(c: View) {
        val intent = Intent(this, ActivityToDeOlho::class.java)
        intent.putExtra("page", 0)
        startActivity(intent)
    }

    fun visualisarPerfil(c: View) {

        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        val user = prefs.getString("user", "")
        if (user != null && !user.isEmpty() && !"-".equals(user)) {
            val intent = Intent(this, ActivityToDeOlho::class.java)
            intent.putExtra("page", 1)
            startActivity(intent)
        } else {
            val intent = Intent(this, ActivityLogin::class.java)
            startActivity(intent)
        }
    }
}
