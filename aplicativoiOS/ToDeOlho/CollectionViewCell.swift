//
//  CollectionViewCell.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 10/02/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import UIKit

class CollectionViewCell: UICollectionViewCell {
    
    @IBOutlet weak var imagemDenuncia: UIImageView!
    @IBOutlet weak var deleteView: UIVisualEffectView!
    @IBOutlet weak var deleteButton: UIButton!
    var collection: UICollectionView!
    var view: Etapa3CadastroViewController!
    var index: IndexPath!
    
    @IBAction func deletarCelula(_ sender: Any) {
        view.deletarCelulaCollection(index: index)
    }
    
}
