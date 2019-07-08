//
//  FiltroPickerTableViewCell.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 11/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class FiltroPkDataTableViewCell: UITableViewCell {


    @IBOutlet weak var pkDataIni: UIDatePicker!
    
    var lbDataIni: UILabel?
    var lbDataFim: UILabel?
    var aux: Bool = true
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        let now = Date()
        pkDataIni.maximumDate = now
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    @IBAction func escolherData(_ sender: Any) {

        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "dd/MM/yyyy"
        let strDate = dateFormatter.string(from: pkDataIni.date)
        
        let now = Date()
        pkDataIni.maximumDate = now
        
        if aux{
            lbDataIni?.text = strDate
        }else{
            lbDataFim?.text = strDate
        }
        
    }

}
