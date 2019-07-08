//
//  DicasViewController.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 05/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class DicasViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var menuButton: UIBarButtonItem!
    @IBOutlet weak var tableDicas: UITableView!
    
    var dicas: Array<String> = ["Mantenha seu dinheiro bem protegido. Se não tiver carteira, use papel ou plástico para envolver as notas",
                                "Bancos são os locais mais seguros para se guardar dinheiro. Não guarde dinheiro e valores em casa",
    "Evite contar dinheiro em público",
    "Ande somente com o dinheiro necessário",
    "Evite abrir sua carteira em público",
    "Conheça os amigos de seus filhos",
    "Não deixe que seus filhos viajem com desconhecidos",
    "Na rua, mantenha todas as crianças à sua vista, de preferência próximas a você",
    "Em caso de tumulto, saia de perto",
    "Se houver necessidade de atendimento médico para alguém, lembre-se que os socorristas precisam de espaço para trabalhar",
    "Desconfie de esbarrões e empurrões e confira seus pertences pessoais",
    "Mantenha seus objetos pessoais, como celulares, carteiras, bolsas à frente de seu corpo",
    "Antes de entrar ou sair de casa, verifique a presença de pessoas estranhas. Na dúvida, avise seus familiares e ligue 190",
    "Tenha a chave de sua casa à mão antes de chegar à porta",
    "Não admita a entrada de estranhos em sua casa",
    "Desconfie de serviços que você não solicitou ou consertos e checagem de problemas que você não observou. Sempre examine as credenciais de qualquer funcionário e confirme todos os dados por telefone com a respectiva empresa. Alerte seus familiares e vizinhos",
    "Não guarde valores em casa. Se preferir usar cofres em sua casa, guarde sigilo quanto a sua existência e localização. Sempre que possível instale mais de um, instalando um deles fora de seus aposentos particulares",
    "Tenha especial atenção em trancar portas e janelas quando você sair de sua casa, mesmo por pequenos intervalos",
    "Tenha um bom relacionamento com os vizinhos e informe-se sobre o que ocorre nas proximidades"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        sideMenu()
        
        tableDicas.delegate = self
        tableDicas.dataSource = self
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.barTintColor =  UIColor(red: 0.48, green: 0.09, blue: 0.53, alpha: 1)
        self.navigationController?.navigationBar.tintColor = UIColor.white
        self.navigationController!.navigationBar.titleTextAttributes = [NSAttributedStringKey.foregroundColor: UIColor.white]
    }
    
    func sideMenu(){
        if self.revealViewController() != nil {
            menuButton.target = self.revealViewController()
            menuButton.action = #selector(SWRevealViewController.revealToggle(_:))
            self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
            self.revealViewController()?.rearViewRevealWidth = 240
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return dicas.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "LabelCell", for: indexPath)
        cell.textLabel?.text = dicas[indexPath.row]
        
        return cell
    }

}
