package br.df.brasilia.unb.cic.todeolho

import android.support.v4.app.Fragment
import android.support.v4.app.FragmentStatePagerAdapter

class AdapterPage(fm: android.support.v4.app.FragmentManager) : FragmentStatePagerAdapter(fm) {
    val fragmentsList: MutableList<Fragment> = ArrayList()
    val fragmentTitleList: MutableList<String> = ArrayList()

    fun addFragment(fragment: Fragment, title: String) {
        fragmentsList.add(fragment)
        fragmentTitleList.add(title)
    }

    override fun getItem(position: Int): Fragment {
        return fragmentsList[position]
    }

    override fun getCount(): Int {
        return fragmentsList.size
    }
}