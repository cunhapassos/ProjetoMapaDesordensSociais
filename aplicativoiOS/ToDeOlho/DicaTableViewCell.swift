//
//  DicaTableViewCell.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 09/06/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class DicaTableViewCell: UITableViewCell {

    @IBOutlet weak var lbDica: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
