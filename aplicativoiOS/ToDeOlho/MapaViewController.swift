//
//  ViewController.swift
//  MDD
//
//  Created by Paulo Passos on 25/07/18.
//  Copyright © 2018 paulopassos. All rights reserved.

import UIKit
import MapKit
import Alamofire
import SVProgressHUD

class MapaViewController: UIViewController, MKMapViewDelegate, CLLocationManagerDelegate {
    
    @IBOutlet weak var mapView: MKMapView!
    @IBOutlet weak var menuButton: UIBarButtonItem!
    @IBOutlet weak var filterButton: UIBarButtonItem!
    @IBOutlet weak var addButton: UIButton!
    
    var status: String?
    var dataIni: String?
    var dataFim: String?
    var natureza: String?
    
    var barraLateral: BarraLateralViewController?

    let locationManager = CLLocationManager()
    var cnt: Int = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.mapView.delegate           = self
        locationManager.delegate        = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        
        let template                        = URLs.openstreetmap // Buscando openstreetmap
        let carte_indice                    = MKTileOverlay(urlTemplate: template)
        carte_indice.canReplaceMapContent   = true
        self.mapView.add(carte_indice)
        
        
        configurarAddButton()
        
        let sb = UIStoryboard(name: "Main", bundle: nil)
        self.barraLateral = sb.instantiateViewController(withIdentifier: "barraLateral") as? BarraLateralViewController
        self.barraLateral?.mapViewController = self
        sideMenu()
        
