//
//  PerfilViewController.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 30/05/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit
import SVProgressHUD


class FiltrosViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    var pkDataVisible: Bool = false
    var pkStatusVisible: Bool = false
    var pkNaturezaVisible: Bool = false
    
    var mapaView: MapaViewController?
    var barraLateral: BarraLateralViewController?
    var sections = ["Período", "Tipo de desordem", "Status"]
    
    var lbStatus: UILabel?
    var lbDataIni: UILabel?
    var lbDataFim: UILabel?
    var lbNatureza: UILabel?
    
    @IBOutlet weak var menuTable: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.barraLateral = revealViewController().rearViewController as? BarraLateralViewController
        self.mapaView = self.barraLateral?.mapViewController
        
       navigationController?.setNavigationBarHidden(true, animated: false)
        
        menuTable.delegate = self
        menuTable.dataSource = self
        
    }
    func numberOfSections(in tableView: UITableView) -> Int {
            return self.sections.count
    }
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        let st = self.sections[section]
        return st
    }
    
    func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int){
        view.tintColor = UIColor(red:0.38, green:0.46, blue:0.48, alpha:0.4)
        let header = view as! UITableViewHeaderFooterView
        header.textLabel?.textColor = UIColor.white
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return pkDataVisible ? 3 : 2
        case 1:
            return pkNaturezaVisible ? 2 : 1
        case 2:
            return pkStatusVisible ? 3 : 2
            
        default:
            return 0
        }
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        tableView.beginUpdates()
        switch indexPath.section {
        case 0:
            if indexPath.row == 0{
                if !pkDataVisible{
                    tableView.insertRows(at: [IndexPath.init(row: 2, section: 0) ], with: .fade)
                    pkDataVisible = true
                }else{
                    tableView.deleteRows(at: [IndexPath.init(row: 2, section: 0) ], with: .fade)
                    pkDataVisible = false
                }
            }
            if indexPath.row == 1{
                if !pkDataVisible{
                    tableView.insertRows(at: [IndexPath.init(row: 2, section: 0) ], with: .fade)
                    pkDataVisible = true

                }else{
                    tableView.deleteRows(at: [IndexPath.init(row: 2, section: 0) ], with: .fade)
                    pkDataVisible = false
                }
            }
            break
        case 1:
            if indexPath.row == 0{
                if !pkNaturezaVisible{
                    tableView.insertRows(at: [IndexPath.init(row: 1, section: 1) ], with: .fade)
                    pkNaturezaVisible = true
                }else{
                    tableView.deleteRows(at: [IndexPath.init(row: 1, section: 1) ], with: .fade)
                    pkNaturezaVisible = false
                }
            }
            break
        case 2:
            if indexPath.row == 0{
                if !pkStatusVisible{
                    tableView.insertRows(at: [IndexPath.init(row: 1, section: 2) ], with: .fade)
                    pkStatusVisible = true
                }else{
                    tableView.deleteRows(at: [IndexPath.init(row: 1, section: 2) ], with: .fade)
                    pkStatusVisible = false
                }
            }
            break
        default: break
        }
        
        tableView.endUpdates()
        
        switch indexPath.section {
        case 0:
            if indexPath.row == 0 && pkDataVisible{
                let cell1 = tableView.cellForRow(at: IndexPath(item: 0, section: 0))
                let cell2: FiltroPkDataTableViewCell = tableView.cellForRow(at: IndexPath(item: 2, section: 0)) as! FiltroPkDataTableViewCell
                cell2.lbDataIni = cell1?.detailTextLabel
                cell2.aux = true
                //cell2.pkDataIni.isHidden =
                // COLOCAR OS ISHIDDEN PARA OS PICKERS
            }
            if indexPath.row == 1 && pkDataVisible{
                let cell1 = tableView.cellForRow(at: IndexPath(item: 1, section: 0))
                let cell2: FiltroPkDataTableViewCell = tableView.cellForRow(at: IndexPath(item: 2, section: 0)) as! FiltroPkDataTableViewCell
                cell2.lbDataFim = cell1?.detailTextLabel
                cell2.aux = false
            }
        default:
            break
        }
        
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        var cell : UITableViewCell!
        
        switch indexPath.section {
        case 0:
            switch indexPath.row{
            case 0:
                cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
                cell.textLabel?.text = "Data inicial:"
                cell.detailTextLabel?.text = getToday()
                self.lbDataIni = cell.detailTextLabel
                break
            case 1:
                cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
                cell.textLabel?.text = "Data final:"
                cell.detailTextLabel?.text = getToday()
                self.lbDataFim = cell.detailTextLabel
                break
            case 2:
                let pkcell : FiltroPkDataTableViewCell = tableView.dequeueReusableCell(withIdentifier: "pickerCell") as! FiltroPkDataTableViewCell
                cell = pkcell
            default:
                break
            }

        case 1:
            if indexPath.row == 1 {
                let cell1 = tableView.cellForRow(at: IndexPath(item: 0, section: 1))
                let pkcell : FiltroPkNaturezaTableViewCell = tableView.dequeueReusableCell(withIdentifier: "pkNaturezaCell") as! FiltroPkNaturezaTableViewCell
                pkcell.lbNatureza = cell1?.detailTextLabel
                
                var aux = self.barraLateral?.tipoDenuncia
                aux?.insert("Todos os tipos", at: 0)
                
                pkcell.listaTiposDenuncias = aux
                cell = pkcell
            }else{
                cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
                cell.detailTextLabel?.text = "Todos os tipos"
                cell.textLabel?.isHidden = true
                self.lbNatureza = cell.detailTextLabel
            }
        case 2:
            if indexPath.row == 0 {
                cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
                cell.detailTextLabel?.text = "Todos os status"
                cell.textLabel?.isHidden = true
                self.lbStatus = cell.detailTextLabel
            } else if indexPath.row == 1 && pkStatusVisible {
                let cell1 = tableView.cellForRow(at: IndexPath(item: 0, section: 2))
                let pkcell : FiltroPkStatusTableViewCell = tableView.dequeueReusableCell(withIdentifier: "pkStatusCell") as! FiltroPkStatusTableViewCell
                pkcell.lbStatus = cell1?.detailTextLabel
                cell = pkcell
            }else{
                cell = tableView.dequeueReusableCell(withIdentifier: "btCell")!
            }
        default:
            cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
        }
        
        return cell
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        var height:CGFloat = CGFloat()
        switch indexPath.section {
        case 0:
            if indexPath.row == 2 {
                height = 117
            }else{
                height = 57
            }
        case 1:
            if indexPath.row == 1 {
                height = 117
            }else{
                height = 57
            }
        case 2:
            if indexPath.row == 1 && pkStatusVisible{
                height = 117
            }else{
                height = 57
            }
        default:
            height = 57
        }
        return height
    }
    
    func getToday() -> String{
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "dd/MM/yyyy"
        let today = dateFormatter.string(from: Date(timeInterval: 0, since: Date()))
        
        return today
    }
    
    @IBAction func solicitarDenuncias(_ sender: Any) {
        //print("dtIni: \(lbDataIni?.text), dtFim: \(lbDataFim?.text), Nature: \(lbNatureza?.text), Status: \(lbStatus?.text)")
        
        let status = lbStatus?.text
        let dataIni = lbDataIni?.text
        let dataFim = lbDataFim?.text
        let natureza = lbNatureza?.text
        
        
        //print(dataIni)
        //print(status)
        self.mapaView?.status = status
        self.mapaView?.dataIni = formatarData(data: dataIni!)
        self.mapaView?.dataFim = formatarData(data: dataFim!)
        self.mapaView?.natureza = natureza

        self.mapaView?.recuperarDesordensPorArea(mapView: self.mapaView!.mapView, completion: { (denuncias) in
            print("Conferido 1")
            if ((self.barraLateral?.listaDenuncias = denuncias) != nil){
                if self.barraLateral != nil {
                    if self.barraLateral!.desViewController != nil {
                        self.barraLateral?.desViewController?.listaDenuncias = denuncias
                        self.barraLateral?.desViewController?.tableView.reloadData()
                        print("Conferido 2")
                    }
                }
                
                
            }
            if ((self.mapaView?.apresentarDenunciasMapa(listaDenuncias: self.barraLateral!.listaDenuncias!)) != nil){
                print("Conferido 3")
            }
            
        })
        
        if (self.revealViewController()?.rightRevealToggle(animated: true) != nil){
            print("Conferido 4")
        }


        

    }
    
    func formatarData(data: String) -> String{
        
        let formatarData = DateFormatter()
        formatarData.dateFormat = "dd/MM/yyyy"
        
        if let data = formatarData.date(from: data){
            formatarData.dateFormat = "yyyy-MM-dd"
            return formatarData.string(from: data)
        } else {
            return ""
        }
    }
    
}
