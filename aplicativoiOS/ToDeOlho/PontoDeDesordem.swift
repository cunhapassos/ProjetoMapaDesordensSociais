//
//  PontoDeDesordem.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 07/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import Foundation
import  CoreLocation
import MapKit

class PontoDeDesordem: NSObject, MKAnnotation{
    var den_iddenuncia: Int
    var des_descricao: String
    var den_descricao: String
    var coordinate: CLLocationCoordinate2D
    
    var title: String? {
        return des_descricao
    }
    
    var subtitle: String?{
        return den_descricao
    }
    
    init(iddenuncia: Int, des_descricao: String, den_descricao: String, coordinate: CLLocationCoordinate2D) {
        self.den_iddenuncia = iddenuncia
        self.des_descricao = des_descricao
        self.den_descricao = den_descricao
        self.coordinate = coordinate
    }
    
}
