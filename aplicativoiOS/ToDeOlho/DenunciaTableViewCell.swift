//
//  DesordemTableViewCell.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 01/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class DenunciaTableViewCell: UITableViewCell {

    @IBOutlet weak var igDenuncia: UIImageView!
    @IBOutlet weak var ntDenuncia: UILabel!
    @IBOutlet weak var dsDenuncia: UILabel!
    @IBOutlet weak var dtDenuncia: UILabel!
    
    var denuncia: Denuncia!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func prepareCell(with denuncia: Denuncia){
        //igDesordem = denuncia.getImagem() // Atenção Aqui esta recebendo so o id da imagem, mas precisamos da imagem toda
        
        self.denuncia = denuncia
        ntDenuncia.text = denuncia.des_descricao
        dsDenuncia.text = denuncia.den_descricao
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        dateFormatter.timeZone = NSTimeZone(name: "UTC") as TimeZone?
        guard let date = dateFormatter.date(from: denuncia.den_datahora_registro) else {
            fatalError()
        }
        
        dateFormatter.dateFormat = "dd/MM/yyyy"
        let newDate = dateFormatter.string(from: date)

        dtDenuncia.text = newDate
    }
    
    
    
}
