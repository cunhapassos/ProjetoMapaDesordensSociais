//
//  BarraLateralViewController.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 29/05/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit
import Alamofire
import GoogleSignIn
import FBSDKCoreKit
import FBSDKLoginKit
import SVProgressHUD

class BarraLateralViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, GIDSignInUIDelegate {

    @IBOutlet weak var menuTable: UITableView!
    @IBOutlet weak var nomeUsuarioLabel: UILabel!
    @IBOutlet weak var profile: UIImageView!
    @IBOutlet weak var btControle: UIButton!
    
    var listaDenuncias: [Denuncia]?
    var tipoDenuncia: [String]?
    
    var mapViewController: MapaViewController?
    var desViewController: ListaDesordensTableViewController?
    var sobViewController: SobreViewController?
    var perViewController: FiltrosViewController?
    var dicViewController: DicasViewController?
    var terViewController: TermosDeUsoViewController?
    var entViewController: EntrarViewController?
    var reference: EntrarViewController?
    
    let cellReuseIdentifier = "menuTableViewCell"
    //var menuOptions = ["Mapa", "Desordens", "Perfil", "Dicas de Segurança", "Sobre"]
    var menuOptions = ["Mapa", "Desordens", "Dicas de Segurança", "Termos de uso", "Sobre"]
    let semafaro = DispatchSemaphore(value: 1)

    override func viewDidLoad() {
        super.viewDidLoad()
        
        menuTable.delegate = self
        menuTable.dataSource = self
        
        self.profile.layer.cornerRadius = 10
        self.profile.clipsToBounds = true
        self.profile.layer.borderColor = UIColor.white.cgColor
        self.profile.layer.borderWidth = 4
        
        GIDSignIn.sharedInstance().uiDelegate = self
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        carregarDadosUser()
    }
    
    
    
    func carregarDadosUser() {
        if UserDefaults.standard.bool(forKey: "usuarioLogado"){
            nomeUsuarioLabel.text = UserDefaults.standard.string(forKey: "usuario")
            
            let imgData = UserDefaults.standard.data(forKey: "perfil")
            if imgData != nil{
                self.profile.image = UIImage(data: imgData!)
            }
            else{
                self.profile.image = UIImage(named: "logo.png")
            }
            self.btControle.setTitle("Sair", for: .normal)
        }
        else{
            self.profile.image = UIImage(named: "logo.png")
            self.btControle.setTitle("Entrar", for: .normal)
        }
    }
    
    @IBAction func logout(_ sender: Any) {
        
        if(self.btControle.titleLabel?.text == "Sair"){
            UserDefaults.standard.removeObject(forKey: "usuario")
            UserDefaults.standard.removeObject(forKey: "senha")
            UserDefaults.standard.setValue(false, forKey: "usuarioLogado")
            nomeUsuarioLabel.text = ""
            self.btControle.setTitle("Entrar", for: .normal)
            self.profile.image = UIImage(named: "logo.png")
            
            GIDSignIn.sharedInstance()?.signOut()
            let loginManager = FBSDKLoginManager()
            loginManager.logOut()
            
        }
        else{
            //self.performSegue(withIdentifier: "login", sender: nil)

            if (entViewController == nil){
                self.entViewController = self.storyboard?.instantiateViewController(withIdentifier: "login") as? EntrarViewController
            }
            let controller: EntrarViewController = self.entViewController!
            controller.mapViewController =  self.mapViewController
            controller.storyBoard = self.storyboard
            let navController = UINavigationController(rootViewController: controller)
            navController.navigationBar.barTintColor = UIColor(red: 123, green: 22, blue: 135, alpha: 1.0)
            revealViewController().pushFrontViewController(navController, animated: true)
            
        }
    }
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return menuOptions.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell : MenuTableViewCell = tableView.dequeueReusableCell(withIdentifier: "menuTableViewCell") as! MenuTableViewCell
        
        cell.optionMenu.text = menuOptions[indexPath.row]
        cell.layer.borderColor = UIColor.white.cgColor
        cell.layer.borderWidth = 0.2
        //cell.layer.cornerRadius = 8
        //cell.clipsToBounds = true
        
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        var controller: UIViewController?

        
            // Instantiate controller from story board
        let sb = UIStoryboard(name: "Main", bundle: nil)
        
        switch menuOptions[indexPath.row] {
        case "Mapa":
            if (mapViewController == nil){
                mapViewController = sb.instantiateViewController(withIdentifier: menuOptions[indexPath.row]) as? MapaViewController
            }
            mapViewController?.barraLateral = self
            controller = mapViewController
            
        case "Desordens":
            if (desViewController == nil){
                desViewController = sb.instantiateViewController(withIdentifier: menuOptions[indexPath.row]) as? ListaDesordensTableViewController
            }
            desViewController?.listaDenuncias = self.listaDenuncias
            controller = desViewController!
            
        
        case "Termos de uso":
            if (terViewController == nil){
                terViewController = sb.instantiateViewController(withIdentifier: menuOptions[indexPath.row]) as? TermosDeUsoViewController
            }
            controller = terViewController!
        case "Dicas de Segurança":
            if (dicViewController == nil){
                dicViewController = sb.instantiateViewController(withIdentifier: menuOptions[indexPath.row]) as? DicasViewController
            }
            controller = dicViewController!
            
        case "Sobre":
            if (sobViewController == nil){
                sobViewController = sb.instantiateViewController(withIdentifier: menuOptions[indexPath.row]) as? SobreViewController
            }
            controller = sobViewController!
        default:
            controller = sb.instantiateViewController(withIdentifier: menuOptions[indexPath.row])
        }
        
        let navController = UINavigationController(rootViewController: controller!) 
        navController.navigationBar.barTintColor = UIColor(red: 123, green: 22, blue: 135, alpha: 1.0)
        revealViewController().pushFrontViewController(navController, animated: true)

    }
    
    func exibirMensagem(titulo: String, mensagem: String) {
        let alerta = UIAlertController(title: titulo, message: mensagem, preferredStyle: .alert)
        let acaoCancelar = UIAlertAction(title: "Cancelar", style: .cancel, handler: nil)
        
        alerta.addAction(acaoCancelar)
        present(alerta, animated: true, completion: nil)
    }
}