        listarTiposDenuncia { (tiposDenuncias) in
            self.barraLateral?.tipoDenuncia = tiposDenuncias
        }

    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.barTintColor =  UIColor(red: 0.48, green: 0.09, blue: 0.53, alpha: 1)
        self.navigationController?.navigationBar.tintColor = UIColor.white
        self.navigationController!.navigationBar.titleTextAttributes = [NSAttributedStringKey.foregroundColor: UIColor.white]

    }

    override func viewDidAppear(_ animated: Bool) {
        if !CheckInternet.Connection(){
            self.exibirMensagem(titulo: "Erro de Conexão", mensagem: "O aparelho está sem conexão com a internet! E não é possivel carregar o mapa de desordens")
        }
        
    }
    
    func exibirMensagem(titulo: String, mensagem: String) {
        let alerta = UIAlertController(title: titulo, message: mensagem, preferredStyle: .alert)
        let acaoCancelar = UIAlertAction(title: "Cancelar", style: .cancel, handler: nil)
        
        alerta.addAction(acaoCancelar)
        present(alerta, animated: true, completion: nil)
    }

    func recuperarTodasDesordens(completion: @escaping([Denuncia]) -> Void) {
        Alamofire.request(URLs.denuncias, method: .get).validate().responseJSON{
            response in
            
            switch response.result{
            case .success:
                guard let data = response.data else{
                    // PRINT ALERT
                    return
                }
                let decoder  = JSONDecoder()
                decoder.dateDecodingStrategy = .iso8601
                do{
                    let listaDenuncias = try decoder.decode([Denuncia].self, from: data)
                    completion(listaDenuncias)
                } catch let error {
                    self.exibirMensagem(titulo: "Error", mensagem: error.localizedDescription)
                    print("Error:\(error.localizedDescription)")
                    completion([])
            }
            case .failure(let error):
                self.exibirMensagem(titulo: "Error", mensagem: error.localizedDescription)
                print("Error:\(error.localizedDescription)")
                completion([])
            }
        }
    }
    
    func listarTiposDenuncia(completion: @escaping([String])->Void){
       
        var tiposDenuncias: [String] = []
        
        Alamofire.request(URLs.tiposDesordem, method: .post).validate().responseJSON{
            response in switch response.result{
            case .success(let json):
                let result = json as! NSArray
                for key in result{
                    let key = key as! NSDictionary
                    let valor = key["des_descricao"] as! String
                    tiposDenuncias.append(valor)
                }
                
                completion(tiposDenuncias)
                
            case .failure(let error):
                if (error._code == -1009) {
                    self.exibirMensagem(titulo: "Erro", mensagem: "Sem conexão com a Internet!!!")
                }
                completion([])
            }
        }

    }
    
    func recuperarDesordensPorArea(mapView: MKMapView , completion: @escaping([Denuncia]) -> Void) {
        let mRect: MKMapRect = self.mapView.visibleMapRect
        let A = MKMapPointMake(MKMapRectGetMinX(mRect), MKMapRectGetMinY(mRect))
        let Ac = MKCoordinateForMapPoint(A)
        let B = MKMapPointMake(MKMapRectGetMaxX(mRect), MKMapRectGetMinY(mRect))
        let Bc = MKCoordinateForMapPoint(B)
        let C = MKMapPointMake(MKMapRectGetMaxX(mRect), MKMapRectGetMaxY(mRect))
        let Cc = MKCoordinateForMapPoint(C)
        let D = MKMapPointMake(MKMapRectGetMinX(mRect), MKMapRectGetMaxY(mRect))
        let Dc = MKCoordinateForMapPoint(D)
        
        var parametros: Parameters?
        
        if (self.status == nil) || (self.dataIni == nil) || (self.dataFim == nil) || (self.natureza == nil){
            
            parametros  = ["latA": Ac.latitude, "lonA": Ac.longitude, "latB": Bc.latitude, "lonB": Bc.longitude, "latC": Cc.latitude, "lonC": Cc.longitude, "latD": Dc.latitude, "lonD": Dc.longitude]
        }else{
            parametros = ["latA": Ac.latitude, "lonA": Ac.longitude, "latB": Bc.latitude, "lonB": Bc.longitude, "latC": Cc.latitude, "lonC": Cc.longitude, "latD": Dc.latitude, "lonD": Dc.longitude, "dataIni": self.dataIni!, "dataFim": self.dataFim!, "natureza": self.natureza!, "status": self.status!]
        }
        
        Alamofire.request(URLs.denunciasPorArea, method: .get, parameters: parametros).validate().responseJSON{
            response in
            
            switch response.result{
            case .success:
                guard let data = response.data else{
                    // PRINT ALERT
                    return
                }
                let decoder  = JSONDecoder()
                decoder.dateDecodingStrategy = .iso8601
                do{
                    let listaDenuncias = try decoder.decode([Denuncia].self, from: data)
                    completion(listaDenuncias)
                } catch let error {
                    self.exibirMensagem(titulo: "Error", mensagem: "Não foi passível carregar as desordens no mapa!")
                    print("Error:\(error.localizedDescription)")
                    completion([])
                }
            case .failure(let error):
                self.exibirMensagem(titulo: "Error", mensagem: "Não foi passível carregar as desordens no mapa! Pode ser por falta de internet ou por falha na conexão com o servidor")
                print("Error:\(error.localizedDescription)")
                completion([])
            }
        }
    }
    
    func apresentarDenunciasMapa(listaDenuncias: [Denuncia]) -> Void {
        let anotacoes = self.mapView.annotations
        self.mapView.removeAnnotations(anotacoes) // Retira anotações existentes para depois acrescentar as novas
        
        for key in listaDenuncias{
            let lat = key.latitude
            let lon = key.longitude
 
            let latitude: CLLocationDegrees = lat
            let longitude: CLLocationDegrees = lon
            let ponto: CLLocationCoordinate2D = CLLocationCoordinate2DMake(latitude, longitude)
  
            let anotacao: PontoDeDesordem = PontoDeDesordem(iddenuncia: key.den_iddenuncia ?? 0, des_descricao: key.des_descricao, den_descricao: key.den_descricao, coordinate: ponto)
            
            self.mapView.addAnnotation(anotacao)
        }
    }
    
    fileprivate func configurarAddButton() {
        addButton.layer.masksToBounds = true
        addButton.layer.zPosition = 1
        addButton.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.25).cgColor
        addButton.layer.shadowOffset = CGSize(width: 0.0, height: 2.0)
        addButton.layer.shadowOpacity = 1.0
        addButton.layer.shadowRadius = 0.0
        addButton.layer.masksToBounds = false
        addButton.layer.cornerRadius = 4.0
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        let identifer = "Marker"
        var annotationView: MKMarkerAnnotationView
        if let dequeuedView = mapView.dequeueReusableAnnotationView(withIdentifier: identifer) as? MKMarkerAnnotationView{
            dequeuedView.annotation = annotation
            annotationView = dequeuedView
        }else{
            annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: identifer)
            annotationView.canShowCallout = true
            let bt = UIButton(type: .detailDisclosure)
            bt.tintColor = UIColor(red: 0.48, green: 0.09, blue: 0.53, alpha: 1)
            annotationView.rightCalloutAccessoryView = bt
            
            // Para apresentar um imagem como botao
            //let btmap = UIButton(frame: CGRect(origin: CGPoint.zero, size: CGSize(width: 30, height: 30)))
            //btmap.setBackgroundImage(UIImage(named: "logo"), for: UIControlState())
            //annotationView.rightCalloutAccessoryView = btmap
        }
        return annotationView
    }
    
    func mapView(_ mapView: MKMapView, annotationView view: MKAnnotationView, calloutAccessoryControlTapped control: UIControl) {
        
        if (control as? UIButton)?.buttonType == UIButtonType.detailDisclosure{
            mapView.deselectAnnotation(view.annotation, animated: false)
            if let pontoDeDesordem = view.annotation as? PontoDeDesordem{
                //print(pontoDeDesordem.den_iddenuncia)
                if let navigation = self.navigationController{
                    let nv = self.storyboard?.instantiateViewController(withIdentifier: "detalhes") as! DenunciaViewController
                    nv.denuncia = barraLateral?.listaDenuncias?.first(where: {$0.den_iddenuncia == pontoDeDesordem.den_iddenuncia})
                    //print(nv.denuncia.den_iddenuncia)
                    navigation.pushViewController(nv, animated: true)
                    
                }
            }
        }
    }
    
    var mapControleCarregamento = true
    
    func mapViewDidFinishLoadingMap(_ mapView: MKMapView) {
        
        if mapControleCarregamento{
            recuperarDesordensPorArea(mapView: self.mapView, completion: {(denuncias) in
                print("carregando...")
                SVProgressHUD.show(withStatus: "Carregando...")
                if ((self.barraLateral?.listaDenuncias = denuncias) != nil) {
                    print("Atribuição de denuncias realizada com sucesso")
                }else{
                    print("Erro na atribuição de denuncias para self.barraLateral?.listaDenuncias")
                }
                
                self.apresentarDenunciasMapa(listaDenuncias: self.barraLateral?.listaDenuncias ?? [])
                SVProgressHUD.dismiss()})
            mapControleCarregamento = false
        }
        //print(self.barraLateral?.listaDenuncias ?? "Array Vazio")
        //print("Numero de denuncias carregadas: \(String(describing: self.barraLateral!.listaDenuncias.count))")
        
    }
    
    func mapView(_ mapView: MKMapView, regionDidChangeAnimated animated: Bool) {

        recuperarDesordensPorArea(mapView: self.mapView, completion: {(denuncias) in
            SVProgressHUD.show(withStatus: "Carregando denúncia...")
            self.barraLateral?.listaDenuncias = denuncias
            print("Numero de denuncias carregadas: \(String(describing: self.barraLateral!.listaDenuncias?.count))")
            self.apresentarDenunciasMapa(listaDenuncias: self.barraLateral?.listaDenuncias ?? [])
            SVProgressHUD.dismiss()})
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]){
        
        let userlocation:CLLocation = locations [0] as CLLocation
        locationManager.stopUpdatingLocation()
        
        let location = CLLocationCoordinate2D(latitude: userlocation.coordinate.latitude, longitude: userlocation.coordinate.longitude)
        let span = MKCoordinateSpanMake (1.0, 1.0)
        let region = MKCoordinateRegion(center: location, span: span)
        
        mapView.setRegion(region, animated: true)
    }
    
    
    func sideMenu(){

        if self.revealViewController() != nil {
            
            self.revealViewController()?.rearViewController = self.barraLateral
            menuButton.target = self.revealViewController()
            menuButton.action = #selector(SWRevealViewController.revealToggle(_:))
            
            filterButton.target = self.revealViewController()
            filterButton.action = #selector(SWRevealViewController.rightRevealToggle(_:))
            
            self.view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
            self.revealViewController()?.rearViewRevealWidth = 240
            
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let rightNC = storyboard.instantiateViewController(withIdentifier: "NavFiltrosViewController") as? UINavigationController
            self.revealViewController().rightViewController = rightNC
            
            self.revealViewController().rightViewRevealWidth = UIScreen.main.bounds.size.width - 80
            self.revealViewController().rightViewRevealOverdraw = 0
            self.revealViewController().rightViewRevealDisplacement = 0
            
        }else{
            self.revealViewController()?.rearViewController = self.barraLateral
        }
    }
    
    @IBAction func adicionarDenuncia(_ sender: Any) {
        
        let status = UserDefaults.standard.bool(forKey: "usuarioLogado")
        
        if status {
            self.performSegue(withIdentifier: "denunciaSegue", sender: nil)
        } else{
            // Cria o alerta
            let alert = UIAlertController(title: "Não há usuário logado", message: "Para cadastrar uma denuncia você precisa fazer login. Deseja fazer login agora?", preferredStyle: .alert)
            
            // Adiciona acoes (botoes
            alert.addAction(UIAlertAction(title: "Sim", style: .default, handler: { action in
                self.performSegue(withIdentifier: "loginSegue", sender: nil)
            }))
            alert.addAction(UIAlertAction(title: "Não", style: .cancel, handler: nil))
            
            // Mostra o alerta
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if (segue.identifier == "loginSegue"){
            let view: EntrarViewController = segue.destination as! EntrarViewController
            view.mapViewController = self
        }

    }
    
}

