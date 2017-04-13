//
//  CustomSegue.swift
//  SlideToWin
//
//  Created by djay mac on 11/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit

class CustomSegue: UIStoryboardSegue {
   
    override func perform() {
        let sourceViewController: UIViewController = self.sourceViewController 
        let destinationViewController:UIViewController = self.destinationViewController 
        
        sourceViewController.view.addSubview(destinationViewController.view)
        
        destinationViewController.view.transform = CGAffineTransformMakeScale(0.05, 0.05)
        
        UIView.animateWithDuration(0.6, delay: 0.0, options: UIViewAnimationOptions.CurveEaseOut, animations: { () -> Void in
            
            destinationViewController.view.transform = CGAffineTransformMakeScale(1.0, 1.0)
            
        }) { (finished) -> Void in
            
            destinationViewController.view.removeFromSuperview()
            sourceViewController.presentViewController(destinationViewController, animated: false, completion: nil)
            
            
        }
        
        
        
        
    }
    
    
}
