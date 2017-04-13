//
//  LevelViewCell.swift
//  SlideToWin
//
//  Created by djay mac on 11/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit

class LevelViewCell: UICollectionViewCell {
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    @IBOutlet weak var textLabel: UILabel!
    @IBOutlet weak var imageView: UIImageView!
    @IBOutlet weak var StarView: UIImageView!
    @IBOutlet weak var levelButton: UIButton!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        
    }
}
