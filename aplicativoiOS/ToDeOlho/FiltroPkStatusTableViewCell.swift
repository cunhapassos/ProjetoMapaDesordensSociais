//
//  FiltroPkStatusTableViewCell.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 11/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class FiltroPkStatusTableViewCell: UITableViewCell, UIPickerViewDataSource, UIPickerViewDelegate {
    
    @IBOutlet weak var pkStatus: UIPickerView!
    
    var lbStatus: UILabel?
    let status = ["Todos os status", "Com problemas", "Em resolução", "Solucionado"]
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        pkStatus.dataSource = self
        pkStatus.delegate = self
    }

    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return status.count
    }
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return status[row]
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        self.lbStatus?.text = self.status[row]
    }
    

}
