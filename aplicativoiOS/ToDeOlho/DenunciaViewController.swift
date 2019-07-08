//
//  DenunciaViewController.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 05/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit
import MapKit

class DenunciaViewController: UIViewController, MKMapViewDelegate, CLLocationManagerDelegate {
    
    @IBOutlet weak var mapa: MKMapView!
    @IBOutlet weak var lbNatureza: UILabel!
    @IBOutlet weak var lbDataRegistro: UILabel!
    @IBOutlet weak var lbDataFato: UILabel!
    @IBOutlet weak var lbStatus: UILabel!
    @IBOutlet weak var lbNomeDenunciante: UILabel!
    @IBOutlet weak var lbDescricao: UILabel!
    
    
    var denuncia: Denuncia?
    
    let locationManager = CLLocationManager()
    var latitude: CLLocationDegrees = 0.0
    var longitude: CLLocationDegrees = 0.0
    
    override func viewDidLoad() {
        
        self.lbStatus.text = self.denuncia?.den_status
        self.lbNatureza.text = self.denuncia?.des_descricao
        self.lbDescricao.text = self.denuncia?.den_descricao
        if self.denuncia?.den_anonimato == 1 {
            self.lbNomeDenunciante.text = "Anônimo"
        }else{
            self.lbNomeDenunciante.text = self.denuncia?.usu_nome
        }
        self.lbDataFato.text = formatarData(data:  self.denuncia?.den_datahora_ocorreu ?? "")
        self.lbDataRegistro.text = formatarData(data: self.denuncia?.den_datahora_registro ?? "")

        mostraMapaComDenuncia()
    }
    
    func mostraMapaComDenuncia(){
        
        self.locationManager.delegate        = self
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest
        self.locationManager.requestWhenInUseAuthorization()
        self.locationManager.startUpdatingLocation()
        self.mapa.delegate = self
        
        let template = URLs.openstreetmap // Buscando openstreetmap
        let carte_indice = MKTileOverlay(urlTemplate:template)
        let latitude: CLLocationDegrees = self.denuncia?.latitude ?? 0
        let longitude: CLLocationDegrees = self.denuncia?.longitude ?? 0
        let ponto: CLLocationCoordinate2D = CLLocationCoordinate2DMake(latitude, longitude)
        let regiao = MKCoordinateRegionMakeWithDistance(ponto, 1000, 2000)
        
        mapa.setRegion(regiao, animated: false)
        carte_indice.canReplaceMapContent = true
        self.mapa.add(carte_indice)
        
        let anotacao = MKPointAnnotation()
        
        anotacao.coordinate = ponto
        anotacao.title = self.denuncia?.des_descricao
        anotacao.subtitle = self.denuncia?.den_descricao
        self.mapa.addAnnotation(anotacao)
    }
    func formatarData(data: String) -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        dateFormatter.timeZone = NSTimeZone(name: "UTC") as TimeZone?
        guard let date = dateFormatter.date(from: denuncia?.den_datahora_registro ?? "000-00-00") else {
            fatalError()
        }
        
        dateFormatter.dateFormat = "dd/MM/yyyy"
        let newDate = dateFormatter.string(from: date)

        return newDate
    } 
}
