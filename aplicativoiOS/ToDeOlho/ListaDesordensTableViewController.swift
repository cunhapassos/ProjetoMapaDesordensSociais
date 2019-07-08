//
//  ListaDesordensViewController.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 30/05/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit
import Alamofire
import SVProgressHUD


class ListaDesordensTableViewController: UITableViewController {
    
    @IBOutlet weak var menuButton: UIBarButtonItem!
    @IBOutlet weak var filterButton: UIBarButtonItem!
    
    var listaDenuncias: [Denuncia]?
    override func viewDidLoad() {
        super.viewDidLoad()
       sideMenu()
        
    }
    
    func sideMenu(){
        if self.revealViewController() != nil {
            menuButton.target = self.revealViewController()
            menuButton.action = #selector(SWRevealViewController.revealToggle(_:))
            
            filterButton.target = self.revealViewController()
            filterButton.action = #selector(SWRevealViewController.rightRevealToggle(_:))
            
            self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
            
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let rightNC = storyboard.instantiateViewController(withIdentifier: "NavFiltrosViewController") as? UINavigationController
            self.revealViewController().rightViewController = rightNC
            
            self.revealViewController().rightViewRevealWidth = UIScreen.main.bounds.size.width - 80
            self.revealViewController().rightViewRevealOverdraw = 0
            self.revealViewController().rightViewRevealDisplacement = 0
        }
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return listaDenuncias?.count ?? 0
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cellDesordem", for: indexPath) as! DenunciaTableViewCell
        
        if let den: Denuncia = self.listaDenuncias?[indexPath.row]  {
            cell.prepareCell(with: den)
            return cell
        }
        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let navigation = self.navigationController{
            let nv = self.storyboard?.instantiateViewController(withIdentifier: "detalhes") as! DenunciaViewController
            nv.denuncia = listaDenuncias?[indexPath.row]
            navigation.pushViewController(nv, animated: true)
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.barTintColor =  UIColor(red: 0.48, green: 0.09, blue: 0.53, alpha: 1)
        self.navigationController?.navigationBar.tintColor = UIColor.white
        self.navigationController!.navigationBar.titleTextAttributes = [NSAttributedStringKey.foregroundColor: UIColor.white]
        tableView.reloadData()
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let vc = segue.destination as! DenunciaViewController
        vc.denuncia = listaDenuncias?[tableView.indexPathForSelectedRow!.row]
    }
    
    
    func exibirMensagem(titulo: String, mensagem: String) {
        let alerta = UIAlertController(title: titulo, message: mensagem, preferredStyle: .alert)
        let acaoCancelar = UIAlertAction(title: "Cancelar", style: .cancel, handler: nil)
        alerta.addAction(acaoCancelar)
        present(alerta, animated: true, completion: nil)
    }

    
}
