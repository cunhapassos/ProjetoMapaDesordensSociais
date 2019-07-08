//
//  DenunciaViewController.swift
//  MDD
//
//  Created by Paulo Passos on 27/07/18.
//  Copyright © 2018 paulopassos. All rights reserved.
//

import UIKit
import MapKit


class Etapa1CadastroViewController: UIViewController, MKMapViewDelegate, CLLocationManagerDelegate {
    
    @IBOutlet weak var mapDenView: MKMapView!
    @IBOutlet weak var proximoButton: UIBarButtonItem!
    
    let locationManager = CLLocationManager()
    var latitude: CLLocationDegrees = 0.0
    var longitude: CLLocationDegrees = 0.0
    var cnt: Int = 0
    var localizacao: CLLocation!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        proximoButton.isEnabled              = false
        
        self.locationManager.delegate        = self
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest
        self.locationManager.requestWhenInUseAuthorization()
        self.locationManager.startUpdatingLocation()
        self.mapDenView.delegate = self
        
        let template = URLs.openstreetmap // Buscando openstreetmap
        let carte_indice = MKTileOverlay(urlTemplate:template) 
        
        //let denuncia = Denuncia()
        carte_indice.canReplaceMapContent = true
        self.mapDenView.add(carte_indice)
        
        // Para capturar um ponto no mapa
        let reconhecedorGesto = UILongPressGestureRecognizer(target: self, action: #selector(Etapa1CadastroViewController.marcar(gesture:)))
        reconhecedorGesto.minimumPressDuration = 0.5
        mapDenView.addGestureRecognizer(reconhecedorGesto)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        if !CheckInternet.Connection(){
            self.exibirMensagem(titulo: "Erro de Conexão", mensagem: "O aparelho está sem conexão com a internet!")
        }
    }
    
    func exibirMensagem(titulo: String, mensagem: String) {
        let alerta = UIAlertController(title: titulo, message: mensagem, preferredStyle: .alert)
        let acaoCancelar = UIAlertAction(title: "Cancelar", style: .cancel, handler: nil)
        
        alerta.addAction(acaoCancelar)
        present(alerta, animated: true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    
    @objc func marcar(gesture: UIGestureRecognizer){

        if gesture.state == UIGestureRecognizerState.began {
            let pontoSelecionado = gesture.location(in: self.mapDenView)
            let coordenadas = mapDenView.convert(pontoSelecionado, toCoordinateFrom: self.mapDenView)
            localizacao = CLLocation(latitude: coordenadas.latitude, longitude: coordenadas.longitude)
            
            // selecionar o endereço do ponto selecionado
            var localCompleto = "Endereço não encontrado"
            CLGeocoder().reverseGeocodeLocation(localizacao, completionHandler: { (local, erro) in
                if erro == nil {
                    if let dadosLocal = local?.first{
                        if let nome = dadosLocal.name{
                            localCompleto = nome
                        }
                        else{
                            if let endereco = dadosLocal.thoroughfare{
                                localCompleto = endereco
                            }
                        }
                    }
                    
                    let anotacao = MKPointAnnotation()
                    
                    anotacao.coordinate.latitude = coordenadas.latitude
                    anotacao.coordinate.longitude = coordenadas.longitude
                    
                    // Permite Apenas uma marcação no Mapa
                    let anotacoes = self.mapDenView.annotations
                    if !anotacoes.isEmpty{
                        self.mapDenView.removeAnnotation(anotacoes[0])
                    }
                    
                    self.mapDenView.addAnnotation(anotacao)
                    self.proximoButton.isEnabled = true
                }
                else{
                    if (erro!._code == 2){
                        self.exibirMensagem(titulo: "Erro de Conexão", mensagem: "O aparelho está sem conexão com a internet!")
                    }
                }
            })
        }
    }
    // Enviando o localização da denuncia para proxima view para registro
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "pontoMapaSegue"{
            let svc = segue.destination as! Etapa2CadastroTableViewController
            svc.localizacao = localizacao

        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]){
        
        let userlocation:CLLocation = locations [0] as CLLocation
        locationManager.stopUpdatingLocation()
        let location = CLLocationCoordinate2D(latitude: userlocation.coordinate.latitude, longitude: userlocation.coordinate.longitude)
        let span = MKCoordinateSpanMake (0.0075, 0.0075)
        let region = MKCoordinateRegion(center: location, span: span)
        mapDenView.setRegion(region, animated: true)
    }
    
}
