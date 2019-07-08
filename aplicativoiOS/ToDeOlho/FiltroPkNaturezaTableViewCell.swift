//
//  FiltroPkNaturezaTableViewCell.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 11/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class FiltroPkNaturezaTableViewCell: UITableViewCell, UIPickerViewDataSource, UIPickerViewDelegate {

    

    

    @IBOutlet weak var pkNatureza: UIPickerView!
    var lbNatureza: UILabel?
    var listaTiposDenuncias: [String]?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        pkNatureza.dataSource = self
        pkNatureza.delegate = self
        listaTiposDenuncias?.append("Todos os tipos")
    }

    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return self.listaTiposDenuncias?.count ?? 0
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return self.listaTiposDenuncias?[row]
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        self.lbNatureza?.text = self.listaTiposDenuncias?[row]
    }


}
