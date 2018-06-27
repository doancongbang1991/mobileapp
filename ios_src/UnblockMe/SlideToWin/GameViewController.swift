//
//  GameViewController.swift
//  SlideToWin
//
//  Created by djay mac on 10/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit
import AVFoundation

class GameViewController: UIViewController, GADBannerViewDelegate {
    var levelSelected:Int!
    var nextlevelnumber: Int!

    @IBOutlet weak var boxView: UIView!
    @IBOutlet weak var currentLevel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var bestLabel: UILabel!
    @IBOutlet weak var scoreLabel: UILabel!
    @IBOutlet weak var starsimgView: UIImageView!
    
    var leveltime :Int!

    private var xOffset : CGFloat = 0.0
    private var yOffset : CGFloat = 0.0
    
    
    
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
       // let location = touches.anyObject()!.locationInView(gamesubView)
        let touch = touches.first as UITouch?
    location = touch!.locationInView(gamesubView)
        
        if mainBlock.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - mainBlock.center.x
            yOffset = location.y - mainBlock.center.y
        }
        if vBlockbig.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlockbig.center.x
            yOffset = location.y -  vBlockbig.center.y
        }
        if vBlocksmall.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlocksmall.center.x
            yOffset = location.y -  vBlocksmall.center.y
        }
        if hBlockbig.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlockbig.center.x
            yOffset = location.y -  hBlockbig.center.y
        }
        if hBlocksmall.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlocksmall.center.x
            yOffset = location.y - hBlocksmall.center.y
        }
        
        if vBlockbig1.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlockbig1.center.x
            yOffset = location.y -  vBlockbig1.center.y
        }
        if vBlocksmall1.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlocksmall1.center.x
            yOffset = location.y -  vBlocksmall1.center.y
        }
        if hBlockbig1.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlockbig1.center.x
            yOffset = location.y -  hBlockbig1.center.y
        }
        if hBlocksmall1.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlocksmall1.center.x
            yOffset = location.y - hBlocksmall1.center.y
        }
        
        if vBlockbig2.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlockbig2.center.x
            yOffset = location.y -  vBlockbig2.center.y
        }
        if vBlocksmall2.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlocksmall2.center.x
            yOffset = location.y -  vBlocksmall2.center.y
        }
        if hBlockbig2.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlockbig2.center.x
            yOffset = location.y -  hBlockbig2.center.y
        }
        if hBlocksmall2.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlocksmall2.center.x
            yOffset = location.y - hBlocksmall2.center.y
        }
        
        if vBlockbig3.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlockbig3.center.x
            yOffset = location.y -  vBlockbig3.center.y
        }
        if vBlocksmall3.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlocksmall3.center.x
            yOffset = location.y -  vBlocksmall3.center.y
        }
        if hBlockbig3.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlockbig3.center.x
            yOffset = location.y -  hBlockbig3.center.y
        }
        if hBlocksmall3.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlocksmall3.center.x
            yOffset = location.y - hBlocksmall3.center.y
        }
        
        if vBlockbig4.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlockbig4.center.x
            yOffset = location.y -  vBlockbig4.center.y
        }
        if vBlocksmall4.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x -  vBlocksmall4.center.x
            yOffset = location.y -  vBlocksmall4.center.y
        }
        if hBlockbig4.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlockbig4.center.x
            yOffset = location.y -  hBlockbig4.center.y
        }
        if hBlocksmall4.layer.presentationLayer()!.frame.contains(location) {
            xOffset = location.x - hBlocksmall4.center.x
            yOffset = location.y - hBlocksmall4.center.y
        }
    }
    
    
    
    override func touchesMoved(touches: Set<UITouch>, withEvent event: UIEvent?) {
     //   var touch: UITouch! = touches.anyObject() as UITouch
        let touch = touches.first as UITouch?
        location = touch!.locationInView(gamesubView)

        // if mainblock green is touched
        if mainBlock.layer.presentationLayer()!.frame.contains(location) {
            mainBlock.center.x = location.x
            if mainBlock.frame.origin.x > xblock5 - diff*2 {
                print("level \(levelSelected) is completed")
                levelcomplete(levelSelected,timetaken: hourCount)
            }
            if mainBlock.center.x < (mainBlock.frame.width/2) + diff { // x-axis less low value
                mainBlock.center.x = (mainBlock.frame.width/2) + diff
            } else if mainBlock.center.x > gamesubView.frame.width - (mainBlock.frame.width/2) { // x-axis max value
                mainBlock.center.x = (gamesubView.frame.width - (mainBlock.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(mainBlock.frame, vBlocksmall.frame) { // check whos X is bigger
                if mainBlock.center.x < vBlocksmall.center.x {
                    mainBlock.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlocksmall.center.x {
                    mainBlock.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlockbig.frame) {
                if mainBlock.center.x < vBlockbig.center.x {
                    mainBlock.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlockbig.center.x {
                    mainBlock.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlocksmall1.frame) {
                
                if mainBlock.center.x < vBlocksmall1.center.x {
                    mainBlock.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlocksmall1.center.x {
                    mainBlock.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlockbig1.frame) {
                if mainBlock.center.x < vBlockbig1.center.x {
                    mainBlock.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlockbig1.center.x {
                    mainBlock.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlocksmall2.frame) {
                if mainBlock.center.x < vBlocksmall2.center.x {
                    mainBlock.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlocksmall2.center.x {
                    mainBlock.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlockbig2.frame) {
                if mainBlock.center.x < vBlockbig2.center.x {
                    mainBlock.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlockbig2.center.x {
                    mainBlock.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlocksmall3.frame) {
                if mainBlock.center.x < vBlocksmall3.center.x {
                    mainBlock.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlocksmall3.center.x {
                    mainBlock.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlockbig3.frame) {
                if mainBlock.center.x < vBlockbig3.center.x {
                    mainBlock.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlockbig3.center.x {
                    mainBlock.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlocksmall4.frame) {
                if mainBlock.center.x < vBlocksmall4.center.x {
                    mainBlock.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlocksmall4.center.x {
                    mainBlock.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, vBlockbig4.frame) {
                if mainBlock.center.x < vBlockbig4.center.x {
                    mainBlock.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > vBlockbig4.center.x {
                    mainBlock.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlocksmall.frame) { // check whos X is bigger
                if mainBlock.center.x < hBlocksmall.center.x {
                    mainBlock.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlocksmall.center.x {
                    mainBlock.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlockbig.frame) {
                if mainBlock.center.x < hBlockbig.center.x {
                    mainBlock.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlockbig.center.x {
                    mainBlock.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlocksmall1.frame) {
                
                if mainBlock.center.x < hBlocksmall1.center.x {
                    mainBlock.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlocksmall1.center.x {
                    mainBlock.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlockbig1.frame) {
                if mainBlock.center.x < hBlockbig1.center.x {
                    mainBlock.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlockbig1.center.x {
                    mainBlock.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlocksmall2.frame) {
                if mainBlock.center.x < hBlocksmall2.center.x {
                    mainBlock.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlocksmall2.center.x {
                    mainBlock.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlockbig2.frame) {
                if mainBlock.center.x < hBlockbig2.center.x {
                    mainBlock.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlockbig2.center.x {
                    mainBlock.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlocksmall3.frame) {
                if mainBlock.center.x < hBlocksmall3.center.x {
                    mainBlock.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlocksmall3.center.x {
                    mainBlock.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlockbig3.frame) {
                if mainBlock.center.x < hBlockbig3.center.x {
                    mainBlock.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlockbig3.center.x {
                    mainBlock.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlocksmall4.frame) {
                if mainBlock.center.x < hBlocksmall4.center.x {
                    mainBlock.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlocksmall4.center.x {
                    mainBlock.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(mainBlock.frame, hBlockbig4.frame) {
                if mainBlock.center.x < hBlockbig4.center.x {
                    mainBlock.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 + mainBlock.frame.width/2 + diff)
                } else if mainBlock.center.x > hBlockbig4.center.x {
                    mainBlock.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 + mainBlock.frame.width/2 + diff)
                }
            }
        }
        
        // if big horizontal block is touched
        if  hBlockbig.layer.presentationLayer()!.frame.contains(location) {
            hBlockbig.center.x = location.x // -xOffset
            if  hBlockbig.center.x < (hBlockbig.frame.width/2) + diff {
                hBlockbig.center.x = (hBlockbig.frame.width/2) + diff
            } else if  hBlockbig.center.x > gamesubView.frame.width - (hBlockbig.frame.width/2) {
                hBlockbig.center.x = (gamesubView.frame.width - (hBlockbig.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlockbig.frame, vBlocksmall.frame) {
                if  hBlockbig.center.x < vBlocksmall.center.x {
                    hBlockbig.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlocksmall.center.x {
                    hBlockbig.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, vBlockbig.frame) {
                if  hBlockbig.center.x < vBlockbig.center.x {
                    hBlockbig.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlockbig.center.x {
                    hBlockbig.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, vBlocksmall1.frame) {
                if  hBlockbig.center.x < vBlocksmall1.center.x {
                    hBlockbig.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlocksmall1.center.x {
                    hBlockbig.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, vBlockbig1.frame) {
                if  hBlockbig.center.x < vBlockbig1.center.x {
                    hBlockbig.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlockbig.center.x {
                    hBlockbig.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, vBlocksmall2.frame) {
                if  hBlockbig.center.x < vBlocksmall2.center.x {
                    hBlockbig.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlocksmall2.center.x {
                    hBlockbig.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, vBlockbig2.frame) {
                if  hBlockbig.center.x < vBlockbig2.center.x {
                    hBlockbig.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlockbig2.center.x {
                    hBlockbig.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, vBlocksmall3.frame) {
                if  hBlockbig.center.x < vBlocksmall3.center.x {
                    hBlockbig.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlocksmall3.center.x {
                    hBlockbig.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, vBlockbig3.frame) {
                if  hBlockbig.center.x < vBlockbig3.center.x {
                    hBlockbig.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlockbig3.center.x {
                    hBlockbig.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, vBlocksmall4.frame) {
                if  hBlockbig.center.x < vBlocksmall4.center.x {
                    hBlockbig.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlocksmall4.center.x {
                    hBlockbig.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, vBlockbig4.frame) {
                if  hBlockbig.center.x < vBlockbig4.center.x {
                    hBlockbig.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > vBlockbig4.center.x {
                    hBlockbig.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, hBlocksmall.frame) { // added
                if  hBlockbig.center.x < hBlocksmall.center.x {
                    hBlockbig.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlocksmall.center.x {
                    hBlockbig.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, hBlocksmall1.frame) {
                if  hBlockbig.center.x < hBlocksmall1.center.x {
                    hBlockbig.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlocksmall1.center.x {
                    hBlockbig.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, hBlockbig1.frame) {
                if  hBlockbig.center.x < hBlockbig1.center.x {
                    hBlockbig.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlockbig.center.x {
                    hBlockbig.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, hBlocksmall2.frame) {
                if  hBlockbig.center.x < hBlocksmall2.center.x {
                    hBlockbig.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlocksmall2.center.x {
                    hBlockbig.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, hBlockbig2.frame) {
                if  hBlockbig.center.x < hBlockbig2.center.x {
                    hBlockbig.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlockbig2.center.x {
                    hBlockbig.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, hBlocksmall3.frame) {
                if  hBlockbig.center.x < hBlocksmall3.center.x {
                    hBlockbig.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlocksmall3.center.x {
                    hBlockbig.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, hBlockbig3.frame) {
                if  hBlockbig.center.x < hBlockbig3.center.x {
                    hBlockbig.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlockbig3.center.x {
                    hBlockbig.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig.frame, hBlocksmall4.frame) {
                if  hBlockbig.center.x < hBlocksmall4.center.x {
                    hBlockbig.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlocksmall4.center.x {
                    hBlockbig.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, hBlockbig4.frame) {
                if  hBlockbig.center.x < hBlockbig4.center.x {
                    hBlockbig.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > hBlockbig4.center.x {
                    hBlockbig.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig.frame, mainBlock.frame) {
                if  hBlockbig.center.x < mainBlock.center.x {
                    hBlockbig.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                } else if  hBlockbig.center.x > mainBlock.center.x {
                    hBlockbig.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlockbig.frame.width/2 + diff)
                }
            }
            
        }
        
        // if big horizontal block 1 is touched
        if  hBlockbig1.layer.presentationLayer()!.frame.contains(location) {
            hBlockbig1.center.x = location.x // -xOffset
            if  hBlockbig1.center.x < (hBlockbig1.frame.width/2) + diff {
                hBlockbig1.center.x = (hBlockbig1.frame.width/2) + diff
            } else if  hBlockbig1.center.x > gamesubView.frame.width - (hBlockbig1.frame.width/2) {
                hBlockbig1.center.x = (gamesubView.frame.width - (hBlockbig1.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlockbig1.frame, vBlocksmall.frame) {
                if  hBlockbig1.center.x < vBlocksmall.center.x {
                    hBlockbig1.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlocksmall.center.x {
                    hBlockbig1.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, vBlockbig.frame) {
                if  hBlockbig1.center.x < vBlockbig.center.x {
                    hBlockbig1.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlockbig.center.x {
                    hBlockbig1.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, vBlocksmall1.frame) {
                if  hBlockbig1.center.x < vBlocksmall1.center.x {
                    hBlockbig1.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlocksmall1.center.x {
                    hBlockbig1.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, vBlockbig1.frame) {
                if  hBlockbig1.center.x < vBlockbig1.center.x {
                    hBlockbig1.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlockbig.center.x {
                    hBlockbig1.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, vBlocksmall2.frame) {
                if  hBlockbig1.center.x < vBlocksmall2.center.x {
                    hBlockbig1.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlocksmall2.center.x {
                    hBlockbig1.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, vBlockbig2.frame) {
                if  hBlockbig1.center.x < vBlockbig2.center.x {
                    hBlockbig1.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlockbig2.center.x {
                    hBlockbig1.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, vBlocksmall3.frame) {
                if  hBlockbig1.center.x < vBlocksmall3.center.x {
                    hBlockbig1.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlocksmall3.center.x {
                    hBlockbig1.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, vBlockbig3.frame) {
                if  hBlockbig1.center.x < vBlockbig3.center.x {
                    hBlockbig1.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlockbig3.center.x {
                    hBlockbig1.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, vBlocksmall4.frame) {
                if  hBlockbig1.center.x < vBlocksmall4.center.x {
                    hBlockbig1.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlocksmall4.center.x {
                    hBlockbig1.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, vBlockbig4.frame) {
                if  hBlockbig1.center.x < vBlockbig4.center.x {
                    hBlockbig1.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > vBlockbig4.center.x {
                    hBlockbig1.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, hBlocksmall.frame) { // added
                if  hBlockbig1.center.x < hBlocksmall.center.x {
                    hBlockbig1.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlocksmall.center.x {
                    hBlockbig1.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, hBlockbig.frame) {
                if  hBlockbig1.center.x < hBlockbig.center.x {
                    hBlockbig1.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlockbig.center.x {
                    hBlockbig1.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, hBlocksmall1.frame) {
                if  hBlockbig1.center.x < hBlocksmall1.center.x {
                    hBlockbig1.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlocksmall1.center.x {
                    hBlockbig1.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, hBlocksmall2.frame) {
                if  hBlockbig1.center.x < hBlocksmall2.center.x {
                    hBlockbig1.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlocksmall2.center.x {
                    hBlockbig1.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, hBlockbig2.frame) {
                if  hBlockbig1.center.x < hBlockbig2.center.x {
                    hBlockbig1.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlockbig2.center.x {
                    hBlockbig1.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, hBlocksmall3.frame) {
                if  hBlockbig1.center.x < hBlocksmall3.center.x {
                    hBlockbig1.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlocksmall3.center.x {
                    hBlockbig1.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, hBlockbig3.frame) {
                if  hBlockbig1.center.x < hBlockbig3.center.x {
                    hBlockbig1.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlockbig3.center.x {
                    hBlockbig1.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig1.frame, hBlocksmall4.frame) {
                if  hBlockbig1.center.x < hBlocksmall4.center.x {
                    hBlockbig1.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlocksmall4.center.x {
                    hBlockbig1.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, hBlockbig4.frame) {
                if  hBlockbig1.center.x < hBlockbig4.center.x {
                    hBlockbig1.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > hBlockbig4.center.x {
                    hBlockbig1.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig1.frame, mainBlock.frame) {
                if  hBlockbig1.center.x < mainBlock.center.x {
                    hBlockbig1.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                } else if  hBlockbig1.center.x > mainBlock.center.x {
                    hBlockbig1.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlockbig1.frame.width/2 + diff)
                }
            }
            
            
        }
        
        // if big horizontal block 2 is touched
        if  hBlockbig2.layer.presentationLayer()!.frame.contains(location) {
            hBlockbig2.center.x = location.x // -xOffset
            if  hBlockbig2.center.x < (hBlockbig2.frame.width/2) + diff {
                hBlockbig2.center.x = (hBlockbig2.frame.width/2) + diff
            } else if  hBlockbig2.center.x > gamesubView.frame.width - (hBlockbig2.frame.width/2) {
                hBlockbig2.center.x = (gamesubView.frame.width - (hBlockbig2.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlockbig2.frame, vBlocksmall.frame) {
                if  hBlockbig2.center.x < vBlocksmall.center.x {
                    hBlockbig2.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlocksmall.center.x {
                    hBlockbig2.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, vBlockbig.frame) {
                if  hBlockbig2.center.x < vBlockbig.center.x {
                    hBlockbig2.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlockbig.center.x {
                    hBlockbig2.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, vBlocksmall1.frame) {
                if  hBlockbig2.center.x < vBlocksmall1.center.x {
                    hBlockbig2.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlocksmall1.center.x {
                    hBlockbig2.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, vBlockbig1.frame) {
                if  hBlockbig2.center.x < vBlockbig1.center.x {
                    hBlockbig2.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlockbig.center.x {
                    hBlockbig2.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, vBlocksmall2.frame) {
                if  hBlockbig2.center.x < vBlocksmall2.center.x {
                    hBlockbig2.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlocksmall2.center.x {
                    hBlockbig2.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, vBlockbig2.frame) {
                if  hBlockbig2.center.x < vBlockbig2.center.x {
                    hBlockbig2.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlockbig2.center.x {
                    hBlockbig2.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, vBlocksmall3.frame) {
                if  hBlockbig2.center.x < vBlocksmall3.center.x {
                    hBlockbig2.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlocksmall3.center.x {
                    hBlockbig2.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, vBlockbig3.frame) {
                if  hBlockbig2.center.x < vBlockbig3.center.x {
                    hBlockbig2.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlockbig3.center.x {
                    hBlockbig2.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, vBlocksmall4.frame) {
                if  hBlockbig2.center.x < vBlocksmall4.center.x {
                    hBlockbig2.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlocksmall4.center.x {
                    hBlockbig2.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, vBlockbig4.frame) {
                if  hBlockbig2.center.x < vBlockbig4.center.x {
                    hBlockbig2.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > vBlockbig4.center.x {
                    hBlockbig2.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, hBlocksmall.frame) { // added
                if  hBlockbig2.center.x < hBlocksmall.center.x {
                    hBlockbig2.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlocksmall.center.x {
                    hBlockbig2.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, hBlockbig.frame) {
                if  hBlockbig2.center.x < hBlockbig.center.x {
                    hBlockbig2.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlockbig.center.x {
                    hBlockbig2.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, hBlocksmall1.frame) {
                if  hBlockbig2.center.x < hBlocksmall1.center.x {
                    hBlockbig2.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlocksmall1.center.x {
                    hBlockbig2.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, hBlockbig1.frame) {
                if  hBlockbig2.center.x < hBlockbig1.center.x {
                    hBlockbig2.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlockbig.center.x {
                    hBlockbig2.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, hBlocksmall2.frame) {
                if  hBlockbig2.center.x < hBlocksmall2.center.x {
                    hBlockbig2.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlocksmall2.center.x {
                    hBlockbig2.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, hBlocksmall3.frame) {
                if  hBlockbig2.center.x < hBlocksmall3.center.x {
                    hBlockbig2.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlocksmall3.center.x {
                    hBlockbig2.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, hBlockbig3.frame) {
                if  hBlockbig2.center.x < hBlockbig3.center.x {
                    hBlockbig2.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlockbig3.center.x {
                    hBlockbig2.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig2.frame, hBlocksmall4.frame) {
                if  hBlockbig2.center.x < hBlocksmall4.center.x {
                    hBlockbig2.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlocksmall4.center.x {
                    hBlockbig2.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, hBlockbig4.frame) {
                if  hBlockbig2.center.x < hBlockbig4.center.x {
                    hBlockbig2.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > hBlockbig4.center.x {
                    hBlockbig2.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig2.frame, mainBlock.frame) {
                if  hBlockbig2.center.x < mainBlock.center.x {
                    hBlockbig2.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                } else if  hBlockbig2.center.x > mainBlock.center.x {
                    hBlockbig2.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlockbig2.frame.width/2 + diff)
                }
            }
            
        }
        
        // if big horizontal block 3 is touched
        if  hBlockbig3.layer.presentationLayer()!.frame.contains(location) {
            hBlockbig3.center.x = location.x // -xOffset
            if  hBlockbig3.center.x < (hBlockbig3.frame.width/2) + diff {
                hBlockbig3.center.x = (hBlockbig3.frame.width/2) + diff
            } else if  hBlockbig3.center.x > gamesubView.frame.width - (hBlockbig3.frame.width/2) {
                hBlockbig3.center.x = (gamesubView.frame.width - (hBlockbig3.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlockbig3.frame, vBlocksmall.frame) {
                if  hBlockbig3.center.x < vBlocksmall.center.x {
                    hBlockbig3.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlocksmall.center.x {
                    hBlockbig3.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, vBlockbig.frame) {
                if  hBlockbig3.center.x < vBlockbig.center.x {
                    hBlockbig3.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlockbig.center.x {
                    hBlockbig3.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, vBlocksmall1.frame) {
                if  hBlockbig3.center.x < vBlocksmall1.center.x {
                    hBlockbig3.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlocksmall1.center.x {
                    hBlockbig3.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, vBlockbig1.frame) {
                if  hBlockbig3.center.x < vBlockbig1.center.x {
                    hBlockbig3.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlockbig.center.x {
                    hBlockbig3.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, vBlocksmall2.frame) {
                if  hBlockbig3.center.x < vBlocksmall2.center.x {
                    hBlockbig3.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlocksmall2.center.x {
                    hBlockbig3.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, vBlockbig2.frame) {
                if  hBlockbig3.center.x < vBlockbig2.center.x {
                    hBlockbig3.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlockbig2.center.x {
                    hBlockbig3.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, vBlocksmall3.frame) {
                if  hBlockbig3.center.x < vBlocksmall3.center.x {
                    hBlockbig3.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlocksmall3.center.x {
                    hBlockbig3.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, vBlockbig3.frame) {
                if  hBlockbig3.center.x < vBlockbig3.center.x {
                    hBlockbig3.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlockbig3.center.x {
                    hBlockbig3.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, vBlocksmall4.frame) {
                if  hBlockbig3.center.x < vBlocksmall4.center.x {
                    hBlockbig3.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlocksmall4.center.x {
                    hBlockbig3.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, vBlockbig4.frame) {
                if  hBlockbig3.center.x < vBlockbig4.center.x {
                    hBlockbig3.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > vBlockbig4.center.x {
                    hBlockbig3.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, hBlocksmall.frame) { //added
                if  hBlockbig3.center.x < hBlocksmall.center.x {
                    hBlockbig3.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlocksmall.center.x {
                    hBlockbig3.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, hBlockbig.frame) {
                if  hBlockbig3.center.x < hBlockbig.center.x {
                    hBlockbig3.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlockbig.center.x {
                    hBlockbig3.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, hBlocksmall1.frame) {
                if  hBlockbig3.center.x < hBlocksmall1.center.x {
                    hBlockbig3.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlocksmall1.center.x {
                    hBlockbig3.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, hBlockbig1.frame) {
                if  hBlockbig3.center.x < hBlockbig1.center.x {
                    hBlockbig3.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlockbig.center.x {
                    hBlockbig3.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, hBlocksmall2.frame) {
                if  hBlockbig3.center.x < hBlocksmall2.center.x {
                    hBlockbig3.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlocksmall2.center.x {
                    hBlockbig3.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, hBlockbig2.frame) {
                if  hBlockbig3.center.x < hBlockbig2.center.x {
                    hBlockbig3.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlockbig2.center.x {
                    hBlockbig3.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, hBlocksmall3.frame) {
                if  hBlockbig3.center.x < hBlocksmall3.center.x {
                    hBlockbig3.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlocksmall3.center.x {
                    hBlockbig3.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig3.frame, hBlocksmall4.frame) {
                if  hBlockbig3.center.x < hBlocksmall4.center.x {
                    hBlockbig3.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlocksmall4.center.x {
                    hBlockbig3.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, hBlockbig4.frame) {
                if  hBlockbig3.center.x < hBlockbig4.center.x {
                    hBlockbig3.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > hBlockbig4.center.x {
                    hBlockbig3.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig3.frame, mainBlock.frame) {
                if  hBlockbig3.center.x < mainBlock.center.x {
                    hBlockbig3.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                } else if  hBlockbig3.center.x > mainBlock.center.x {
                    hBlockbig3.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlockbig3.frame.width/2 + diff)
                }
            }
            
            
        }
        
        // if big horizontal block 4 is touched
        if  hBlockbig4.layer.presentationLayer()!.frame.contains(location) {
            hBlockbig4.center.x = location.x // -xOffset
            if  hBlockbig4.center.x < (hBlockbig4.frame.width/2) + diff {
                hBlockbig4.center.x = (hBlockbig4.frame.width/2) + diff
            } else if  hBlockbig4.center.x > gamesubView.frame.width - (hBlockbig4.frame.width/2) {
                hBlockbig4.center.x = (gamesubView.frame.width - (hBlockbig4.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlockbig4.frame, vBlocksmall.frame) {
                if  hBlockbig4.center.x < vBlocksmall.center.x {
                    hBlockbig4.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlocksmall.center.x {
                    hBlockbig4.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, vBlockbig.frame) {
                if  hBlockbig4.center.x < vBlockbig.center.x {
                    hBlockbig4.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlockbig.center.x {
                    hBlockbig4.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, vBlocksmall1.frame) {
                if  hBlockbig4.center.x < vBlocksmall1.center.x {
                    hBlockbig4.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlocksmall1.center.x {
                    hBlockbig4.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, vBlockbig1.frame) {
                if  hBlockbig4.center.x < vBlockbig1.center.x {
                    hBlockbig4.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlockbig.center.x {
                    hBlockbig4.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, vBlocksmall2.frame) {
                if  hBlockbig4.center.x < vBlocksmall2.center.x {
                    hBlockbig4.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlocksmall2.center.x {
                    hBlockbig4.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, vBlockbig2.frame) {
                if  hBlockbig4.center.x < vBlockbig2.center.x {
                    hBlockbig4.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlockbig2.center.x {
                    hBlockbig4.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, vBlocksmall3.frame) {
                if  hBlockbig4.center.x < vBlocksmall3.center.x {
                    hBlockbig4.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlocksmall3.center.x {
                    hBlockbig4.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, vBlockbig3.frame) {
                if  hBlockbig4.center.x < vBlockbig3.center.x {
                    hBlockbig4.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlockbig3.center.x {
                    hBlockbig4.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, vBlocksmall4.frame) {
                if  hBlockbig4.center.x < vBlocksmall4.center.x {
                    hBlockbig4.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlocksmall4.center.x {
                    hBlockbig4.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, vBlockbig4.frame) {
                if  hBlockbig4.center.x < vBlockbig4.center.x {
                    hBlockbig4.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > vBlockbig4.center.x {
                    hBlockbig4.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, hBlocksmall.frame) {
                if  hBlockbig4.center.x < hBlocksmall.center.x {
                    hBlockbig4.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlocksmall.center.x {
                    hBlockbig4.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, hBlockbig.frame) {
                if  hBlockbig4.center.x < hBlockbig.center.x {
                    hBlockbig4.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlockbig.center.x {
                    hBlockbig4.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, hBlocksmall1.frame) {
                if  hBlockbig4.center.x < hBlocksmall1.center.x {
                    hBlockbig4.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlocksmall1.center.x {
                    hBlockbig4.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, hBlockbig1.frame) {
                if  hBlockbig4.center.x < hBlockbig1.center.x {
                    hBlockbig4.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlockbig.center.x {
                    hBlockbig4.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, hBlocksmall2.frame) {
                if  hBlockbig4.center.x < hBlocksmall2.center.x {
                    hBlockbig4.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlocksmall2.center.x {
                    hBlockbig4.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, hBlockbig2.frame) {
                if  hBlockbig4.center.x < hBlockbig2.center.x {
                    hBlockbig4.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlockbig2.center.x {
                    hBlockbig4.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlockbig4.frame, hBlocksmall3.frame) {
                if  hBlockbig4.center.x < hBlocksmall3.center.x {
                    hBlockbig4.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlocksmall3.center.x {
                    hBlockbig4.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, hBlockbig3.frame) {
                if  hBlockbig4.center.x < hBlockbig3.center.x {
                    hBlockbig4.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlockbig3.center.x {
                    hBlockbig4.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            else if CGRectIntersectsRect(hBlockbig4.frame, hBlocksmall4.frame) {
                if  hBlockbig4.center.x < hBlocksmall4.center.x {
                    hBlockbig4.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > hBlocksmall4.center.x {
                    hBlockbig4.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlockbig4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlockbig4.frame, mainBlock.frame) {
                if  hBlockbig4.center.x < mainBlock.center.x {
                    hBlockbig4.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                } else if  hBlockbig4.center.x > mainBlock.center.x {
                    hBlockbig4.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlockbig4.frame.width/2 + diff)
                }
            }
            
            
        }
        
        
        
        
        
        
        
        
        
        // if horizontal small block is touched
        if  hBlocksmall.layer.presentationLayer()!.frame.contains(location) {
            hBlocksmall.center.x = location.x // -xOffset
            if  hBlocksmall.center.x < (hBlocksmall.frame.width/2) + diff {
                hBlocksmall.center.x = (hBlocksmall.frame.width/2) + diff
            } else if  hBlocksmall.center.x > gamesubView.frame.width - (hBlocksmall.frame.width/2) {
                hBlocksmall.center.x = (gamesubView.frame.width - (hBlocksmall.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlocksmall.frame, vBlocksmall.frame) {
                if  hBlocksmall.center.x < vBlocksmall.center.x {
                    hBlocksmall.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlocksmall.center.x {
                    hBlocksmall.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, vBlockbig.frame) {
                if  hBlocksmall.center.x < vBlockbig.center.x {
                    hBlocksmall.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlockbig.center.x {
                    hBlocksmall.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, vBlocksmall1.frame) {
                if  hBlocksmall.center.x < vBlocksmall1.center.x {
                    hBlocksmall.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlocksmall1.center.x {
                    hBlocksmall.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, vBlockbig1.frame) {
                if  hBlocksmall.center.x < vBlockbig1.center.x {
                    hBlocksmall.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlockbig1.center.x {
                    hBlocksmall.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, vBlocksmall2.frame) {
                if  hBlocksmall.center.x < vBlocksmall2.center.x {
                    hBlocksmall.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlocksmall2.center.x {
                    hBlocksmall.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, vBlockbig2.frame) {
                if  hBlocksmall.center.x < vBlockbig2.center.x {
                    hBlocksmall.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlockbig2.center.x {
                    hBlocksmall.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, vBlocksmall3.frame) {
                if  hBlocksmall.center.x < vBlocksmall3.center.x {
                    hBlocksmall.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlocksmall3.center.x {
                    hBlocksmall.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, vBlockbig3.frame) {
                if  hBlocksmall.center.x < vBlockbig3.center.x {
                    hBlocksmall.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlockbig3.center.x {
                    hBlocksmall.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, vBlocksmall4.frame) {
                if  hBlocksmall.center.x < vBlocksmall4.center.x {
                    hBlocksmall.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlocksmall4.center.x {
                    hBlocksmall.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, vBlockbig4.frame) {
                if  hBlocksmall.center.x < vBlockbig4.center.x {
                    hBlocksmall.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > vBlockbig4.center.x {
                    hBlocksmall.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }  else if CGRectIntersectsRect(hBlocksmall.frame, hBlockbig.frame) { //added
                if  hBlocksmall.center.x < hBlockbig.center.x {
                    hBlocksmall.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlockbig.center.x {
                    hBlocksmall.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, hBlocksmall1.frame) {
                if  hBlocksmall.center.x < hBlocksmall1.center.x {
                    hBlocksmall.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlocksmall1.center.x {
                    hBlocksmall.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, hBlockbig1.frame) {
                if  hBlocksmall.center.x < hBlockbig1.center.x {
                    hBlocksmall.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlockbig1.center.x {
                    hBlocksmall.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, hBlocksmall2.frame) {
                if  hBlocksmall.center.x < hBlocksmall2.center.x {
                    hBlocksmall.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlocksmall2.center.x {
                    hBlocksmall.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, hBlockbig2.frame) {
                if  hBlocksmall.center.x < hBlockbig2.center.x {
                    hBlocksmall.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlockbig2.center.x {
                    hBlocksmall.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, hBlocksmall3.frame) {
                if  hBlocksmall.center.x < hBlocksmall3.center.x {
                    hBlocksmall.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlocksmall3.center.x {
                    hBlocksmall.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, hBlockbig3.frame) {
                if  hBlocksmall.center.x < hBlockbig3.center.x {
                    hBlocksmall.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlockbig3.center.x {
                    hBlocksmall.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall.frame, hBlocksmall4.frame) {
                if  hBlocksmall.center.x < hBlocksmall4.center.x {
                    hBlocksmall.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlocksmall4.center.x {
                    hBlocksmall.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, hBlockbig4.frame) {
                if  hBlocksmall.center.x < hBlockbig4.center.x {
                    hBlocksmall.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > hBlockbig4.center.x {
                    hBlocksmall.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall.frame, mainBlock.frame) {
                if  hBlocksmall.center.x < mainBlock.center.x {
                    hBlocksmall.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                } else if  hBlocksmall.center.x > mainBlock.center.x {
                    hBlocksmall.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlocksmall.frame.width/2 + diff)
                }
            }
            
        }
        
        // if horizontal small block1 is touched
        if  hBlocksmall1.layer.presentationLayer()!.frame.contains(location) {
            hBlocksmall1.center.x = location.x // -xOffset
            if  hBlocksmall1.center.x < (hBlocksmall1.frame.width/2) + diff {
                hBlocksmall1.center.x = (hBlocksmall1.frame.width/2) + diff
            } else if  hBlocksmall1.center.x > gamesubView.frame.width - (hBlocksmall1.frame.width/2) {
                hBlocksmall1.center.x = (gamesubView.frame.width - (hBlocksmall1.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlocksmall1.frame, vBlocksmall.frame) {
                if  hBlocksmall1.center.x < vBlocksmall.center.x {
                    hBlocksmall1.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlocksmall.center.x {
                    hBlocksmall1.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, vBlockbig.frame) {
                if  hBlocksmall1.center.x < vBlockbig.center.x {
                    hBlocksmall1.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlockbig.center.x {
                    hBlocksmall1.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, vBlocksmall1.frame) {
                if  hBlocksmall1.center.x < vBlocksmall1.center.x {
                    hBlocksmall1.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlocksmall1.center.x {
                    hBlocksmall1.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, vBlockbig1.frame) {
                if  hBlocksmall1.center.x < vBlockbig1.center.x {
                    hBlocksmall1.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlockbig1.center.x {
                    hBlocksmall1.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, vBlocksmall2.frame) {
                if  hBlocksmall1.center.x < vBlocksmall2.center.x {
                    hBlocksmall1.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlocksmall2.center.x {
                    hBlocksmall1.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, vBlockbig2.frame) {
                if  hBlocksmall1.center.x < vBlockbig2.center.x {
                    hBlocksmall1.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlockbig2.center.x {
                    hBlocksmall1.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, vBlocksmall3.frame) {
                if  hBlocksmall1.center.x < vBlocksmall3.center.x {
                    hBlocksmall1.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlocksmall3.center.x {
                    hBlocksmall1.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, vBlockbig3.frame) {
                if  hBlocksmall1.center.x < vBlockbig3.center.x {
                    hBlocksmall1.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlockbig3.center.x {
                    hBlocksmall1.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, vBlocksmall4.frame) {
                if  hBlocksmall1.center.x < vBlocksmall4.center.x {
                    hBlocksmall1.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlocksmall4.center.x {
                    hBlocksmall1.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, vBlockbig4.frame) {
                if  hBlocksmall1.center.x < vBlockbig4.center.x {
                    hBlocksmall1.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > vBlockbig4.center.x {
                    hBlocksmall1.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }  else if CGRectIntersectsRect(hBlocksmall1.frame, hBlocksmall.frame) { // added
                if  hBlocksmall1.center.x < hBlocksmall.center.x {
                    hBlocksmall1.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlocksmall.center.x {
                    hBlocksmall1.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, hBlockbig.frame) {
                if  hBlocksmall1.center.x < hBlockbig.center.x {
                    hBlocksmall1.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlockbig.center.x {
                    hBlocksmall1.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            else if CGRectIntersectsRect(hBlocksmall1.frame, hBlockbig1.frame) {
                if  hBlocksmall1.center.x < hBlockbig1.center.x {
                    hBlocksmall1.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlockbig1.center.x {
                    hBlocksmall1.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, hBlocksmall2.frame) {
                if  hBlocksmall1.center.x < hBlocksmall2.center.x {
                    hBlocksmall1.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlocksmall2.center.x {
                    hBlocksmall1.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, hBlockbig2.frame) {
                if  hBlocksmall1.center.x < hBlockbig2.center.x {
                    hBlocksmall1.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlockbig2.center.x {
                    hBlocksmall1.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, hBlocksmall3.frame) {
                if  hBlocksmall1.center.x < hBlocksmall3.center.x {
                    hBlocksmall1.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlocksmall3.center.x {
                    hBlocksmall1.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, hBlockbig3.frame) {
                if  hBlocksmall1.center.x < hBlockbig3.center.x {
                    hBlocksmall1.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlockbig3.center.x {
                    hBlocksmall1.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall1.frame, hBlocksmall4.frame) {
                if  hBlocksmall1.center.x < hBlocksmall4.center.x {
                    hBlocksmall1.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlocksmall4.center.x {
                    hBlocksmall1.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, hBlockbig4.frame) {
                if  hBlocksmall1.center.x < hBlockbig4.center.x {
                    hBlocksmall1.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > hBlockbig4.center.x {
                    hBlocksmall1.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall1.frame, mainBlock.frame) {
                if  hBlocksmall1.center.x < mainBlock.center.x {
                    hBlocksmall1.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                } else if  hBlocksmall1.center.x > mainBlock.center.x {
                    hBlocksmall1.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlocksmall1.frame.width/2 + diff)
                }
            }
            
        }
        
        
        // if horizontal small block 2 is touched
        if  hBlocksmall2.layer.presentationLayer()!.frame.contains(location) {
            hBlocksmall2.center.x = location.x // -xOffset
            if  hBlocksmall2.center.x < (hBlocksmall2.frame.width/2) + diff {
                hBlocksmall2.center.x = (hBlocksmall2.frame.width/2) + diff
            } else if  hBlocksmall2.center.x > gamesubView.frame.width - (hBlocksmall2.frame.width/2) {
                hBlocksmall2.center.x = (gamesubView.frame.width - (hBlocksmall2.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlocksmall2.frame, vBlocksmall.frame) {
                if  hBlocksmall2.center.x < vBlocksmall.center.x {
                    hBlocksmall2.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlocksmall.center.x {
                    hBlocksmall2.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, vBlockbig.frame) {
                if  hBlocksmall2.center.x < vBlockbig.center.x {
                    hBlocksmall2.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlockbig.center.x {
                    hBlocksmall2.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, vBlocksmall1.frame) {
                if  hBlocksmall2.center.x < vBlocksmall1.center.x {
                    hBlocksmall2.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlocksmall1.center.x {
                    hBlocksmall2.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, vBlockbig1.frame) {
                if  hBlocksmall2.center.x < vBlockbig1.center.x {
                    hBlocksmall2.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlockbig1.center.x {
                    hBlocksmall2.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, vBlocksmall2.frame) {
                if  hBlocksmall2.center.x < vBlocksmall2.center.x {
                    hBlocksmall2.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlocksmall2.center.x {
                    hBlocksmall2.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, vBlockbig2.frame) {
                if  hBlocksmall2.center.x < vBlockbig2.center.x {
                    hBlocksmall2.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlockbig2.center.x {
                    hBlocksmall2.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, vBlocksmall3.frame) {
                if  hBlocksmall2.center.x < vBlocksmall3.center.x {
                    hBlocksmall2.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlocksmall3.center.x {
                    hBlocksmall2.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, vBlockbig3.frame) {
                if  hBlocksmall2.center.x < vBlockbig3.center.x {
                    hBlocksmall2.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlockbig3.center.x {
                    hBlocksmall2.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, vBlocksmall4.frame) {
                if  hBlocksmall2.center.x < vBlocksmall4.center.x {
                    hBlocksmall2.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlocksmall4.center.x {
                    hBlocksmall2.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, vBlockbig4.frame) {
                if  hBlocksmall2.center.x < vBlockbig4.center.x {
                    hBlocksmall2.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > vBlockbig4.center.x {
                    hBlocksmall2.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }  else if CGRectIntersectsRect(hBlocksmall2.frame, hBlocksmall.frame) { // added
                if  hBlocksmall2.center.x < hBlocksmall.center.x {
                    hBlocksmall2.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlocksmall.center.x {
                    hBlocksmall2.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, hBlockbig.frame) {
                if  hBlocksmall2.center.x < hBlockbig.center.x {
                    hBlocksmall2.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlockbig.center.x {
                    hBlocksmall2.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, hBlocksmall1.frame) {
                if  hBlocksmall2.center.x < hBlocksmall1.center.x {
                    hBlocksmall2.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlocksmall1.center.x {
                    hBlocksmall2.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, hBlockbig1.frame) {
                if  hBlocksmall2.center.x < hBlockbig1.center.x {
                    hBlocksmall2.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlockbig1.center.x {
                    hBlocksmall2.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            else if CGRectIntersectsRect(hBlocksmall2.frame, hBlockbig2.frame) {
                if  hBlocksmall2.center.x < hBlockbig2.center.x {
                    hBlocksmall2.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlockbig2.center.x {
                    hBlocksmall2.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, hBlocksmall3.frame) {
                if  hBlocksmall2.center.x < hBlocksmall3.center.x {
                    hBlocksmall2.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlocksmall3.center.x {
                    hBlocksmall2.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, hBlockbig3.frame) {
                if  hBlocksmall2.center.x < hBlockbig3.center.x {
                    hBlocksmall2.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlockbig3.center.x {
                    hBlocksmall2.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall2.frame, hBlocksmall4.frame) {
                if  hBlocksmall2.center.x < hBlocksmall4.center.x {
                    hBlocksmall2.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlocksmall4.center.x {
                    hBlocksmall2.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, hBlockbig4.frame) {
                if  hBlocksmall2.center.x < hBlockbig4.center.x {
                    hBlocksmall2.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > hBlockbig4.center.x {
                    hBlocksmall2.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall2.frame, mainBlock.frame) {
                if  hBlocksmall2.center.x < mainBlock.center.x {
                    hBlocksmall2.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                } else if  hBlocksmall2.center.x > mainBlock.center.x {
                    hBlocksmall2.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlocksmall2.frame.width/2 + diff)
                }
            }
            
        }
        
        // if horizontal small block 3 is touched
        if  hBlocksmall3.layer.presentationLayer()!.frame.contains(location) {
            hBlocksmall3.center.x = location.x // -xOffset
            if  hBlocksmall3.center.x < (hBlocksmall3.frame.width/2) + diff {
                hBlocksmall3.center.x = (hBlocksmall3.frame.width/2) + diff
            } else if  hBlocksmall3.center.x > gamesubView.frame.width - (hBlocksmall3.frame.width/2) {
                hBlocksmall3.center.x = (gamesubView.frame.width - (hBlocksmall3.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlocksmall3.frame, vBlocksmall.frame) {
                if  hBlocksmall3.center.x < vBlocksmall.center.x {
                    hBlocksmall3.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlocksmall.center.x {
                    hBlocksmall3.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, vBlockbig.frame) {
                if  hBlocksmall3.center.x < vBlockbig.center.x {
                    hBlocksmall3.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlockbig.center.x {
                    hBlocksmall3.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, vBlocksmall1.frame) {
                if  hBlocksmall3.center.x < vBlocksmall1.center.x {
                    hBlocksmall3.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlocksmall1.center.x {
                    hBlocksmall3.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, vBlockbig1.frame) {
                if  hBlocksmall3.center.x < vBlockbig1.center.x {
                    hBlocksmall3.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlockbig1.center.x {
                    hBlocksmall3.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, vBlocksmall2.frame) {
                if  hBlocksmall3.center.x < vBlocksmall2.center.x {
                    hBlocksmall3.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlocksmall2.center.x {
                    hBlocksmall3.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, vBlockbig2.frame) {
                if  hBlocksmall3.center.x < vBlockbig2.center.x {
                    hBlocksmall3.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlockbig2.center.x {
                    hBlocksmall3.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, vBlocksmall3.frame) {
                if  hBlocksmall3.center.x < vBlocksmall3.center.x {
                    hBlocksmall3.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlocksmall3.center.x {
                    hBlocksmall3.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, vBlockbig3.frame) {
                if  hBlocksmall3.center.x < vBlockbig3.center.x {
                    hBlocksmall3.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlockbig3.center.x {
                    hBlocksmall3.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, vBlocksmall4.frame) {
                if  hBlocksmall3.center.x < vBlocksmall4.center.x {
                    hBlocksmall3.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlocksmall4.center.x {
                    hBlocksmall3.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, vBlockbig4.frame) {
                if  hBlocksmall3.center.x < vBlockbig4.center.x {
                    hBlocksmall3.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > vBlockbig4.center.x {
                    hBlocksmall3.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, hBlocksmall.frame) { // added
                if  hBlocksmall3.center.x < hBlocksmall.center.x {
                    hBlocksmall3.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlocksmall.center.x {
                    hBlocksmall3.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, hBlockbig.frame) {
                if  hBlocksmall3.center.x < hBlockbig.center.x {
                    hBlocksmall3.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlockbig.center.x {
                    hBlocksmall3.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, hBlocksmall1.frame) {
                if  hBlocksmall3.center.x < hBlocksmall1.center.x {
                    hBlocksmall3.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlocksmall1.center.x {
                    hBlocksmall3.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, hBlockbig1.frame) {
                if  hBlocksmall3.center.x < hBlockbig1.center.x {
                    hBlocksmall3.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlockbig1.center.x {
                    hBlocksmall3.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, hBlocksmall2.frame) {
                if  hBlocksmall3.center.x < hBlocksmall2.center.x {
                    hBlocksmall3.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlocksmall2.center.x {
                    hBlocksmall3.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, hBlockbig2.frame) {
                if  hBlocksmall3.center.x < hBlockbig2.center.x {
                    hBlocksmall3.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlockbig2.center.x {
                    hBlocksmall3.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            else if CGRectIntersectsRect(hBlocksmall3.frame, hBlockbig3.frame) {
                if  hBlocksmall3.center.x < hBlockbig3.center.x {
                    hBlocksmall3.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlockbig3.center.x {
                    hBlocksmall3.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall3.frame, hBlocksmall4.frame) {
                if  hBlocksmall3.center.x < hBlocksmall4.center.x {
                    hBlocksmall3.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlocksmall4.center.x {
                    hBlocksmall3.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, hBlockbig4.frame) {
                if  hBlocksmall3.center.x < hBlockbig4.center.x {
                    hBlocksmall3.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > hBlockbig4.center.x {
                    hBlocksmall3.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall3.frame, mainBlock.frame) {
                if  hBlocksmall3.center.x < mainBlock.center.x {
                    hBlocksmall3.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                } else if  hBlocksmall3.center.x > mainBlock.center.x {
                    hBlocksmall3.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlocksmall3.frame.width/2 + diff)
                }
            }
            
        }
        
        // if horizontal small block 4 is touched
        if  hBlocksmall4.layer.presentationLayer()!.frame.contains(location) {
            hBlocksmall4.center.x = location.x // -xOffset
            if  hBlocksmall4.center.x < (hBlocksmall4.frame.width/2) + diff {
                hBlocksmall4.center.x = (hBlocksmall4.frame.width/2) + diff
            } else if  hBlocksmall4.center.x > gamesubView.frame.width - (hBlocksmall4.frame.width/2) {
                hBlocksmall4.center.x = (gamesubView.frame.width - (hBlocksmall4.frame.width/2)) - diff
            }
            
            if CGRectIntersectsRect(hBlocksmall4.frame, vBlocksmall.frame) {
                if  hBlocksmall4.center.x < vBlocksmall.center.x {
                    hBlocksmall4.center.x = vBlocksmall.center.x - (vBlocksmall.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlocksmall.center.x {
                    hBlocksmall4.center.x = vBlocksmall.center.x + (vBlocksmall.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, vBlockbig.frame) {
                if  hBlocksmall4.center.x < vBlockbig.center.x {
                    hBlocksmall4.center.x = vBlockbig.center.x - (vBlockbig.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlockbig.center.x {
                    hBlocksmall4.center.x = vBlockbig.center.x + (vBlockbig.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, vBlocksmall1.frame) {
                if  hBlocksmall4.center.x < vBlocksmall1.center.x {
                    hBlocksmall4.center.x = vBlocksmall1.center.x - (vBlocksmall1.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlocksmall1.center.x {
                    hBlocksmall4.center.x = vBlocksmall1.center.x + (vBlocksmall1.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, vBlockbig1.frame) {
                if  hBlocksmall4.center.x < vBlockbig1.center.x {
                    hBlocksmall4.center.x = vBlockbig1.center.x - (vBlockbig1.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlockbig1.center.x {
                    hBlocksmall4.center.x = vBlockbig1.center.x + (vBlockbig1.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, vBlocksmall2.frame) {
                if  hBlocksmall4.center.x < vBlocksmall2.center.x {
                    hBlocksmall4.center.x = vBlocksmall2.center.x - (vBlocksmall2.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlocksmall2.center.x {
                    hBlocksmall4.center.x = vBlocksmall2.center.x + (vBlocksmall2.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, vBlockbig2.frame) {
                if  hBlocksmall4.center.x < vBlockbig2.center.x {
                    hBlocksmall4.center.x = vBlockbig2.center.x - (vBlockbig2.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlockbig2.center.x {
                    hBlocksmall4.center.x = vBlockbig2.center.x + (vBlockbig2.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, vBlocksmall3.frame) {
                if  hBlocksmall4.center.x < vBlocksmall3.center.x {
                    hBlocksmall4.center.x = vBlocksmall3.center.x - (vBlocksmall3.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlocksmall3.center.x {
                    hBlocksmall4.center.x = vBlocksmall3.center.x + (vBlocksmall3.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, vBlockbig3.frame) {
                if  hBlocksmall4.center.x < vBlockbig3.center.x {
                    hBlocksmall4.center.x = vBlockbig3.center.x - (vBlockbig3.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlockbig3.center.x {
                    hBlocksmall4.center.x = vBlockbig3.center.x + (vBlockbig3.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, vBlocksmall4.frame) {
                if  hBlocksmall4.center.x < vBlocksmall4.center.x {
                    hBlocksmall4.center.x = vBlocksmall4.center.x - (vBlocksmall4.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlocksmall4.center.x {
                    hBlocksmall4.center.x = vBlocksmall4.center.x + (vBlocksmall4.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, vBlockbig4.frame) {
                if  hBlocksmall4.center.x < vBlockbig4.center.x {
                    hBlocksmall4.center.x = vBlockbig4.center.x - (vBlockbig4.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > vBlockbig4.center.x {
                    hBlocksmall4.center.x = vBlockbig4.center.x + (vBlockbig4.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, hBlocksmall.frame) { // added
                if  hBlocksmall4.center.x < hBlocksmall.center.x {
                    hBlocksmall4.center.x = hBlocksmall.center.x - (hBlocksmall.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlocksmall.center.x {
                    hBlocksmall4.center.x = hBlocksmall.center.x + (hBlocksmall.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, hBlockbig.frame) {
                if  hBlocksmall4.center.x < hBlockbig.center.x {
                    hBlocksmall4.center.x = hBlockbig.center.x - (hBlockbig.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlockbig.center.x {
                    hBlocksmall4.center.x = hBlockbig.center.x + (hBlockbig.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, hBlocksmall1.frame) {
                if  hBlocksmall4.center.x < hBlocksmall1.center.x {
                    hBlocksmall4.center.x = hBlocksmall1.center.x - (hBlocksmall1.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlocksmall1.center.x {
                    hBlocksmall4.center.x = hBlocksmall1.center.x + (hBlocksmall1.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, hBlockbig1.frame) {
                if  hBlocksmall4.center.x < hBlockbig1.center.x {
                    hBlocksmall4.center.x = hBlockbig1.center.x - (hBlockbig1.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlockbig1.center.x {
                    hBlocksmall4.center.x = hBlockbig1.center.x + (hBlockbig1.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, hBlocksmall2.frame) {
                if  hBlocksmall4.center.x < hBlocksmall2.center.x {
                    hBlocksmall4.center.x = hBlocksmall2.center.x - (hBlocksmall2.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlocksmall2.center.x {
                    hBlocksmall4.center.x = hBlocksmall2.center.x + (hBlocksmall2.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, hBlockbig2.frame) {
                if  hBlocksmall4.center.x < hBlockbig2.center.x {
                    hBlocksmall4.center.x = hBlockbig2.center.x - (hBlockbig2.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlockbig2.center.x {
                    hBlocksmall4.center.x = hBlockbig2.center.x + (hBlockbig2.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, hBlocksmall3.frame) {
                if  hBlocksmall4.center.x < hBlocksmall3.center.x {
                    hBlocksmall4.center.x = hBlocksmall3.center.x - (hBlocksmall3.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlocksmall3.center.x {
                    hBlocksmall4.center.x = hBlocksmall3.center.x + (hBlocksmall3.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, hBlockbig3.frame) {
                if  hBlocksmall4.center.x < hBlockbig3.center.x {
                    hBlocksmall4.center.x = hBlockbig3.center.x - (hBlockbig3.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlockbig3.center.x {
                    hBlocksmall4.center.x = hBlockbig3.center.x + (hBlockbig3.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            if CGRectIntersectsRect(hBlocksmall4.frame, hBlocksmall4.frame) {
                if  hBlocksmall4.center.x < hBlocksmall4.center.x {
                    hBlocksmall4.center.x = hBlocksmall4.center.x - (hBlocksmall4.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlocksmall4.center.x {
                    hBlocksmall4.center.x = hBlocksmall4.center.x + (hBlocksmall4.frame.width/2 + hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, hBlockbig4.frame) {
                if  hBlocksmall4.center.x < hBlockbig4.center.x {
                    hBlocksmall4.center.x = hBlockbig4.center.x - (hBlockbig4.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > hBlockbig4.center.x {
                    hBlocksmall4.center.x = hBlockbig4.center.x + (hBlockbig4.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            } else if CGRectIntersectsRect(hBlocksmall4.frame, mainBlock.frame) {
                if  hBlocksmall4.center.x < mainBlock.center.x {
                    hBlocksmall4.center.x = mainBlock.center.x - (mainBlock.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                } else if  hBlocksmall4.center.x > mainBlock.center.x {
                    hBlocksmall4.center.x = mainBlock.center.x + (mainBlock.frame.width/2 +  hBlocksmall4.frame.width/2 + diff)
                }
            }
            
        }
        
        
        
        
        
        // if vertical block small is touched
        if  vBlocksmall.layer.presentationLayer()!.frame.contains(location) {
            vBlocksmall.center.y = location.y // -yOffset
            if  vBlocksmall.center.y < (vBlocksmall.frame.height/2) + diff {
                vBlocksmall.center.y = (vBlocksmall.frame.height/2) + diff
            } else if  vBlocksmall.center.y > gamesubView.frame.width - (vBlocksmall.frame.height/2) {
                vBlocksmall.center.y = (gamesubView.frame.width - (vBlocksmall.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlocksmall.frame, mainBlock.frame) {
                if  vBlocksmall.center.y < mainBlock.center.y {
                    vBlocksmall.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                    
                } else if  vBlocksmall.center.y > mainBlock.center.y {
                    vBlocksmall.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlockbig.frame) {
                if  vBlocksmall.center.y < hBlockbig.center.y {
                    vBlocksmall.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlockbig.center.y {
                    vBlocksmall.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlocksmall.frame) {
                if  vBlocksmall.center.y < hBlocksmall.center.y {
                    vBlocksmall.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlocksmall.center.y {
                    vBlocksmall.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlockbig1.frame) {
                if  vBlocksmall.center.y < hBlockbig1.center.y {
                    vBlocksmall.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlockbig1.center.y {
                    vBlocksmall.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlocksmall1.frame) {
                if  vBlocksmall.center.y < hBlocksmall1.center.y {
                    vBlocksmall.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlocksmall1.center.y {
                    vBlocksmall.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlockbig2.frame) {
                if  vBlocksmall.center.y < hBlockbig2.center.y {
                    vBlocksmall.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlockbig2.center.y {
                    vBlocksmall.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlocksmall2.frame) {
                if  vBlocksmall.center.y < hBlocksmall2.center.y {
                    vBlocksmall.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlocksmall2.center.y {
                    vBlocksmall.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlockbig3.frame) {
                if  vBlocksmall.center.y < hBlockbig3.center.y {
                    vBlocksmall.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlockbig3.center.y {
                    vBlocksmall.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlocksmall3.frame) {
                if  vBlocksmall.center.y < hBlocksmall3.center.y {
                    vBlocksmall.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlocksmall3.center.y {
                    vBlocksmall.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlockbig4.frame) {
                if  vBlocksmall.center.y < hBlockbig4.center.y {
                    vBlocksmall.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlockbig4.center.y {
                    vBlocksmall.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,hBlocksmall4.frame) {
                if  vBlocksmall.center.y < hBlocksmall4.center.y {
                    vBlocksmall.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > hBlocksmall4.center.y {
                    vBlocksmall.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlockbig.frame) { // added
                if  vBlocksmall.center.y < vBlockbig.center.y {
                    vBlocksmall.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlockbig.center.y {
                    vBlocksmall.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlockbig1.frame) {
                if  vBlocksmall.center.y < vBlockbig1.center.y {
                    vBlocksmall.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlockbig1.center.y {
                    vBlocksmall.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlocksmall1.frame) {
                if  vBlocksmall.center.y < vBlocksmall1.center.y {
                    vBlocksmall.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlocksmall1.center.y {
                    vBlocksmall.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlockbig2.frame) {
                if  vBlocksmall.center.y < vBlockbig2.center.y {
                    vBlocksmall.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlockbig2.center.y {
                    vBlocksmall.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlocksmall2.frame) {
                if  vBlocksmall.center.y < vBlocksmall2.center.y {
                    vBlocksmall.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlocksmall2.center.y {
                    vBlocksmall.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlockbig3.frame) {
                if  vBlocksmall.center.y < vBlockbig3.center.y {
                    vBlocksmall.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlockbig3.center.y {
                    vBlocksmall.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlocksmall3.frame) {
                if  vBlocksmall.center.y < vBlocksmall3.center.y {
                    vBlocksmall.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlocksmall3.center.y {
                    vBlocksmall.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlockbig4.frame) {
                if  vBlocksmall.center.y < vBlockbig4.center.y {
                    vBlocksmall.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlockbig4.center.y {
                    vBlocksmall.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlocksmall.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall.frame,vBlocksmall4.frame) {
                if  vBlocksmall.center.y < vBlocksmall4.center.y {
                    vBlocksmall.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall.center.y > vBlocksmall4.center.y {
                    vBlocksmall.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlocksmall.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block small 1 is touched
        if  vBlocksmall1.layer.presentationLayer()!.frame.contains(location) {
            vBlocksmall1.center.y = location.y // -yOffset
            if  vBlocksmall1.center.y < (vBlocksmall1.frame.height/2) + diff {
                vBlocksmall1.center.y = (vBlocksmall1.frame.height/2) + diff
            } else if  vBlocksmall1.center.y > gamesubView.frame.width - (vBlocksmall1.frame.height/2) {
                vBlocksmall1.center.y = (gamesubView.frame.width - (vBlocksmall1.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlocksmall1.frame, mainBlock.frame) {
                if  vBlocksmall1.center.y < mainBlock.center.y {
                    vBlocksmall1.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                    
                } else if  vBlocksmall1.center.y > mainBlock.center.y {
                    vBlocksmall1.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlockbig.frame) {
                if  vBlocksmall1.center.y < hBlockbig.center.y {
                    vBlocksmall1.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlockbig.center.y {
                    vBlocksmall1.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlocksmall.frame) {
                if  vBlocksmall1.center.y < hBlocksmall.center.y {
                    vBlocksmall1.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlocksmall.center.y {
                    vBlocksmall1.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlockbig1.frame) {
                if  vBlocksmall1.center.y < hBlockbig1.center.y {
                    vBlocksmall1.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlockbig1.center.y {
                    vBlocksmall1.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlocksmall1.frame) {
                if  vBlocksmall1.center.y < hBlocksmall1.center.y {
                    vBlocksmall1.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlocksmall1.center.y {
                    vBlocksmall1.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlockbig2.frame) {
                if  vBlocksmall1.center.y < hBlockbig2.center.y {
                    vBlocksmall1.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlockbig2.center.y {
                    vBlocksmall1.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlocksmall2.frame) {
                if  vBlocksmall1.center.y < hBlocksmall2.center.y {
                    vBlocksmall1.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlocksmall2.center.y {
                    vBlocksmall1.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlockbig3.frame) {
                if  vBlocksmall1.center.y < hBlockbig3.center.y {
                    vBlocksmall1.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlockbig3.center.y {
                    vBlocksmall1.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlocksmall3.frame) {
                if  vBlocksmall1.center.y < hBlocksmall3.center.y {
                    vBlocksmall1.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlocksmall3.center.y {
                    vBlocksmall1.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlockbig4.frame) {
                if  vBlocksmall1.center.y < hBlockbig4.center.y {
                    vBlocksmall1.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlockbig4.center.y {
                    vBlocksmall1.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,hBlocksmall4.frame) {
                if  vBlocksmall1.center.y < hBlocksmall4.center.y {
                    vBlocksmall1.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > hBlocksmall4.center.y {
                    vBlocksmall1.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlocksmall1.frame,vBlockbig.frame) { // added
                if  vBlocksmall1.center.y < vBlockbig.center.y {
                    vBlocksmall1.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlockbig.center.y {
                    vBlocksmall1.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlocksmall.frame) {
                if  vBlocksmall1.center.y < vBlocksmall.center.y {
                    vBlocksmall1.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlocksmall.center.y {
                    vBlocksmall1.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlockbig1.frame) {
                if  vBlocksmall1.center.y < vBlockbig1.center.y {
                    vBlocksmall1.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlockbig1.center.y {
                    vBlocksmall1.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlockbig2.frame) {
                if  vBlocksmall1.center.y < vBlockbig2.center.y {
                    vBlocksmall1.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlockbig2.center.y {
                    vBlocksmall1.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlocksmall2.frame) {
                if  vBlocksmall1.center.y < vBlocksmall2.center.y {
                    vBlocksmall1.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlocksmall2.center.y {
                    vBlocksmall1.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlockbig3.frame) {
                if  vBlocksmall1.center.y < vBlockbig3.center.y {
                    vBlocksmall1.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlockbig3.center.y {
                    vBlocksmall1.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlocksmall3.frame) {
                if  vBlocksmall1.center.y < vBlocksmall3.center.y {
                    vBlocksmall1.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlocksmall3.center.y {
                    vBlocksmall1.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlockbig4.frame) {
                if  vBlocksmall1.center.y < vBlockbig4.center.y {
                    vBlocksmall1.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlockbig4.center.y {
                    vBlocksmall1.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall1.frame,vBlocksmall4.frame) {
                if  vBlocksmall1.center.y < vBlocksmall4.center.y {
                    vBlocksmall1.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 + vBlocksmall1.frame.height/2 + diff)
                } else if  vBlocksmall1.center.y > vBlocksmall4.center.y {
                    vBlocksmall1.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlocksmall1.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block small 2 is touched
        if  vBlocksmall2.layer.presentationLayer()!.frame.contains(location) {
            vBlocksmall2.center.y = location.y // -yOffset
            if  vBlocksmall2.center.y < (vBlocksmall2.frame.height/2) + diff {
                vBlocksmall2.center.y = (vBlocksmall2.frame.height/2) + diff
            } else if  vBlocksmall2.center.y > gamesubView.frame.width - (vBlocksmall2.frame.height/2) {
                vBlocksmall2.center.y = (gamesubView.frame.width - (vBlocksmall2.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlocksmall2.frame, mainBlock.frame) {
                if  vBlocksmall2.center.y < mainBlock.center.y {
                    vBlocksmall2.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                    
                } else if  vBlocksmall2.center.y > mainBlock.center.y {
                    vBlocksmall2.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlockbig.frame) {
                if  vBlocksmall2.center.y < hBlockbig.center.y {
                    vBlocksmall2.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlockbig.center.y {
                    vBlocksmall2.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlocksmall.frame) {
                if  vBlocksmall2.center.y < hBlocksmall.center.y {
                    vBlocksmall2.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlocksmall.center.y {
                    vBlocksmall2.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlockbig1.frame) {
                if  vBlocksmall2.center.y < hBlockbig1.center.y {
                    vBlocksmall2.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlockbig1.center.y {
                    vBlocksmall2.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlocksmall1.frame) {
                if  vBlocksmall2.center.y < hBlocksmall1.center.y {
                    vBlocksmall2.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlocksmall1.center.y {
                    vBlocksmall2.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlockbig2.frame) {
                if  vBlocksmall2.center.y < hBlockbig2.center.y {
                    vBlocksmall2.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlockbig2.center.y {
                    vBlocksmall2.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlocksmall2.frame) {
                if  vBlocksmall2.center.y < hBlocksmall2.center.y {
                    vBlocksmall2.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlocksmall2.center.y {
                    vBlocksmall2.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlockbig3.frame) {
                if  vBlocksmall2.center.y < hBlockbig3.center.y {
                    vBlocksmall2.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlockbig3.center.y {
                    vBlocksmall2.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlocksmall3.frame) {
                if  vBlocksmall2.center.y < hBlocksmall3.center.y {
                    vBlocksmall2.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlocksmall3.center.y {
                    vBlocksmall2.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlockbig4.frame) {
                if  vBlocksmall2.center.y < hBlockbig4.center.y {
                    vBlocksmall2.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlockbig4.center.y {
                    vBlocksmall2.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,hBlocksmall4.frame) {
                if  vBlocksmall2.center.y < hBlocksmall4.center.y {
                    vBlocksmall2.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > hBlocksmall4.center.y {
                    vBlocksmall2.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlocksmall2.frame,vBlockbig.frame) { // added
                if  vBlocksmall2.center.y < vBlockbig.center.y {
                    vBlocksmall2.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlockbig.center.y {
                    vBlocksmall2.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlocksmall.frame) {
                if  vBlocksmall2.center.y < vBlocksmall.center.y {
                    vBlocksmall2.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlocksmall.center.y {
                    vBlocksmall2.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlockbig1.frame) {
                if  vBlocksmall2.center.y < vBlockbig1.center.y {
                    vBlocksmall2.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlockbig1.center.y {
                    vBlocksmall2.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlocksmall1.frame) {
                if  vBlocksmall2.center.y < vBlocksmall1.center.y {
                    vBlocksmall2.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlocksmall1.center.y {
                    vBlocksmall2.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlockbig2.frame) {
                if  vBlocksmall2.center.y < vBlockbig2.center.y {
                    vBlocksmall2.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlockbig2.center.y {
                    vBlocksmall2.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlockbig3.frame) {
                if  vBlocksmall2.center.y < vBlockbig3.center.y {
                    vBlocksmall2.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlockbig3.center.y {
                    vBlocksmall2.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlocksmall3.frame) {
                if  vBlocksmall2.center.y < vBlocksmall3.center.y {
                    vBlocksmall2.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlocksmall3.center.y {
                    vBlocksmall2.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlockbig4.frame) {
                if  vBlocksmall2.center.y < vBlockbig4.center.y {
                    vBlocksmall2.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlockbig4.center.y {
                    vBlocksmall2.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall2.frame,vBlocksmall4.frame) {
                if  vBlocksmall2.center.y < vBlocksmall4.center.y {
                    vBlocksmall2.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 + vBlocksmall2.frame.height/2 + diff)
                } else if  vBlocksmall2.center.y > vBlocksmall4.center.y {
                    vBlocksmall2.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlocksmall2.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block small 3 is touched
        if  vBlocksmall3.layer.presentationLayer()!.frame.contains(location) {
            vBlocksmall3.center.y = location.y // -yOffset
            if  vBlocksmall3.center.y < (vBlocksmall3.frame.height/2) + diff {
                vBlocksmall3.center.y = (vBlocksmall3.frame.height/2) + diff
            } else if  vBlocksmall3.center.y > gamesubView.frame.width - (vBlocksmall3.frame.height/2) {
                vBlocksmall3.center.y = (gamesubView.frame.width - (vBlocksmall3.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlocksmall3.frame, mainBlock.frame) {
                if  vBlocksmall3.center.y < mainBlock.center.y {
                    vBlocksmall3.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                    
                } else if  vBlocksmall3.center.y > mainBlock.center.y {
                    vBlocksmall3.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlockbig.frame) {
                if  vBlocksmall3.center.y < hBlockbig.center.y {
                    vBlocksmall3.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlockbig.center.y {
                    vBlocksmall3.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlocksmall.frame) {
                if  vBlocksmall3.center.y < hBlocksmall.center.y {
                    vBlocksmall3.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlocksmall.center.y {
                    vBlocksmall3.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlockbig1.frame) {
                if  vBlocksmall3.center.y < hBlockbig1.center.y {
                    vBlocksmall3.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlockbig1.center.y {
                    vBlocksmall3.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlocksmall1.frame) {
                if  vBlocksmall3.center.y < hBlocksmall1.center.y {
                    vBlocksmall3.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlocksmall1.center.y {
                    vBlocksmall3.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlockbig2.frame) {
                if  vBlocksmall3.center.y < hBlockbig2.center.y {
                    vBlocksmall3.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlockbig2.center.y {
                    vBlocksmall3.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlocksmall2.frame) {
                if  vBlocksmall3.center.y < hBlocksmall2.center.y {
                    vBlocksmall3.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlocksmall2.center.y {
                    vBlocksmall3.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlockbig3.frame) {
                if  vBlocksmall3.center.y < hBlockbig3.center.y {
                    vBlocksmall3.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlockbig3.center.y {
                    vBlocksmall3.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlocksmall3.frame) {
                if  vBlocksmall3.center.y < hBlocksmall3.center.y {
                    vBlocksmall3.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlocksmall3.center.y {
                    vBlocksmall3.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlockbig4.frame) {
                if  vBlocksmall3.center.y < hBlockbig4.center.y {
                    vBlocksmall3.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlockbig4.center.y {
                    vBlocksmall3.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,hBlocksmall4.frame) {
                if  vBlocksmall3.center.y < hBlocksmall4.center.y {
                    vBlocksmall3.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > hBlocksmall4.center.y {
                    vBlocksmall3.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlocksmall3.frame,vBlockbig.frame) { // added
                if  vBlocksmall3.center.y < vBlockbig.center.y {
                    vBlocksmall3.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlockbig.center.y {
                    vBlocksmall3.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlocksmall.frame) {
                if  vBlocksmall3.center.y < vBlocksmall.center.y {
                    vBlocksmall3.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlocksmall.center.y {
                    vBlocksmall3.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlockbig1.frame) {
                if  vBlocksmall3.center.y < vBlockbig1.center.y {
                    vBlocksmall3.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlockbig1.center.y {
                    vBlocksmall3.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlocksmall1.frame) {
                if  vBlocksmall3.center.y < vBlocksmall1.center.y {
                    vBlocksmall3.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlocksmall1.center.y {
                    vBlocksmall3.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlockbig2.frame) {
                if  vBlocksmall3.center.y < vBlockbig2.center.y {
                    vBlocksmall3.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlockbig2.center.y {
                    vBlocksmall3.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlocksmall2.frame) {
                if  vBlocksmall3.center.y < vBlocksmall2.center.y {
                    vBlocksmall3.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlocksmall2.center.y {
                    vBlocksmall3.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlockbig3.frame) {
                if  vBlocksmall3.center.y < vBlockbig3.center.y {
                    vBlocksmall3.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlockbig3.center.y {
                    vBlocksmall3.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            }  else if CGRectIntersectsRect(vBlocksmall3.frame,vBlockbig4.frame) {
                if  vBlocksmall3.center.y < vBlockbig4.center.y {
                    vBlocksmall3.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlockbig4.center.y {
                    vBlocksmall3.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall3.frame,vBlocksmall4.frame) {
                if  vBlocksmall3.center.y < vBlocksmall4.center.y {
                    vBlocksmall3.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 + vBlocksmall3.frame.height/2 + diff)
                } else if  vBlocksmall3.center.y > vBlocksmall4.center.y {
                    vBlocksmall3.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block small 4 is touched
        if  vBlocksmall4.layer.presentationLayer()!.frame.contains(location) {
            vBlocksmall4.center.y = location.y // -yOffset
            if  vBlocksmall4.center.y < (vBlocksmall4.frame.height/2) + diff {
                vBlocksmall4.center.y = (vBlocksmall4.frame.height/2) + diff
            } else if  vBlocksmall4.center.y > gamesubView.frame.width - (vBlocksmall4.frame.height/2) {
                vBlocksmall4.center.y = (gamesubView.frame.width - (vBlocksmall4.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlocksmall4.frame, mainBlock.frame) {
                if  vBlocksmall4.center.y < mainBlock.center.y {
                    vBlocksmall4.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                    
                } else if  vBlocksmall4.center.y > mainBlock.center.y {
                    vBlocksmall4.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlockbig.frame) {
                if  vBlocksmall4.center.y < hBlockbig.center.y {
                    vBlocksmall4.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlockbig.center.y {
                    vBlocksmall4.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlocksmall.frame) {
                if  vBlocksmall4.center.y < hBlocksmall.center.y {
                    vBlocksmall4.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlocksmall.center.y {
                    vBlocksmall4.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlockbig1.frame) {
                if  vBlocksmall4.center.y < hBlockbig1.center.y {
                    vBlocksmall4.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlockbig1.center.y {
                    vBlocksmall4.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlocksmall1.frame) {
                if  vBlocksmall4.center.y < hBlocksmall1.center.y {
                    vBlocksmall4.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlocksmall1.center.y {
                    vBlocksmall4.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlockbig2.frame) {
                if  vBlocksmall4.center.y < hBlockbig2.center.y {
                    vBlocksmall4.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlockbig2.center.y {
                    vBlocksmall4.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlocksmall2.frame) {
                if  vBlocksmall4.center.y < hBlocksmall2.center.y {
                    vBlocksmall4.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlocksmall2.center.y {
                    vBlocksmall4.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlockbig3.frame) {
                if  vBlocksmall4.center.y < hBlockbig3.center.y {
                    vBlocksmall4.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlockbig3.center.y {
                    vBlocksmall4.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlocksmall3.frame) {
                if  vBlocksmall4.center.y < hBlocksmall3.center.y {
                    vBlocksmall4.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlocksmall3.center.y {
                    vBlocksmall4.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlockbig4.frame) {
                if  vBlocksmall4.center.y < hBlockbig4.center.y {
                    vBlocksmall4.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlockbig4.center.y {
                    vBlocksmall4.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,hBlocksmall4.frame) {
                if  vBlocksmall4.center.y < hBlocksmall4.center.y {
                    vBlocksmall4.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > hBlocksmall4.center.y {
                    vBlocksmall4.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlocksmall4.frame,vBlockbig.frame) { // added
                if  vBlocksmall4.center.y < vBlockbig.center.y {
                    vBlocksmall4.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlockbig.center.y {
                    vBlocksmall4.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlocksmall.frame) {
                if  vBlocksmall4.center.y < vBlocksmall.center.y {
                    vBlocksmall4.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlocksmall.center.y {
                    vBlocksmall4.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlockbig1.frame) {
                if  vBlocksmall4.center.y < vBlockbig1.center.y {
                    vBlocksmall4.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlockbig1.center.y {
                    vBlocksmall4.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlocksmall1.frame) {
                if  vBlocksmall4.center.y < vBlocksmall1.center.y {
                    vBlocksmall4.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlocksmall1.center.y {
                    vBlocksmall4.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlockbig2.frame) {
                if  vBlocksmall4.center.y < vBlockbig2.center.y {
                    vBlocksmall4.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlockbig2.center.y {
                    vBlocksmall4.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlocksmall2.frame) {
                if  vBlocksmall4.center.y < vBlocksmall2.center.y {
                    vBlocksmall4.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlocksmall2.center.y {
                    vBlocksmall4.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlockbig3.frame) {
                if  vBlocksmall4.center.y < vBlockbig3.center.y {
                    vBlocksmall4.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlockbig3.center.y {
                    vBlocksmall4.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlocksmall3.frame) {
                if  vBlocksmall4.center.y < vBlocksmall3.center.y {
                    vBlocksmall4.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlocksmall3.center.y {
                    vBlocksmall4.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlocksmall4.frame,vBlockbig4.frame) {
                if  vBlocksmall4.center.y < vBlockbig4.center.y {
                    vBlocksmall4.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlocksmall4.frame.height/2 + diff)
                } else if  vBlocksmall4.center.y > vBlockbig4.center.y {
                    vBlocksmall4.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlocksmall4.frame.height/2 + diff)
                }
            }
            
            
        }
        
        
        
        
        
        // if vertical block big is touched
        if  vBlockbig.layer.presentationLayer()!.frame.contains(location) {
            vBlockbig.center.y = location.y // -yOffset
            if  vBlockbig.center.y < (vBlockbig.frame.height/2) + diff {
                vBlockbig.center.y = (vBlockbig.frame.height/2) + diff
            } else if  vBlockbig.center.y > gamesubView.frame.width - (vBlockbig.frame.height/2) {
                vBlockbig.center.y = (gamesubView.frame.width - (vBlockbig.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlockbig.frame, mainBlock.frame) {
                if  vBlockbig.center.y < mainBlock.center.y {
                    vBlockbig.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > mainBlock.center.y {
                    vBlockbig.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlockbig.frame) {
                if  vBlockbig.center.y < hBlockbig.center.y {
                    vBlockbig.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlockbig.center.y {
                    vBlockbig.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlocksmall.frame) {
                if  vBlockbig.center.y < hBlocksmall.center.y {
                    vBlockbig.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlocksmall.center.y {
                    vBlockbig.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlockbig1.frame) {
                if  vBlockbig.center.y < hBlockbig1.center.y {
                    vBlockbig.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlockbig1.center.y {
                    vBlockbig.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlocksmall1.frame) {
                if  vBlockbig.center.y < hBlocksmall1.center.y {
                    vBlockbig.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 + vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlocksmall1.center.y {
                    vBlockbig.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlockbig2.frame) {
                if  vBlockbig.center.y < hBlockbig2.center.y {
                    vBlockbig.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlockbig2.center.y {
                    vBlockbig.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlocksmall2.frame) {
                if  vBlockbig.center.y < hBlocksmall2.center.y {
                    vBlockbig.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlocksmall2.center.y {
                    vBlockbig.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlockbig3.frame) {
                if  vBlockbig.center.y < hBlockbig3.center.y {
                    vBlockbig.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlockbig3.center.y {
                    vBlockbig.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlocksmall3.frame) {
                if  vBlockbig.center.y < hBlocksmall3.center.y {
                    vBlockbig.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlocksmall3.center.y {
                    vBlockbig.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlockbig4.frame) {
                if  vBlockbig.center.y < hBlockbig4.center.y {
                    vBlockbig.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlockbig4.center.y {
                    vBlockbig.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,hBlocksmall4.frame) {
                if  vBlockbig.center.y < hBlocksmall4.center.y {
                    vBlockbig.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > hBlocksmall4.center.y {
                    vBlockbig.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlocksmall.frame) { // added
                if  vBlockbig.center.y < vBlocksmall.center.y {
                    vBlockbig.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlocksmall.center.y {
                    vBlockbig.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlockbig1.frame) {
                if  vBlockbig.center.y < vBlockbig1.center.y {
                    vBlockbig.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlockbig1.center.y {
                    vBlockbig.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlocksmall1.frame) {
                if  vBlockbig.center.y < vBlocksmall1.center.y {
                    vBlockbig.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlocksmall1.center.y {
                    vBlockbig.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlockbig2.frame) {
                if  vBlockbig.center.y < vBlockbig2.center.y {
                    vBlockbig.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlockbig2.center.y {
                    vBlockbig.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlocksmall2.frame) {
                if  vBlockbig.center.y < vBlocksmall2.center.y {
                    vBlockbig.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlocksmall2.center.y {
                    vBlockbig.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlockbig3.frame) {
                if  vBlockbig.center.y < vBlockbig3.center.y {
                    vBlockbig.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlockbig3.center.y {
                    vBlockbig.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlocksmall3.frame) {
                if  vBlockbig.center.y < vBlocksmall3.center.y {
                    vBlockbig.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlocksmall3.center.y {
                    vBlockbig.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlockbig4.frame) {
                if  vBlockbig.center.y < vBlockbig4.center.y {
                    vBlockbig.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlockbig4.center.y {
                    vBlockbig.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlockbig.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig.frame,vBlocksmall4.frame) {
                if  vBlockbig.center.y < vBlocksmall4.center.y {
                    vBlockbig.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                } else if  vBlockbig.center.y > vBlocksmall4.center.y {
                    vBlockbig.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlockbig.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block big 1 is touched
        if  vBlockbig1.layer.presentationLayer()!.frame.contains(location) {
            vBlockbig1.center.y = location.y // -yOffset
            if  vBlockbig1.center.y < (vBlockbig1.frame.height/2) + diff {
                vBlockbig1.center.y = (vBlockbig1.frame.height/2) + diff
            } else if  vBlockbig1.center.y > gamesubView.frame.width - (vBlockbig1.frame.height/2) {
                vBlockbig1.center.y = (gamesubView.frame.width - (vBlockbig1.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlockbig1.frame, mainBlock.frame) {
                if  vBlockbig1.center.y < mainBlock.center.y {
                    vBlockbig1.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > mainBlock.center.y {
                    vBlockbig1.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlockbig.frame) {
                if  vBlockbig1.center.y < hBlockbig.center.y {
                    vBlockbig1.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlockbig.center.y {
                    vBlockbig1.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlocksmall.frame) {
                if  vBlockbig1.center.y < hBlocksmall.center.y {
                    vBlockbig1.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlocksmall.center.y {
                    vBlockbig1.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlockbig1.frame) {
                if  vBlockbig1.center.y < hBlockbig1.center.y {
                    vBlockbig1.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlockbig1.center.y {
                    vBlockbig1.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlocksmall1.frame) {
                if  vBlockbig1.center.y < hBlocksmall1.center.y {
                    vBlockbig1.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlocksmall1.center.y {
                    vBlockbig1.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlockbig2.frame) {
                if  vBlockbig1.center.y < hBlockbig2.center.y {
                    vBlockbig1.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlockbig2.center.y {
                    vBlockbig1.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlocksmall2.frame) {
                if  vBlockbig1.center.y < hBlocksmall2.center.y {
                    vBlockbig1.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlocksmall2.center.y {
                    vBlockbig1.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlockbig3.frame) {
                if  vBlockbig1.center.y < hBlockbig3.center.y {
                    vBlockbig1.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlockbig3.center.y {
                    vBlockbig1.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlocksmall3.frame) {
                if  vBlockbig1.center.y < hBlocksmall3.center.y {
                    vBlockbig1.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlocksmall3.center.y {
                    vBlockbig1.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlockbig4.frame) {
                if  vBlockbig1.center.y < hBlockbig4.center.y {
                    vBlockbig1.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlockbig4.center.y {
                    vBlockbig1.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,hBlocksmall4.frame) {
                if  vBlockbig1.center.y < hBlocksmall4.center.y {
                    vBlockbig1.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > hBlocksmall4.center.y {
                    vBlockbig1.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlockbig1.frame,vBlockbig.frame) { // added
                if  vBlockbig1.center.y < vBlockbig.center.y {
                    vBlockbig1.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlockbig.center.y {
                    vBlockbig1.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlocksmall.frame) {
                if  vBlockbig1.center.y < vBlocksmall.center.y {
                    vBlockbig1.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlocksmall.center.y {
                    vBlockbig1.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlocksmall1.frame) {
                if  vBlockbig1.center.y < vBlocksmall1.center.y {
                    vBlockbig1.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlocksmall1.center.y {
                    vBlockbig1.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlockbig2.frame) {
                if  vBlockbig1.center.y < vBlockbig2.center.y {
                    vBlockbig1.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlockbig2.center.y {
                    vBlockbig1.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlocksmall2.frame) {
                if  vBlockbig1.center.y < vBlocksmall2.center.y {
                    vBlockbig1.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlocksmall2.center.y {
                    vBlockbig1.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlockbig3.frame) {
                if  vBlockbig1.center.y < vBlockbig3.center.y {
                    vBlockbig1.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlockbig3.center.y {
                    vBlockbig1.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlocksmall3.frame) {
                if  vBlockbig1.center.y < vBlocksmall3.center.y {
                    vBlockbig1.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlocksmall3.center.y {
                    vBlockbig1.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlockbig4.frame) {
                if  vBlockbig1.center.y < vBlockbig4.center.y {
                    vBlockbig1.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlockbig4.center.y {
                    vBlockbig1.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlockbig1.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig1.frame,vBlocksmall4.frame) {
                if  vBlockbig1.center.y < vBlocksmall4.center.y {
                    vBlockbig1.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                } else if  vBlockbig1.center.y > vBlocksmall4.center.y {
                    vBlockbig1.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlockbig1.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block big 2 is touched
        if  vBlockbig2.layer.presentationLayer()!.frame.contains(location) {
            vBlockbig2.center.y = location.y // -yOffset
            if  vBlockbig2.center.y < (vBlockbig2.frame.height/2) + diff {
                vBlockbig2.center.y = (vBlockbig2.frame.height/2) + diff
            } else if  vBlockbig2.center.y > gamesubView.frame.width - (vBlockbig2.frame.height/2) {
                vBlockbig2.center.y = (gamesubView.frame.width - (vBlockbig2.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlockbig2.frame, mainBlock.frame) {
                if  vBlockbig2.center.y < mainBlock.center.y {
                    vBlockbig2.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > mainBlock.center.y {
                    vBlockbig2.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlockbig.frame) {
                if  vBlockbig2.center.y < hBlockbig.center.y {
                    vBlockbig2.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlockbig.center.y {
                    vBlockbig2.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlocksmall.frame) {
                if  vBlockbig2.center.y < hBlocksmall.center.y {
                    vBlockbig2.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlocksmall.center.y {
                    vBlockbig2.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlockbig1.frame) {
                if  vBlockbig2.center.y < hBlockbig1.center.y {
                    vBlockbig2.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlockbig1.center.y {
                    vBlockbig2.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlocksmall1.frame) {
                if  vBlockbig2.center.y < hBlocksmall1.center.y {
                    vBlockbig2.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlocksmall1.center.y {
                    vBlockbig2.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlockbig2.frame) {
                if  vBlockbig2.center.y < hBlockbig2.center.y {
                    vBlockbig2.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlockbig2.center.y {
                    vBlockbig2.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlocksmall2.frame) {
                if  vBlockbig2.center.y < hBlocksmall2.center.y {
                    vBlockbig2.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlocksmall2.center.y {
                    vBlockbig2.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlockbig3.frame) {
                if  vBlockbig2.center.y < hBlockbig3.center.y {
                    vBlockbig2.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlockbig3.center.y {
                    vBlockbig2.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlocksmall3.frame) {
                if  vBlockbig2.center.y < hBlocksmall3.center.y {
                    vBlockbig2.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlocksmall3.center.y {
                    vBlockbig2.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlockbig4.frame) {
                if  vBlockbig2.center.y < hBlockbig4.center.y {
                    vBlockbig2.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlockbig4.center.y {
                    vBlockbig2.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,hBlocksmall4.frame) {
                if  vBlockbig2.center.y < hBlocksmall4.center.y {
                    vBlockbig2.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > hBlocksmall4.center.y {
                    vBlockbig2.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlockbig2.frame,vBlockbig.frame) { // added
                if  vBlockbig2.center.y < vBlockbig.center.y {
                    vBlockbig2.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlockbig.center.y {
                    vBlockbig2.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlocksmall.frame) {
                if  vBlockbig2.center.y < vBlocksmall.center.y {
                    vBlockbig2.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlocksmall.center.y {
                    vBlockbig2.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlockbig1.frame) {
                if  vBlockbig2.center.y < vBlockbig1.center.y {
                    vBlockbig2.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlockbig1.center.y {
                    vBlockbig2.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlocksmall1.frame) {
                if  vBlockbig2.center.y < vBlocksmall1.center.y {
                    vBlockbig2.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlocksmall1.center.y {
                    vBlockbig2.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlocksmall2.frame) {
                if  vBlockbig2.center.y < vBlocksmall2.center.y {
                    vBlockbig2.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlocksmall2.center.y {
                    vBlockbig2.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlockbig3.frame) {
                if  vBlockbig2.center.y < vBlockbig3.center.y {
                    vBlockbig2.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlockbig3.center.y {
                    vBlockbig2.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlocksmall3.frame) {
                if  vBlockbig2.center.y < vBlocksmall3.center.y {
                    vBlockbig2.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlocksmall3.center.y {
                    vBlockbig2.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlockbig4.frame) {
                if  vBlockbig2.center.y < vBlockbig4.center.y {
                    vBlockbig2.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlockbig4.center.y {
                    vBlockbig2.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlockbig2.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig2.frame,vBlocksmall4.frame) {
                if  vBlockbig2.center.y < vBlocksmall4.center.y {
                    vBlockbig2.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                } else if  vBlockbig2.center.y > vBlocksmall4.center.y {
                    vBlockbig2.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlockbig2.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block big 3 is touched
        if  vBlockbig3.layer.presentationLayer()!.frame.contains(location) {
            vBlockbig3.center.y = location.y // -yOffset
            if  vBlockbig3.center.y < (vBlockbig3.frame.height/2) + diff {
                vBlockbig3.center.y = (vBlockbig3.frame.height/2) + diff
            } else if  vBlockbig3.center.y > gamesubView.frame.width - (vBlockbig3.frame.height/2) {
                vBlockbig3.center.y = (gamesubView.frame.width - (vBlockbig3.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlockbig3.frame, mainBlock.frame) {
                if  vBlockbig3.center.y < mainBlock.center.y {
                    vBlockbig3.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > mainBlock.center.y {
                    vBlockbig3.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlockbig.frame) {
                if  vBlockbig3.center.y < hBlockbig.center.y {
                    vBlockbig3.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlockbig.center.y {
                    vBlockbig3.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlocksmall.frame) {
                if  vBlockbig3.center.y < hBlocksmall.center.y {
                    vBlockbig3.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlocksmall.center.y {
                    vBlockbig3.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlockbig1.frame) {
                if  vBlockbig3.center.y < hBlockbig1.center.y {
                    vBlockbig3.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlockbig1.center.y {
                    vBlockbig3.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlocksmall1.frame) {
                if  vBlockbig3.center.y < hBlocksmall1.center.y {
                    vBlockbig3.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlocksmall1.center.y {
                    vBlockbig3.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlockbig2.frame) {
                if  vBlockbig3.center.y < hBlockbig2.center.y {
                    vBlockbig3.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlockbig2.center.y {
                    vBlockbig3.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlocksmall2.frame) {
                if  vBlockbig3.center.y < hBlocksmall2.center.y {
                    vBlockbig3.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlocksmall2.center.y {
                    vBlockbig3.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlockbig3.frame) {
                if  vBlockbig3.center.y < hBlockbig3.center.y {
                    vBlockbig3.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlockbig3.center.y {
                    vBlockbig3.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlocksmall3.frame) {
                if  vBlockbig3.center.y < hBlocksmall3.center.y {
                    vBlockbig3.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlocksmall3.center.y {
                    vBlockbig3.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlockbig4.frame) {
                if  vBlockbig3.center.y < hBlockbig4.center.y {
                    vBlockbig3.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlockbig4.center.y {
                    vBlockbig3.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,hBlocksmall4.frame) {
                if  vBlockbig3.center.y < hBlocksmall4.center.y {
                    vBlockbig3.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > hBlocksmall4.center.y {
                    vBlockbig3.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            }else if CGRectIntersectsRect(vBlockbig3.frame,vBlockbig.frame) { // added
                if  vBlockbig3.center.y < vBlockbig.center.y {
                    vBlockbig3.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlockbig.center.y {
                    vBlockbig3.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlocksmall.frame) {
                if  vBlockbig3.center.y < vBlocksmall.center.y {
                    vBlockbig3.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlocksmall.center.y {
                    vBlockbig3.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlockbig1.frame) {
                if  vBlockbig3.center.y < vBlockbig1.center.y {
                    vBlockbig3.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlockbig1.center.y {
                    vBlockbig3.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlocksmall1.frame) {
                if  vBlockbig3.center.y < vBlocksmall1.center.y {
                    vBlockbig3.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlocksmall1.center.y {
                    vBlockbig3.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlockbig2.frame) {
                if  vBlockbig3.center.y < vBlockbig2.center.y {
                    vBlockbig3.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlockbig2.center.y {
                    vBlockbig3.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlocksmall2.frame) {
                if  vBlockbig3.center.y < vBlocksmall2.center.y {
                    vBlockbig3.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlocksmall2.center.y {
                    vBlockbig3.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlocksmall3.frame) {
                if  vBlockbig3.center.y < vBlocksmall3.center.y {
                    vBlockbig3.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 +  vBlocksmall3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlocksmall3.center.y {
                    vBlockbig3.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlockbig4.frame) {
                if  vBlockbig3.center.y < vBlockbig4.center.y {
                    vBlockbig3.center.y = vBlockbig4.center.y - (vBlockbig4.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlockbig4.center.y {
                    vBlockbig3.center.y = vBlockbig4.center.y + (vBlockbig4.frame.height/2 + vBlockbig3.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig3.frame,vBlocksmall4.frame) {
                if  vBlockbig3.center.y < vBlocksmall4.center.y {
                    vBlockbig3.center.y = vBlocksmall4.center.y - (vBlocksmall4.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                } else if  vBlockbig3.center.y > vBlocksmall4.center.y {
                    vBlockbig3.center.y = vBlocksmall4.center.y + (vBlocksmall4.frame.height/2 +  vBlockbig3.frame.height/2 + diff)
                    
                }
            }
            
            
        }
        
        // if vertical block big 4 is touched
        if  vBlockbig4.layer.presentationLayer()!.frame.contains(location) {
            vBlockbig4.center.y = location.y // -yOffset
            if  vBlockbig4.center.y < (vBlockbig4.frame.height/2) + diff {
                vBlockbig4.center.y = (vBlockbig4.frame.height/2) + diff
            } else if  vBlockbig4.center.y > gamesubView.frame.width - (vBlockbig4.frame.height/2) {
                vBlockbig4.center.y = (gamesubView.frame.width - (vBlockbig4.frame.height/2)) - diff
            }
            
            if CGRectIntersectsRect(vBlockbig4.frame, mainBlock.frame) {
                if  vBlockbig4.center.y < mainBlock.center.y {
                    vBlockbig4.center.y = mainBlock.center.y - (mainBlock.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > mainBlock.center.y {
                    vBlockbig4.center.y = mainBlock.center.y + (mainBlock.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlockbig.frame) {
                if  vBlockbig4.center.y < hBlockbig.center.y {
                    vBlockbig4.center.y = hBlockbig.center.y - (hBlockbig.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlockbig.center.y {
                    vBlockbig4.center.y = hBlockbig.center.y + (hBlockbig.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlocksmall.frame) {
                if  vBlockbig4.center.y < hBlocksmall.center.y {
                    vBlockbig4.center.y = hBlocksmall.center.y - (hBlocksmall.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlocksmall.center.y {
                    vBlockbig4.center.y = hBlocksmall.center.y + (hBlocksmall.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlockbig1.frame) {
                if  vBlockbig4.center.y < hBlockbig1.center.y {
                    vBlockbig4.center.y = hBlockbig1.center.y - (hBlockbig1.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlockbig1.center.y {
                    vBlockbig4.center.y = hBlockbig1.center.y + (hBlockbig1.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlocksmall1.frame) {
                if  vBlockbig4.center.y < hBlocksmall1.center.y {
                    vBlockbig4.center.y = hBlocksmall1.center.y - (hBlocksmall1.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlocksmall1.center.y {
                    vBlockbig4.center.y = hBlocksmall1.center.y + (hBlocksmall1.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlockbig2.frame) {
                if  vBlockbig4.center.y < hBlockbig2.center.y {
                    vBlockbig4.center.y = hBlockbig2.center.y - (hBlockbig2.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlockbig2.center.y {
                    vBlockbig4.center.y = hBlockbig2.center.y + (hBlockbig2.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlocksmall2.frame) {
                if  vBlockbig4.center.y < hBlocksmall2.center.y {
                    vBlockbig4.center.y = hBlocksmall2.center.y - (hBlocksmall2.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlocksmall2.center.y {
                    vBlockbig4.center.y = hBlocksmall2.center.y + (hBlocksmall2.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlockbig3.frame) {
                if  vBlockbig4.center.y < hBlockbig3.center.y {
                    vBlockbig4.center.y = hBlockbig3.center.y - (hBlockbig3.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlockbig3.center.y {
                    vBlockbig4.center.y = hBlockbig3.center.y + (hBlockbig3.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlocksmall3.frame) {
                if  vBlockbig4.center.y < hBlocksmall3.center.y {
                    vBlockbig4.center.y = hBlocksmall3.center.y - (hBlocksmall3.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlocksmall3.center.y {
                    vBlockbig4.center.y = hBlocksmall3.center.y + (hBlocksmall3.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                    
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlockbig4.frame) {
                if  vBlockbig4.center.y < hBlockbig4.center.y {
                    vBlockbig4.center.y = hBlockbig4.center.y - (hBlockbig4.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlockbig4.center.y {
                    vBlockbig4.center.y = hBlockbig4.center.y + (hBlockbig4.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,hBlocksmall4.frame) {
                if  vBlockbig4.center.y < hBlocksmall4.center.y {
                    vBlockbig4.center.y = hBlocksmall4.center.y - (hBlocksmall4.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > hBlocksmall4.center.y {
                    vBlockbig4.center.y = hBlocksmall4.center.y + (hBlocksmall4.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                    
                } // new
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlockbig.frame) {
                if  vBlockbig4.center.y < vBlockbig.center.y {
                    vBlockbig4.center.y = vBlockbig.center.y - (vBlockbig.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlockbig.center.y {
                    vBlockbig4.center.y = vBlockbig.center.y + (vBlockbig.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
                
            }else if CGRectIntersectsRect(vBlockbig4.frame,vBlockbig1.frame) {
                if  vBlockbig4.center.y < vBlockbig1.center.y {
                    vBlockbig4.center.y = vBlockbig1.center.y - (vBlockbig1.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlockbig1.center.y {
                    vBlockbig4.center.y = vBlockbig1.center.y + (vBlockbig1.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
                
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlockbig2.frame) {
                if  vBlockbig4.center.y < vBlockbig2.center.y {
                    vBlockbig4.center.y = vBlockbig2.center.y - (vBlockbig2.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlockbig2.center.y {
                    vBlockbig4.center.y = vBlockbig2.center.y + (vBlockbig2.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
                
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlockbig3.frame) {
                if  vBlockbig4.center.y < vBlockbig3.center.y {
                    vBlockbig4.center.y = vBlockbig3.center.y - (vBlockbig3.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlockbig3.center.y {
                    vBlockbig4.center.y = vBlockbig3.center.y + (vBlockbig3.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
                
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlocksmall.frame) {
                if  vBlockbig4.center.y < vBlocksmall.center.y {
                    vBlockbig4.center.y = vBlocksmall.center.y - (vBlocksmall.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlocksmall.center.y {
                    vBlockbig4.center.y = vBlocksmall.center.y + (vBlocksmall.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlocksmall1.frame) {
                if  vBlockbig4.center.y < vBlocksmall1.center.y {
                    vBlockbig4.center.y = vBlocksmall1.center.y - (vBlocksmall1.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlocksmall1.center.y {
                    vBlockbig4.center.y = vBlocksmall1.center.y + (vBlocksmall1.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlocksmall2.frame) {
                if  vBlockbig4.center.y < vBlocksmall2.center.y {
                    vBlockbig4.center.y = vBlocksmall2.center.y - (vBlocksmall2.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlocksmall2.center.y {
                    vBlockbig4.center.y = vBlocksmall2.center.y + (vBlocksmall2.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            } else if CGRectIntersectsRect(vBlockbig4.frame,vBlocksmall3.frame) {
                if  vBlockbig4.center.y < vBlocksmall3.center.y {
                    vBlockbig4.center.y = vBlocksmall3.center.y - (vBlocksmall3.frame.height/2 +  vBlockbig4.frame.height/2 + diff)
                } else if  vBlockbig4.center.y > vBlocksmall3.center.y {
                    vBlockbig4.center.y = vBlocksmall3.center.y + (vBlocksmall3.frame.height/2 + vBlockbig4.frame.height/2 + diff)
                }
            }
            
            
        }
    }
    
    
    
    override func touchesEnded(touches: Set<UITouch>, withEvent event: UIEvent?) {

        if  mainBlock.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = mainBlock.center.x - mainBlock.frame.width/2
            
            if mainblockxx <= blocksize/2 {
                mainBlock.center.x = xblock1 + mainBlock.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                mainBlock.center.x = xblock1 + mainBlock.frame.width
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                mainBlock.center.x = xblock3 + mainBlock.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                mainBlock.center.x = xblock4 + mainBlock.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                mainBlock.center.x = xblock5 + mainBlock.frame.width/2
                if mainBlock.frame.origin.x >= xblock4 - 5 {
                    print("level \(levelSelected) Completed with touchesEnd")
                    levelcomplete(levelSelected,timetaken: hourCount)
                }
            }
        } else if hBlocksmall.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlocksmall.center.x - hBlocksmall.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlocksmall.center.x = xblock1 + hBlocksmall.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlocksmall.center.x = xblock1 + hBlocksmall.frame.width
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlocksmall.center.x = xblock3 + hBlocksmall.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlocksmall.center.x = xblock4 + hBlocksmall.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlocksmall.center.x = xblock5 + hBlocksmall.frame.width/2
            }
        } else if hBlockbig.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlockbig.center.x - hBlockbig.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlockbig.center.x = xblock1 + hBlockbig.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlockbig.center.x = xblock2 + hBlockbig.frame.width/2
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlockbig.center.x = xblock3 + hBlockbig.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlockbig.center.x = xblock4 + hBlockbig.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlockbig.center.x = xblock5 + hBlockbig.frame.width/2
            }
        } else if vBlocksmall.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlocksmall.center.y - vBlocksmall.frame.height/2
            
            if mainblockyy <= blocksize/2 {
                vBlocksmall.center.y = yblock1 + vBlocksmall.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlocksmall.center.y = yblock1 + vBlocksmall.frame.height
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlocksmall.center.y = yblock3 + vBlocksmall.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlocksmall.center.y = yblock4 + vBlocksmall.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlocksmall.center.y = yblock5 + vBlocksmall.frame.height/2
            }
        } else if vBlockbig.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlockbig.center.y - vBlockbig.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlockbig.center.y = yblock1 + vBlockbig.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlockbig.center.y = yblock2 + vBlockbig.frame.height/2
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlockbig.center.y = yblock3 + vBlockbig.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlockbig.center.y = yblock4 + vBlockbig.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlockbig.center.y = yblock5 + vBlockbig.frame.height/2
            }
        }  else if hBlocksmall1.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlocksmall1.center.x - hBlocksmall1.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlocksmall1.center.x = xblock1 + hBlocksmall1.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlocksmall1.center.x = xblock1 + hBlocksmall1.frame.width
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlocksmall1.center.x = xblock3 + hBlocksmall1.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlocksmall1.center.x = xblock4 + hBlocksmall1.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlocksmall1.center.x = xblock5 + hBlocksmall1.frame.width/2
            }
        } else if hBlockbig1.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlockbig1.center.x - hBlockbig1.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlockbig1.center.x = xblock1 + hBlockbig1.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlockbig1.center.x = xblock2 + hBlockbig1.frame.width/2
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlockbig1.center.x = xblock3 + hBlockbig1.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlockbig1.center.x = xblock4 + hBlockbig1.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlockbig1.center.x = xblock5 + hBlockbig1.frame.width/2
            }
        } else if vBlocksmall1.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlocksmall1.center.y - vBlocksmall1.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlocksmall1.center.y = yblock1 + vBlocksmall1.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlocksmall1.center.y = yblock1 + vBlocksmall1.frame.height
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlocksmall1.center.y = yblock3 + vBlocksmall1.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlocksmall1.center.y = yblock4 + vBlocksmall1.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlocksmall1.center.y = yblock5 + vBlocksmall1.frame.height/2
            }
        } else if vBlockbig1.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlockbig1.center.y - vBlockbig1.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlockbig1.center.y = yblock1 + vBlockbig1.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlockbig1.center.y = yblock2 + vBlockbig1.frame.height/2
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlockbig1.center.y = yblock3 + vBlockbig1.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlockbig1.center.y = yblock4 + vBlockbig1.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlockbig1.center.y = yblock5 + vBlockbig1.frame.height/2
            }
        }  else if hBlocksmall2.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlocksmall2.center.x - hBlocksmall2.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlocksmall2.center.x = xblock1 + hBlocksmall2.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlocksmall2.center.x = xblock1 + hBlocksmall2.frame.width
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlocksmall2.center.x = xblock3 + hBlocksmall2.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlocksmall2.center.x = xblock4 + hBlocksmall2.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlocksmall2.center.x = xblock5 + hBlocksmall2.frame.width/2
            }
        } else if hBlockbig2.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlockbig2.center.x - hBlockbig2.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlockbig2.center.x = xblock1 + hBlockbig2.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlockbig2.center.x = xblock2 + hBlockbig2.frame.width/2
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlockbig2.center.x = xblock3 + hBlockbig2.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlockbig2.center.x = xblock4 + hBlockbig2.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlockbig2.center.x = xblock5 + hBlockbig2.frame.width/2
            }
        } else if vBlocksmall2.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlocksmall2.center.y - vBlocksmall2.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlocksmall2.center.y = yblock1 + vBlocksmall2.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlocksmall2.center.y = yblock1 + vBlocksmall2.frame.height
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlocksmall2.center.y = yblock3 + vBlocksmall2.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlocksmall2.center.y = yblock4 + vBlocksmall2.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlocksmall2.center.y = yblock5 + vBlocksmall2.frame.height/2
            }
        } else if vBlockbig2.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlockbig2.center.y - vBlockbig2.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlockbig2.center.y = yblock1 + vBlockbig2.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlockbig2.center.y = yblock2 + vBlockbig2.frame.height/2
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlockbig2.center.y = yblock3 + vBlockbig2.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlockbig2.center.y = yblock4 + vBlockbig2.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlockbig2.center.y = yblock5 + vBlockbig2.frame.height/2
            }
        }  else if hBlocksmall3.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlocksmall3.center.x - hBlocksmall3.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlocksmall3.center.x = xblock1 + hBlocksmall3.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlocksmall3.center.x = xblock1 + hBlocksmall3.frame.width
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlocksmall3.center.x = xblock3 + hBlocksmall3.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlocksmall3.center.x = xblock4 + hBlocksmall3.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlocksmall3.center.x = xblock5 + hBlocksmall3.frame.width/2
            }
        } else if hBlockbig3.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlockbig3.center.x - hBlockbig3.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlockbig3.center.x = xblock1 + hBlockbig3.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlockbig3.center.x = xblock2 + hBlockbig3.frame.width/2
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlockbig3.center.x = xblock3 + hBlockbig3.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlockbig3.center.x = xblock4 + hBlockbig3.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlockbig3.center.x = xblock5 + hBlockbig3.frame.width/2
            }
        } else if vBlocksmall3.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlocksmall3.center.y - vBlocksmall3.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlocksmall3.center.y = yblock1 + vBlocksmall3.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlocksmall3.center.y = yblock1 + vBlocksmall3.frame.height
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlocksmall3.center.y = yblock3 + vBlocksmall3.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlocksmall3.center.y = yblock4 + vBlocksmall3.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlocksmall3.center.y = yblock5 + vBlocksmall3.frame.height/2
            }
        } else if vBlockbig3.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlockbig3.center.y - vBlockbig3.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlockbig3.center.y = yblock1 + vBlockbig3.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlockbig3.center.y = yblock2 + vBlockbig3.frame.height/2
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlockbig3.center.y = yblock3 + vBlockbig3.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlockbig3.center.y = yblock4 + vBlockbig3.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlockbig3.center.y = yblock5 + vBlockbig3.frame.height/2
            }
        }  else if hBlocksmall4.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlocksmall4.center.x - hBlocksmall4.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlocksmall4.center.x = xblock1 + hBlocksmall4.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlocksmall4.center.x = xblock1 + hBlocksmall4.frame.width
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlocksmall4.center.x = xblock3 + hBlocksmall4.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlocksmall4.center.x = xblock4 + hBlocksmall4.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlocksmall4.center.x = xblock5 + hBlocksmall4.frame.width/2
            }
        } else if hBlockbig4.layer.presentationLayer()!.frame.contains(location) {
            let mainblockxx = hBlockbig4.center.x - hBlockbig4.frame.width/2
            if mainblockxx <= blocksize/2 {
                hBlockbig4.center.x = xblock1 + hBlockbig4.frame.width/2
            } else if mainblockxx > blocksize/2 && mainblockxx < xblock2 + blocksize/2 {
                hBlockbig4.center.x = xblock2 + hBlockbig4.frame.width/2
            } else if mainblockxx >= xblock2 + blocksize/2 && mainblockxx < xblock3 + blocksize/2 {
                hBlockbig4.center.x = xblock3 + hBlockbig4.frame.width/2
            } else if mainblockxx >= xblock3 + blocksize/2 && mainblockxx < xblock4 + blocksize/2 {
                hBlockbig4.center.x = xblock4 + hBlockbig4.frame.width/2
            } else if mainblockxx >= xblock4 + blocksize/2 && mainblockxx < xblock5 + blocksize/2 {
                hBlockbig4.center.x = xblock5 + hBlockbig4.frame.width/2
            }
        } else if vBlocksmall4.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlocksmall4.center.y - vBlocksmall4.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlocksmall4.center.y = yblock1 + vBlocksmall4.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlocksmall4.center.y = yblock1 + vBlocksmall4.frame.height
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlocksmall4.center.y = yblock3 + vBlocksmall4.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlocksmall4.center.y = yblock4 + vBlocksmall4.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlocksmall4.center.y = yblock5 + vBlocksmall4.frame.height/2
            }
        } else if vBlockbig4.layer.presentationLayer()!.frame.contains(location) {
            let mainblockyy = vBlockbig4.center.y - vBlockbig4.frame.height/2
            if mainblockyy <= blocksize/2 {
                vBlockbig4.center.y = yblock1 + vBlockbig4.frame.height/2
            } else if mainblockyy > blocksize/2 && mainblockyy < yblock2 + blocksize/2 {
                vBlockbig4.center.y = yblock2 + vBlockbig4.frame.height/2
            } else if mainblockyy >= yblock2 + blocksize/2 && mainblockyy < yblock3 + blocksize/2 {
                vBlockbig4.center.y = yblock3 + vBlockbig4.frame.height/2
            } else if mainblockyy >= yblock3 + blocksize/2 && mainblockyy < yblock4 + blocksize/2 {
                vBlockbig4.center.y = yblock4 + vBlockbig4.frame.height/2
            } else if mainblockyy >= yblock4 + blocksize/2 && mainblockyy < yblock5 + blocksize/2 {
                vBlockbig4.center.y = yblock5 + vBlockbig4.frame.height/2
            }
        }
        
        
    }
    
    
    
    

    // timer
    var timer = NSTimer()
    var timerCount = 0
    var minCount = 0
    var hourCount = 0
    func Counting() {
        timerCount += 1
        minCount += 1
        hourCount += 1
        if timerCount % showadTime == 0 {
            if adsremoved == false && timerAds {
                if didbuyad == false {
                    Chartboost.showInterstitial(CBLocationHomeScreen)
                }
            }
        }
        if hourCount < 60 {
            timeLabel.text = "Time\n \(timerCount)" }
        else if hourCount >= 59 && hourCount < 3559 {
            if timerCount < 10 {
                timeLabel.text = "Time\n \(minCount/60):0\(timerCount)"
            } else {
                timeLabel.text = "Time\n \(minCount/60):\(timerCount)" }
        } else if hourCount >= 3599 {
            if minCount/60 < 10 {
                timeLabel.text = "Time\n \(hourCount/3600):0\(minCount/60):\(timerCount)"
            } else {
                timeLabel.text = "Time\n \(hourCount/3600):\(minCount/60):\(timerCount)"
            }
        }
        if timerCount == 59 { timerCount = -1 }
        if minCount/60 == 59 { minCount = -1 }
    }
    func startTimer() {
        timer = NSTimer.scheduledTimerWithTimeInterval(1.0, target: self, selector: #selector(GameViewController.Counting), userInfo: nil, repeats: true)
    }
 
    
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        var nextlevelnumber: Int = levelSelected + 1
        
        
        // create a observer to stop and resume timer when user leaves
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(GameViewController.pauseTimer(_:)), name: UIApplicationDidEnterBackgroundNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(GameViewController.resumeTimer(_:)), name: UIApplicationWillEnterForegroundNotification, object: nil)
        
        

        
        
        
        mainBlock.layer.shadowOpacity = 1.2
        vBlockbig.layer.shadowOpacity = 1.2
        hBlockbig.layer.shadowOpacity = 1.2
        vBlocksmall.layer.shadowOpacity = 1.2
        hBlocksmall.layer.shadowOpacity = 1.2
        vBlockbig1.layer.shadowOpacity = 1.2
        hBlockbig1.layer.shadowOpacity = 1.2
        vBlocksmall1.layer.shadowOpacity = 1.2
        hBlocksmall1.layer.shadowOpacity = 1.2
        vBlockbig2.layer.shadowOpacity = 1.2
        hBlockbig2.layer.shadowOpacity = 1.2
        vBlocksmall2.layer.shadowOpacity = 1.2
        hBlocksmall2.layer.shadowOpacity = 1.2
        vBlockbig3.layer.shadowOpacity = 1.2
        hBlockbig3.layer.shadowOpacity = 1.2
        vBlocksmall3.layer.shadowOpacity = 1.2
        hBlocksmall3.layer.shadowOpacity = 1.2
        vBlockbig4.layer.shadowOpacity = 1.2
        hBlockbig4.layer.shadowOpacity = 1.2
        vBlocksmall4.layer.shadowOpacity = 1.2
        hBlocksmall4.layer.shadowOpacity = 1.2
        
        
        // get the current levels timeLabel
        if levelSelected == 1 { leveltime = leveltime1 } else if levelSelected == 2 { leveltime = leveltime2 } else if levelSelected == 3 { leveltime = leveltime3 } else if levelSelected == 4 { leveltime = leveltime4 } else if levelSelected == 5 { leveltime = leveltime5 } else if levelSelected == 6 { leveltime = leveltime6 } else if levelSelected == 7 { leveltime = leveltime7 } else if levelSelected == 8 { leveltime = leveltime8 } else if levelSelected == 9 { leveltime = leveltime9 } else if levelSelected == 10 { leveltime = leveltime10 } else if levelSelected == 11 { leveltime = leveltime11 } else if levelSelected == 12 { leveltime = leveltime12 } else if levelSelected == 13 { leveltime = leveltime13 } else if levelSelected == 14 { leveltime = leveltime14 } else if levelSelected == 15 { leveltime = leveltime15 } else if levelSelected == 16 { leveltime = leveltime16 } else if levelSelected == 17 { leveltime = leveltime17 } else if levelSelected == 18 { leveltime = leveltime18 } else if levelSelected == 19 { leveltime = leveltime19 } else if levelSelected == 20 { leveltime = leveltime20 } else if levelSelected == 21 { leveltime = leveltime21 } else if levelSelected == 22 { leveltime = leveltime22 } else if levelSelected == 23 { leveltime = leveltime23 } else if levelSelected == 24 { leveltime = leveltime24 } else if levelSelected == 25 { leveltime = leveltime25 } else if levelSelected == 26 { leveltime = leveltime26 } else if levelSelected == 27 { leveltime = leveltime27 } else if levelSelected == 28 { leveltime = leveltime28 } else if levelSelected == 29 { leveltime = leveltime29 } else if levelSelected == 30 { leveltime = leveltime30 } else if levelSelected == 31 { leveltime = leveltime31 } else if levelSelected == 32 { leveltime = leveltime32 } else if levelSelected == 33 { leveltime = leveltime33 } else if levelSelected == 34 { leveltime = leveltime34 } else if levelSelected == 35 { leveltime = leveltime35 } else if levelSelected == 36 { leveltime = leveltime36 } else if levelSelected == 37 { leveltime = leveltime37 } else if levelSelected == 38 { leveltime = leveltime38 } else if levelSelected == 39 { leveltime = leveltime39 } else if levelSelected == 40 { leveltime = leveltime40 } else if levelSelected == 41 { leveltime = leveltime41 } else if levelSelected == 42 { leveltime = leveltime42 } else if levelSelected == 43 { leveltime = leveltime43 } else if levelSelected == 44 { leveltime = leveltime44 } else if levelSelected == 45 { leveltime = leveltime45 } else if levelSelected == 46 { leveltime = leveltime46 } else if levelSelected == 47 { leveltime = leveltime47 } else if levelSelected == 48 { leveltime = leveltime48 } else if levelSelected == 49 { leveltime = leveltime49 } else if levelSelected == 50 { leveltime = leveltime50 } else if levelSelected == 51 { leveltime = leveltime51 } else if levelSelected == 52 { leveltime = leveltime52 } else if levelSelected == 53 { leveltime = leveltime53 } else if levelSelected == 54 { leveltime = leveltime54 } else if levelSelected == 55 { leveltime = leveltime55 } else if levelSelected == 56 { leveltime = leveltime56 } else if levelSelected == 57 { leveltime = leveltime57 } else if levelSelected == 58 { leveltime = leveltime58 } else if levelSelected == 59 { leveltime = leveltime59 } else if levelSelected == 60 { leveltime = leveltime60 } else if levelSelected == 61 { leveltime = leveltime61 } else if levelSelected == 62 { leveltime = leveltime62 } else if levelSelected == 63 { leveltime = leveltime63 } else if levelSelected == 64 { leveltime = leveltime64 } else if levelSelected == 65 { leveltime = leveltime65 } else if levelSelected == 66 { leveltime = leveltime66 } else if levelSelected == 67 { leveltime = leveltime67 } else if levelSelected == 68 { leveltime = leveltime68 } else if levelSelected == 69 { leveltime = leveltime69 } else if levelSelected == 70 { leveltime = leveltime70 } else if levelSelected == 71 { leveltime = leveltime71 } else if levelSelected == 72 { leveltime = leveltime72 } else if levelSelected == 73 { leveltime = leveltime73 } else if levelSelected == 74 { leveltime = leveltime74 } else if levelSelected == 75 { leveltime = leveltime75 } else if levelSelected == 76 { leveltime = leveltime76 } else if levelSelected == 77 { leveltime = leveltime77 } else if levelSelected == 78 { leveltime = leveltime78 } else if levelSelected == 79 { leveltime = leveltime79 } else if levelSelected == 80 { leveltime = leveltime80 } else if levelSelected == 81 { leveltime = leveltime81 } else if levelSelected == 82 { leveltime = leveltime82 } else if levelSelected == 83 { leveltime = leveltime83 } else if levelSelected == 84 { leveltime = leveltime84 } else if levelSelected == 85 { leveltime = leveltime85 } else if levelSelected == 86 { leveltime = leveltime86 } else if levelSelected == 87 { leveltime = leveltime87 } else if levelSelected == 88 { leveltime = leveltime88 } else if levelSelected == 89 { leveltime = leveltime89 } else if levelSelected == 90 { leveltime = leveltime90 } else if levelSelected == 91 { leveltime = leveltime91 } else if levelSelected == 92 { leveltime = leveltime92 } else if levelSelected == 93 { leveltime = leveltime93 } else if levelSelected == 94 { leveltime = leveltime94 } else if levelSelected == 95 { leveltime = leveltime95 } else if levelSelected == 96 { leveltime = leveltime96 } else if levelSelected == 97 { leveltime = leveltime97 } else if levelSelected == 98 { leveltime = leveltime98 } else if levelSelected == 99 { leveltime = leveltime99 } else if levelSelected == 100 { leveltime = leveltime100 }
        

        // ------Top View----- //
        
        currentLevel.font = gamefont
        timeLabel.font = gamefont
        bestLabel.font = gamefont
        scoreLabel.font = gamefont
        currentLevel.textColor = UIColor(red: 0.636, green: 0.745, blue: 0.373, alpha: 1)
        bestLabel.textColor = UIColor(red: 0.636, green: 0.745, blue: 0.373, alpha: 1)

        currentLevel.text = "Level\n\(levelSelected)"
        bestLabel.text = "Best\n\(leveltime)s"
        scoreLabel.text = "Score\n."
        
        
        // create a stars image view depeding on time
        var starsimg : UIImage!
        if leveltime == 0 {
            starsimg = UIImage(named: "0star")
        } else if leveltime <= levelSelected*5 {
            starsimg = UIImage(named: "3star")
        } else if leveltime > 5 && leveltime < levelSelected*10 {
            starsimg = UIImage(named: "2star")
        } else if leveltime >= levelSelected*10 {
            starsimg = UIImage(named: "1star")
        } else {
            starsimg = UIImage(named: "0star")
        }
        starsimgView.image = starsimg
        
        
        
        
        
        
        // this is the main gameview box shape created programatically in variablesView
        gamesubView.backgroundColor = UIColor.brownColor().colorWithAlphaComponent(0.5)
        gamesubView.layer.cornerRadius = 10
        gamesubView.layer.borderWidth = 1
//        boxView.addSubview(gamesubView)
        

        
        
        
        // get the selected level and runfunction levelSelected
        
        var levelfunctions : [()->()] = [runlevel1, runlevel2, runlevel3, runlevel4, runlevel5, runlevel6, runlevel7, runlevel8, runlevel9, runlevel10, runlevel11, runlevel12, runlevel13, runlevel14, runlevel15, runlevel16, runlevel17, runlevel18, runlevel19, runlevel20, runlevel21, runlevel22, runlevel23, runlevel24, runlevel25, runlevel26, runlevel27, runlevel28, runlevel29, runlevel30, runlevel31, runlevel32, runlevel33, runlevel34, runlevel35, runlevel36, runlevel37, runlevel38, runlevel39, runlevel40, runlevel41, runlevel42, runlevel43, runlevel44, runlevel45, runlevel46, runlevel47, runlevel48, runlevel49, runlevel50, runlevel51, runlevel52, runlevel53, runlevel54, runlevel55, runlevel56, runlevel57, runlevel58, runlevel59, runlevel60, runlevel61, runlevel62, runlevel63, runlevel64, runlevel65, runlevel66, runlevel67, runlevel68, runlevel69, runlevel70, runlevel71, runlevel72, runlevel73, runlevel74, runlevel75, runlevel76, runlevel77, runlevel78, runlevel79, runlevel80, runlevel81, runlevel82, runlevel83, runlevel84, runlevel85, runlevel86, runlevel87, runlevel88, runlevel89, runlevel90, runlevel91, runlevel92, runlevel93, runlevel94, runlevel95, runlevel96, runlevel97, runlevel98, runlevel99, runlevel100]
        levelfunctions[levelSelected - 1]()
        
        exitBlock.frame = CGRectMake(xblock6, yblock3, blocksize, blocksize)
        exitBlock.backgroundColor = UIColor.brownColor()
        gamesubView.addSubview(exitBlock)
        
        mainBlock.frame = CGRect(x: mainx, y: yblock3, width: blocksize2, height: blocksize)
        gamesubView.addSubview(mainBlock)
        
        
        
        hBlocksmall.frame = CGRectMake(CGFloat(hbsx), CGFloat(hbsy), blocksize2, blocksize)
        gamesubView.addSubview(hBlocksmall)
        
        hBlockbig.frame = CGRectMake(CGFloat(hbbx), CGFloat(hbby), sizehbb, blocksize)
        gamesubView.addSubview(hBlockbig)
        
        vBlockbig.frame = CGRectMake(CGFloat(vbbx), CGFloat(vbby), blocksize, sizevbb)
        gamesubView.addSubview(vBlockbig)
        
        vBlocksmall.frame = CGRectMake(CGFloat(vbsx), CGFloat(vbsy), blocksize, blocksize2)
        gamesubView.addSubview(vBlocksmall)
        
        vBlocksmall1.frame = CGRectMake(CGFloat(vbs1x), CGFloat(vbs1y), blocksize, blocksize2)
        gamesubView.addSubview(vBlocksmall1)
        
        vBlockbig1.frame = CGRectMake(CGFloat(vbb1x), CGFloat(vbb1y), blocksize, sizevbb1)
        gamesubView.addSubview(vBlockbig1)
        
        hBlocksmall1.frame = CGRectMake(CGFloat(hbs1x), CGFloat(hbs1y), blocksize2, blocksize)
        gamesubView.addSubview(hBlocksmall1)
        
        hBlockbig1.frame = CGRectMake(CGFloat(hbb1x), CGFloat(hbb1y), sizehbb1, blocksize)
        gamesubView.addSubview(hBlockbig1)
        
        hBlocksmall2.frame = CGRectMake(CGFloat(hbs2x), CGFloat(hbs2y), blocksize2, blocksize)
        gamesubView.addSubview(hBlocksmall2)
        
        hBlockbig2.frame = CGRectMake(CGFloat(hbb2x), CGFloat(hbb2y), sizehbb2, blocksize)
        gamesubView.addSubview(hBlockbig2)
        
        vBlockbig2.frame = CGRectMake(CGFloat(vbb2x), CGFloat(vbb2y), blocksize, sizevbb2)
        gamesubView.addSubview(vBlockbig2)
        
        vBlocksmall2.frame = CGRectMake(CGFloat(vbs2x), CGFloat(vbs2y), blocksize, blocksize2)
        gamesubView.addSubview(vBlocksmall2)
        
        hBlocksmall3.frame = CGRectMake(CGFloat(hbs3x), CGFloat(hbs3y), blocksize2, blocksize)
        gamesubView.addSubview(hBlocksmall3)
        
        hBlockbig3.frame = CGRectMake(CGFloat(hbb3x), CGFloat(hbb3y), sizehbb3, blocksize)
        gamesubView.addSubview(hBlockbig3)
        
        vBlockbig3.frame = CGRectMake(CGFloat(vbb3x), CGFloat(vbb3y), blocksize, sizevbb3)
        gamesubView.addSubview(vBlockbig3)
        
        vBlocksmall3.frame = CGRectMake(CGFloat(vbs3x), CGFloat(vbs3y), blocksize, blocksize2)
        gamesubView.addSubview(vBlocksmall3)
        
        hBlocksmall4.frame = CGRectMake(CGFloat(hbs4x), CGFloat(hbs4y), blocksize2, blocksize)
        gamesubView.addSubview(hBlocksmall4)
        
        hBlockbig4.frame = CGRectMake(CGFloat(hbb4x), CGFloat(hbb4y), sizehbb4, blocksize)
        gamesubView.addSubview(hBlockbig4)
        
        vBlockbig4.frame = CGRectMake(CGFloat(vbb4x), CGFloat(vbb4y), blocksize, sizevbb4)
        gamesubView.addSubview(vBlockbig4)
        
        vBlocksmall4.frame = CGRectMake(CGFloat(vbs4x), CGFloat(vbs4y), blocksize, blocksize2)
        gamesubView.addSubview(vBlocksmall4)
        
     //   view.addSubview(gamesubView)
        
    }

// hide the status bar
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    
    override func viewDidAppear(animated: Bool) {
        startTimer() // start timer
        self.view.addSubview(gamesubView)
        sendScreenView("Level \(levelSelected)")
//      load banner
        if adsremoved == false {
            if didbuyad == false {
               let origin = CGPointMake(0.0 , self.view.frame.size.height - CGSizeFromGADAdSize(kGADAdSizeBanner).height)
//            let banview = GADBannerView(adSize: GADAdSizeFullWidthPortraitWithHeight(50), origin: origin)
//            banview.adUnitID = bannerId
//            banview.delegate = self
//            banview.rootViewController = self
//            view.addSubview(banview)
//            
//            let request = GADRequest()
//            request.testDevices = [ GAD_SIMULATOR_ID ]
//            banview.loadRequest(request)
            }
            
        
        }
        
        if playMusic {
            let soundURL = NSBundle.mainBundle().URLForResource("backgroundmusic", withExtension: "mp3")
            do {
                try audioPlayer = AVAudioPlayer(contentsOfURL: soundURL!)
            } catch {
                print("NO AUDIO PLAYER")
            }
            audioPlayer.numberOfLoops = -1
            audioPlayer.play()
        }
        
    }

    override func viewWillDisappear(animated: Bool) {
        if playMusic {
            audioPlayer.stop()
        }
        
    }
    
    
    
    // pause timer when users leave
    func pauseTimer(notification: NSNotification) {
        timer.invalidate()
    }
    
    // resume timer
    func resumeTimer(notification: NSNotification) {
        self.startTimer()
    }

    

    
    // next level button
    @IBAction func nextButton(sender: AnyObject) {
        
        if levelSelected < totalLevelsCompleted {
            if levelSelected + 1 == maxLevel {
                if levelunlocked == false {
                    let alert = UIAlertView(title: "Complete This Level", message: "You must complete this level to buy that level", delegate: self, cancelButtonTitle: "Okay")
                    alert.show()
                } else {
                    let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
                    gameview.levelSelected = Int(levelSelected + 1) // increase 1 for next
                    self.presentViewController(gameview, animated: true, completion: nil)
                }
            } else {
                let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
                gameview.levelSelected = Int(levelSelected + 1) // increase 1 for next
                self.presentViewController(gameview, animated: true, completion: nil)
            }
            
        } else {
            print("Oops next level is Locked")
            let alert = UIAlertView(title: "Next Level Locked", message: "Sorry! You Must Complete this level to unlock next level", delegate: self, cancelButtonTitle: "Okay")
            alert.show()
        }
        
    }
    
    // last level button
    @IBAction func lastButton(sender: AnyObject) {
        
        if levelSelected > 1 && levelSelected <= totalLevelsCompleted  {
            let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
            gameview.levelSelected = Int(levelSelected - 1)
            self.presentViewController(gameview, animated: true, completion: nil)
        } else {
            print("Oops last level is doesn't exist")
        let alert = UIAlertView(title: "No Level 0", message: "Level 0 doesn't exist", delegate: self, cancelButtonTitle: "Okay")
            alert.show()
        }
        
    }
    
    // reset level button
    @IBAction func resetButton(sender: AnyObject) {
        let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
        gameview.levelSelected = Int(levelSelected)
        self.presentViewController(gameview, animated: true, completion: nil)
        
    }
    
    
    
    
    
    
    
    
    func levelcomplete(levelnum:Int,timetaken:Int) {
        let nextlevel = levelnum + 1
        
        timer.invalidate() // stop timer
        
        // save the time dependting on leveltime1.....
        let levelkey = "leveltime\(levelnum)"
        defaults.setInteger(timetaken, forKey: levelkey)
        defaults.synchronize()
        
        
        if levelSelected == 1 { leveltime1 = defaults.integerForKey("leveltime1") } else if levelSelected == 2 { leveltime2 = defaults.integerForKey("leveltime2") } else if levelSelected == 3 { leveltime3 = defaults.integerForKey("leveltime3") } else if levelSelected == 4 { leveltime4 = defaults.integerForKey("leveltime4") } else if levelSelected == 5 { leveltime5 = defaults.integerForKey("leveltime5") } else if levelSelected == 6 { leveltime6 = defaults.integerForKey("leveltime6") } else if levelSelected == 7 { leveltime7 = defaults.integerForKey("leveltime7") } else if levelSelected == 8 { leveltime8 = defaults.integerForKey("leveltime8") } else if levelSelected == 9 { leveltime9 = defaults.integerForKey("leveltime9") } else if levelSelected == 10 { leveltime10 = defaults.integerForKey("leveltime10") } else if levelSelected == 11 { leveltime11 = defaults.integerForKey("leveltime11") } else if levelSelected == 12 { leveltime12 = defaults.integerForKey("leveltime12") } else if levelSelected == 13 { leveltime13 = defaults.integerForKey("leveltime13") } else if levelSelected == 14 { leveltime14 = defaults.integerForKey("leveltime14") } else if levelSelected == 15 { leveltime15 = defaults.integerForKey("leveltime15") } else if levelSelected == 16 { leveltime16 = defaults.integerForKey("leveltime16") } else if levelSelected == 17 { leveltime17 = defaults.integerForKey("leveltime17") } else if levelSelected == 18 { leveltime18 = defaults.integerForKey("leveltime18") } else if levelSelected == 19 { leveltime19 = defaults.integerForKey("leveltime19") } else if levelSelected == 20 { leveltime20 = defaults.integerForKey("leveltime20") } else if levelSelected == 21 { leveltime21 = defaults.integerForKey("leveltime21") } else if levelSelected == 22 { leveltime22 = defaults.integerForKey("leveltime22") } else if levelSelected == 23 { leveltime23 = defaults.integerForKey("leveltime23") } else if levelSelected == 24 { leveltime24 = defaults.integerForKey("leveltime24") } else if levelSelected == 25 { leveltime25 = defaults.integerForKey("leveltime25") } else if levelSelected == 26 { leveltime26 = defaults.integerForKey("leveltime26") } else if levelSelected == 27 { leveltime27 = defaults.integerForKey("leveltime27") } else if levelSelected == 28 { leveltime28 = defaults.integerForKey("leveltime28") } else if levelSelected == 29 { leveltime29 = defaults.integerForKey("leveltime29") } else if levelSelected == 30 { leveltime30 = defaults.integerForKey("leveltime30") } else if levelSelected == 31 { leveltime31 = defaults.integerForKey("leveltime31") } else if levelSelected == 32 { leveltime32 = defaults.integerForKey("leveltime32") } else if levelSelected == 33 { leveltime33 = defaults.integerForKey("leveltime33") } else if levelSelected == 34 { leveltime34 = defaults.integerForKey("leveltime34") } else if levelSelected == 35 { leveltime35 = defaults.integerForKey("leveltime35") } else if levelSelected == 36 { leveltime36 = defaults.integerForKey("leveltime36") } else if levelSelected == 37 { leveltime37 = defaults.integerForKey("leveltime37") } else if levelSelected == 38 { leveltime38 = defaults.integerForKey("leveltime38") } else if levelSelected == 39 { leveltime39 = defaults.integerForKey("leveltime39") } else if levelSelected == 40 { leveltime40 = defaults.integerForKey("leveltime40") } else if levelSelected == 41 { leveltime41 = defaults.integerForKey("leveltime41") } else if levelSelected == 42 { leveltime42 = defaults.integerForKey("leveltime42") } else if levelSelected == 43 { leveltime43 = defaults.integerForKey("leveltime43") } else if levelSelected == 44 { leveltime44 = defaults.integerForKey("leveltime44") } else if levelSelected == 45 { leveltime45 = defaults.integerForKey("leveltime45") } else if levelSelected == 46 { leveltime46 = defaults.integerForKey("leveltime46") } else if levelSelected == 47 { leveltime47 = defaults.integerForKey("leveltime47") } else if levelSelected == 48 { leveltime48 = defaults.integerForKey("leveltime48") } else if levelSelected == 49 { leveltime49 = defaults.integerForKey("leveltime49") } else if levelSelected == 50 { leveltime50 = defaults.integerForKey("leveltime50") } else if levelSelected == 51 { leveltime51 = defaults.integerForKey("leveltime51") } else if levelSelected == 52 { leveltime52 = defaults.integerForKey("leveltime52") } else if levelSelected == 53 { leveltime53 = defaults.integerForKey("leveltime53") } else if levelSelected == 54 { leveltime54 = defaults.integerForKey("leveltime54") } else if levelSelected == 55 { leveltime55 = defaults.integerForKey("leveltime55") } else if levelSelected == 56 { leveltime56 = defaults.integerForKey("leveltime56") } else if levelSelected == 57 { leveltime57 = defaults.integerForKey("leveltime57") } else if levelSelected == 58 { leveltime58 = defaults.integerForKey("leveltime58") } else if levelSelected == 59 { leveltime59 = defaults.integerForKey("leveltime59") } else if levelSelected == 60 { leveltime60 = defaults.integerForKey("leveltime60") } else if levelSelected == 61 { leveltime61 = defaults.integerForKey("leveltime61") } else if levelSelected == 62 { leveltime62 = defaults.integerForKey("leveltime62") } else if levelSelected == 63 { leveltime63 = defaults.integerForKey("leveltime63") } else if levelSelected == 64 { leveltime64 = defaults.integerForKey("leveltime64") } else if levelSelected == 65 { leveltime65 = defaults.integerForKey("leveltime65") } else if levelSelected == 66 { leveltime66 = defaults.integerForKey("leveltime66") } else if levelSelected == 67 { leveltime67 = defaults.integerForKey("leveltime67") } else if levelSelected == 68 { leveltime68 = defaults.integerForKey("leveltime68") } else if levelSelected == 69 { leveltime69 = defaults.integerForKey("leveltime69") } else if levelSelected == 70 { leveltime70 = defaults.integerForKey("leveltime70") } else if levelSelected == 71 { leveltime71 = defaults.integerForKey("leveltime71") } else if levelSelected == 72 { leveltime72 = defaults.integerForKey("leveltime72") } else if levelSelected == 73 { leveltime73 = defaults.integerForKey("leveltime73") } else if levelSelected == 74 { leveltime74 = defaults.integerForKey("leveltime74") } else if levelSelected == 75 { leveltime75 = defaults.integerForKey("leveltime75") } else if levelSelected == 76 { leveltime76 = defaults.integerForKey("leveltime76") } else if levelSelected == 77 { leveltime77 = defaults.integerForKey("leveltime77") } else if levelSelected == 78 { leveltime78 = defaults.integerForKey("leveltime78") } else if levelSelected == 79 { leveltime79 = defaults.integerForKey("leveltime79") } else if levelSelected == 80 { leveltime80 = defaults.integerForKey("leveltime80") } else if levelSelected == 81 { leveltime81 = defaults.integerForKey("leveltime81") } else if levelSelected == 82 { leveltime82 = defaults.integerForKey("leveltime82") } else if levelSelected == 83 { leveltime83 = defaults.integerForKey("leveltime83") } else if levelSelected == 84 { leveltime84 = defaults.integerForKey("leveltime84") } else if levelSelected == 85 { leveltime85 = defaults.integerForKey("leveltime85") } else if levelSelected == 86 { leveltime86 = defaults.integerForKey("leveltime86") } else if levelSelected == 87 { leveltime87 = defaults.integerForKey("leveltime87") } else if levelSelected == 88 { leveltime88 = defaults.integerForKey("leveltime88") } else if levelSelected == 89 { leveltime89 = defaults.integerForKey("leveltime89") } else if levelSelected == 90 { leveltime90 = defaults.integerForKey("leveltime90") } else if levelSelected == 91 { leveltime91 = defaults.integerForKey("leveltime91") } else if levelSelected == 92 { leveltime92 = defaults.integerForKey("leveltime92") } else if levelSelected == 93 { leveltime93 = defaults.integerForKey("leveltime93") } else if levelSelected == 94 { leveltime94 = defaults.integerForKey("leveltime94") } else if levelSelected == 95 { leveltime95 = defaults.integerForKey("leveltime95") } else if levelSelected == 96 { leveltime96 = defaults.integerForKey("leveltime96") } else if levelSelected == 97 { leveltime97 = defaults.integerForKey("leveltime97") } else if levelSelected == 98 { leveltime98 = defaults.integerForKey("leveltime98") } else if levelSelected == 99 { leveltime99 = defaults.integerForKey("leveltime99") } else if levelSelected == 100 { leveltime100 = defaults.integerForKey("leveltime100") }
        
        
        
        // check if its 0 then make it 1 because its initial value is 0
        if totalLevelsCompleted == 0 {
            totalLevelsCompleted = 1
        }
        // check if user is playing the last unlocked level
        if levelnum == totalLevelsCompleted {
            defaults.setInteger(nextlevel, forKey: "totalLevelsCompleted")
            defaults.synchronize()
            totalLevelsCompleted = defaults.integerForKey("totalLevelsCompleted")
            print("unlocked \(totalLevelsCompleted)")
            
            
            
            if levelnum == 10 {
                GameCenterInteractor().reportAchievementIdentifier(achivement1, percent: 100)
            } else if levelnum == 20 {
                GameCenterInteractor().reportAchievementIdentifier(achivement2, percent: 100)
            }else if levelnum == 30 {
                GameCenterInteractor().reportAchievementIdentifier(achivement3, percent: 100)
            }else if levelnum == 40 {
                GameCenterInteractor().reportAchievementIdentifier(achivement4, percent: 100)
            }else if levelnum == 50 {
                GameCenterInteractor().reportAchievementIdentifier(achivement5, percent: 100)
            }else if levelnum == 60 {
                GameCenterInteractor().reportAchievementIdentifier(achivement6, percent: 100)
            }else if levelnum == 70 {
                GameCenterInteractor().reportAchievementIdentifier(achivement7, percent: 100)
            }else if levelnum == 80 {
                GameCenterInteractor().reportAchievementIdentifier(achivement8, percent: 100)
            }else if levelnum == 90 {
                GameCenterInteractor().reportAchievementIdentifier(achivement9, percent: 100)
            }else if levelnum == 96 {
                GameCenterInteractor().reportAchievementIdentifier(achivement10, percent: 100)
            }else if levelnum == 97 {
                GameCenterInteractor().reportAchievementIdentifier(achivement11, percent: 100)
            }else if levelnum == 98 {
                GameCenterInteractor().reportAchievementIdentifier(achivement12, percent: 100)
            }else if levelnum == 99 {
                GameCenterInteractor().reportAchievementIdentifier(achivement13, percent: 100)
            }else if levelnum == 100 {
                GameCenterInteractor().reportAchievementIdentifier(achivement14, percent: 100)
            }
            
            
            
            
            
            
            
            let totalTime = leveltime1 + leveltime2 + leveltime3 + leveltime4 + leveltime5 + leveltime6 + leveltime7 + leveltime8 + leveltime9 + leveltime10 + leveltime11 + leveltime12 + leveltime13 + leveltime14 + leveltime15 + leveltime16 + leveltime17 + leveltime18 + leveltime19 + leveltime20 + leveltime21 + leveltime22 + leveltime23 + leveltime24 + leveltime25 + leveltime26 + leveltime27 + leveltime28 + leveltime29 + leveltime30 + leveltime31 + leveltime32 + leveltime33 + leveltime34 + leveltime35 + leveltime36 + leveltime37 + leveltime38 + leveltime39 + leveltime40 + leveltime41 + leveltime42 + leveltime43 + leveltime44 + leveltime45 + leveltime46 + leveltime47 + leveltime48 + leveltime49 + leveltime50 + leveltime51 + leveltime52 + leveltime53 + leveltime54 + leveltime55 + leveltime56 + leveltime57 + leveltime58 + leveltime59 + leveltime60 + leveltime61 + leveltime62 + leveltime63 + leveltime64 + leveltime65 + leveltime66 + leveltime67 + leveltime68 + leveltime69 + leveltime70 + leveltime71 + leveltime72 + leveltime73 + leveltime74 + leveltime75 + leveltime76 + leveltime77 + leveltime78 + leveltime79 + leveltime80 + leveltime81 + leveltime82 + leveltime83 + leveltime84 + leveltime85 + leveltime86 + leveltime87 + leveltime88 + leveltime89 + leveltime90 + leveltime91 + leveltime92 + leveltime93 + leveltime94 + leveltime95 + leveltime96 + leveltime97 + leveltime98 + leveltime99 + leveltime100
            
            
            
            // calulating the score
            let timetoscor = ((3 + levelnum*3)*levelnum*1000)/2
            var timetoscore = timetoscor/totalTime
            if timetoscore > 999 {
                timetoscore = 999
            }
            let totalscore = levelnum*1000 + timetoscore
            
            // println("total time \(totalTime) and score = \(totalscore) timetoscore= \(timetoscore)")
            defaults.setInteger(totalscore, forKey: "totalscore")

            // submit score to game Center
            GameCenterInteractor().reportLeaderboardIdentifier(leaderboardId, score: totalscore)
        }
        
        
        trackEvent("ui_action", action: "level \(levelSelected) Completed", label: "completed", value: nil)
        
        // then show the gameoverview
        let gameoverview = self.storyboard?.instantiateViewControllerWithIdentifier("gameovervc") as! GameOverView
        gameoverview.levelSelected = Int(levelSelected)
        gameoverview.timetaken = Int(timetaken)
        self.presentViewController(gameoverview, animated: true, completion: nil)
        
    }

    
    
    
    
    
    

}
    

