//
//  Denuncia.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 26/01/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//
import MapKit
import Foundation

struct Denuncia{
    var usu_nome: String
    var den_anonimato: Int? // Verificar depois a conversão de Int para Bool
    var den_status: String
    var den_idusuario: Int?
    var den_iddenuncia: Int?
    var den_descricao: String
    var des_descricao: String
    var den_datahora_ocorreu: String
    var den_datahora_solucao: String?
    var den_datahora_registro: String
    var latitude: Double
    var longitude: Double
    var den_nivel_confiabilidade: Int
}

extension Denuncia: Codable{
    private enum CodingKeys: String, CodingKey {
        case usu_nome
        case den_anonimato
        case den_status
        case den_idusuario
        case den_iddenuncia
        case den_descricao
        case des_descricao
        case den_datahora_ocorreu
        case den_datahora_solucao
        case den_datahora_registro
        case latitude
        case longitude
        case den_nivel_confiabilidade
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        usu_nome = try container.decode(String.self, forKey: .usu_nome)
        den_anonimato = try container.decode(Int?.self, forKey: .den_anonimato)
        den_status = try container.decode(String.self, forKey: .den_status)
        den_idusuario = try container.decode(Int?.self, forKey: .den_idusuario)
        den_iddenuncia = try container.decode(Int?.self, forKey: .den_iddenuncia)
        den_descricao = try container.decode(String.self, forKey: .den_descricao)
        des_descricao = try container.decode(String.self, forKey: .des_descricao)
        den_datahora_ocorreu = try container.decode(String.self, forKey: .den_datahora_ocorreu)
        den_datahora_solucao = try container.decode(String?.self, forKey: .den_datahora_solucao)
        den_datahora_registro = try container.decode(String.self, forKey: .den_datahora_registro)
        latitude = try container.decode(Double.self, forKey: .latitude)
        longitude = try container.decode(Double.self, forKey: .longitude)
        den_nivel_confiabilidade = try container.decode(Int.self, forKey: .den_nivel_confiabilidade)
    }
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(usu_nome, forKey: .usu_nome)
        try container.encode(den_anonimato, forKey: .den_anonimato)
        try container.encode(den_status, forKey: .den_status)
        try container.encode(den_idusuario, forKey: .den_idusuario)
        try container.encode(den_iddenuncia, forKey: .den_iddenuncia)
        try container.encode(den_descricao, forKey: .den_descricao)
        try container.encode(des_descricao, forKey: .des_descricao)
        try container.encode(den_datahora_ocorreu, forKey: .den_datahora_ocorreu)
        try container.encode(den_datahora_solucao, forKey: .den_datahora_solucao)
        try container.encode(den_datahora_registro, forKey: .den_datahora_registro)
        try container.encode(latitude, forKey: .latitude)
        try container.encode(longitude, forKey: .longitude)
        try container.encode(den_nivel_confiabilidade, forKey: .den_nivel_confiabilidade)
    }
}
