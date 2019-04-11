package br.df.brasilia.unb.cic.todeolho

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.preference.PreferenceManager
import android.support.design.widget.NavigationView
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v4.view.GravityCompat
import android.support.v4.view.ViewPager
import android.support.v7.app.ActionBarDrawerToggle
import android.support.v7.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_to_de_olho.*
import kotlinx.android.synthetic.main.app_bar_to_de_olho.*
import kotlinx.android.synthetic.main.content_to_de_olho.*


class ActivityToDeOlho : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private val PERMISSION_INTERNET = 123

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_to_de_olho)
        //setSupportActionBar(toolbar)
        requestPermissions()
        setUpViewPager(container)



        //define acao de acionar o menu
        val toggle = ActionBarDrawerToggle(
                this, drawer_layout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer_layout.addDrawerListener(toggle)
        toggle.syncState()

        nav_view.setNavigationItemSelectedListener(this)
        var page = intent.getIntExtra("page", 0);
        setFragment(page);


    }

    private fun requestPermissions() {
        if(ContextCompat.checkSelfPermission(this, Manifest.permission.INTERNET) == PackageManager.PERMISSION_GRANTED)
            return

        ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.INTERNET), PERMISSION_INTERNET)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        when (requestCode) {
            PERMISSION_INTERNET -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_DENIED)
                    Toast.makeText(this, "Permissao a internet negada, o aplicativo pode não funcionar como esperado", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun setUpViewPager(viewPager: ViewPager) {
        val adapter = AdapterPage(supportFragmentManager)
        adapter.addFragment(FragmentListaDenuncias(), "DisorderList")
//        adapter.addFragment(FragmentForum(), "Forum")
//        adapter.addFragment(FragmentInformacoes(), "Info")
        adapter.addFragment(FragmentPerfil(), "Profile")
//        adapter.addFragment(FragmentConfiguracoes(), "Config")
        viewPager.adapter = adapter
    }

    fun setFragment(page: Int) {
        container.currentItem = page
    }

    override fun onBackPressed() {
        if (drawer_layout.isDrawerOpen(GravityCompat.START)) {
            drawer_layout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.to_de_olho, menu)
        supportActionBar?.hide()
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        when (item.itemId) {
            R.id.action_settings -> return true
            else -> return super.onOptionsItemSelected(item)
        }
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        // Handle navigation view item clicks here.
        when (item.itemId) {
            R.id.nav_map -> {
                val intent = Intent(this, ActivityMap::class.java)
                startActivity(intent)
            }
            R.id.nav_list -> {
                container.currentItem = 0
            }

            R.id.nav_profile -> {
                container.currentItem = 1
            }

            R.id.nav_sair -> {
                val prefs = PreferenceManager.getDefaultSharedPreferences(this)
                val editor = prefs.edit()
                editor.remove("user")
                editor.remove("user_id")
                editor.apply()
                finish()
            }
        }

        drawer_layout.closeDrawer(GravityCompat.START)
        return true
    }
}
