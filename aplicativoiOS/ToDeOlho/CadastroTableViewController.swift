//
//  CadastroTableViewController.swift
//  MDD
//
//  Created by Paulo Passos on 13/08/18.
//  Copyright © 2018 paulopassos. All rights reserved.
//

import UIKit
import Alamofire
import CryptoSwift

class CadastroTableViewController: UITableViewController {

    var datePickerIndexPath: IndexPath?
    var pickerVisible: Bool = false
    
    var mapViewController: MapaViewController?
    var storyBoard: UIStoryboard?
    
    @IBOutlet weak var nomeTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var senhaTextField: UITextField!
    @IBOutlet weak var senhaConfirmarTextField: UITextField!
    @IBOutlet weak var cadastrarButton: UIButton!
    
    @IBAction func cadastrar(_ sender: Any) {
        let email = self.emailTextField.text!
        if  !(email.isEmpty){
            if validateEmail(enteredEmail: email){
            //Fazer a verificção de se o text fild senha e confirmação foram preeenchidos
            
                var senha = self.senhaTextField.text!
                var confirmar = self.senhaConfirmarTextField.text!
                
                if senha.isEmpty || confirmar.isEmpty{
                   self.exibirMensagem(titulo: "Campos obrigatórios", mensagem: "Para realizar o cadastro, é obrigatório o preenchimento dos campos senha e confirmação de senha!")
                }else{
                    
                    senha = senha.md5()
                    confirmar = confirmar.md5()
                    
                    if senha == confirmar{
                        print("Senhas iguais!")
                        let login = self.emailTextField.text!
                        let nome = nomeTextField.text!
                        let confia = 0
                        let tipo = 2
                        let parametros: Parameters = ["login": login, "senha": senha, "email": email, "nome": nome, "confia": confia, "tipo": tipo]
                        
                        Alamofire.request(URLs.inserirUsuario, method: .post, parameters: parametros).responseJSON{
                            response in
                            let statusCode = response.response?.statusCode
                            print(statusCode as Any) // the status code
                            
                            print("Success: \(response.result.isSuccess)")
                            print("Response String: \(String(describing: response.result.value!))")
                            
                            guard let json = response.result.value as? [String: Any] else{
                                print("Nao foi possivel obter o objeto de retorno como JSON from API")
                                if let error = response.result.error {
                                    print("Error: \(error)")
                                }
                                return
                            }
                            if let retorno = json["sucesso"] as? String{
                                if  let resposta = json["resposta"] as? String{
                                    if retorno == "true"{
                                        UserDefaults.standard.set(login, forKey: "usuario")
                                        UserDefaults.standard.set(email, forKey: "nomeUsuario")
                                        UserDefaults.standard.set(senha, forKey: "senha")
                                        UserDefaults.standard.set(true, forKey: "usuarioLogado")
                                        
                                        self.exibirMensagemLogin(titulo: "Parabéns!!!", mensagem: "Usuário cadastrado com sucesso")
                                    }
                                    
                                    if retorno == "false" && resposta == "O email já está cadastrado"{
                                        self.exibirMensagem(titulo: "E-mail já cadastrado", mensagem: "Tente inserir outro email, pois o \(email) já está cadastrado no sistema!")
                                    }else{
                                        self.exibirMensagem(titulo: "Erro no cadastro", mensagem: "Algo deu errado no cadastro do usuário, tente em instantes.")
                                        print(resposta)
                                    }
                                } else{
                                    self.exibirMensagem(titulo: "Erro", mensagem: "Erro na conexão com o servidor")
                                    print("Nao foi possivel recuperar o retorno da resposta")
                                }
                            }else{
                                self.exibirMensagem(titulo: "Erro", mensagem: "Erro na conexão com o servidor")
                                print("Nao foi possivel recuperar o retorno do login")
                            }
                            
                            
                            
                        }
                    }else{
                        self.exibirMensagem(titulo: "Dados incorretos", mensagem: "As senhas não estão iguais, digite novamente.")
                    }
                }
            }else{
               self.exibirMensagem(titulo: "Formato de email incorreto", mensagem: "O formato de email está incorreto. Preencha corretamente!")
            }
        }else{
            self.exibirMensagem(titulo: "Campo obrigatório", mensagem: "Para o cadastro, é obrigatório o preenchimento do campo email!")
        }
    }
    
    
    func exibirMensagem(titulo: String, mensagem: String) {
        let alerta = UIAlertController(title: titulo, message: mensagem, preferredStyle: .alert)
        let acaoCancelar = UIAlertAction(title: "ok", style: .default, handler: nil)
        
        alerta.addAction(acaoCancelar)
        present(alerta, animated: true, completion: nil)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
       let tap: UIGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(DismissKeyboard))
        tap.cancelsTouchesInView = false
       view.addGestureRecognizer(tap)
        
        //nascimentoLabel.text = getToday()
    }
    
    @objc func DismissKeyboard(){
        view.endEditing(true)
        
    }
    
    func validateEmail(enteredEmail:String) -> Bool {
        
        let emailFormat = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailFormat)
        return emailPredicate.evaluate(with: enteredEmail)
        
    }
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return 5
        case 1:
            return pickerVisible ? 2 : 1
        default:
            return 1
        }
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.beginUpdates()
        if indexPath.section == 1 && indexPath.row == 0{
            if !pickerVisible{
                tableView.insertRows(at: [IndexPath.init(row: 1, section: 1)], with: .fade)
                pickerVisible = true
            }else{
                tableView.deleteRows(at: [IndexPath.init(row: 1, section: 1)], with: .fade)
                 pickerVisible = false
            }
        }
        tableView.endUpdates()
    }
    
    func exibirMensagemLogin(titulo: String, mensagem: String) {
        let alerta = UIAlertController(title: titulo, message: mensagem, preferredStyle: .alert)
        
        alerta.addAction(UIAlertAction(title: "Ok", style: .default, handler: { action in

                let controller = self.mapViewController
            
            let navController = UINavigationController(rootViewController: controller!)
            navController.navigationBar.barTintColor = UIColor(red: 123, green: 22, blue: 135, alpha: 1.0)
            self.revealViewController().pushFrontViewController(navController, animated: true)

        }))
        self.present(alerta, animated: true, completion: nil)
    }
}
