//
//  VariablesView.swift
//  SlideToWin
//
//  Created by djay mac on 13/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit


let phonescreen : CGRect = UIScreen.mainScreen().bounds // phonescreen height and width
var device = UIDevice.currentDevice().model

// top and bottom image sizes depending on screen resolution
var topbottom = (phonescreen.height - phonescreen.width)/2

// lets create subview for main gamescene

var gamesubFrame : CGRect = CGRectMake(10, topbottom + 10, phonescreen.width - 20, phonescreen.width - 20)
var gamesubView : UIView = UIView(frame: gamesubFrame)





// blocksizes depending on screen of the screensize
var blocksize = (phonescreen.width-20 - diff*7)/6
var blocksize2 = ((phonescreen.width-20 - diff*7)/3) + diff
var blocksize3 = ((phonescreen.width-20 - diff*7)/2) + diff*2

let mainBlockimg = UIImage(named: "blockg.png") // green image
let mainBlock = UIImageView(image: mainBlockimg)
var mainblockx = mainBlock.frame.origin.x




var vblocksimg = UIImage(named: "vblocks") // vertical block small
var vBlocksmall = UIImageView(image: vblocksimg)
var vBlocksmall1 = UIImageView(image: vblocksimg)
var vBlocksmall2 = UIImageView(image: vblocksimg)
var vBlocksmall3 = UIImageView(image: vblocksimg)
var vBlocksmall4 = UIImageView(image: vblocksimg)



let hblocksimg = UIImage(named: "hblocks") // horizontal block small
var hBlocksmall = UIImageView(image: hblocksimg)
var hBlocksmall1 = UIImageView(image: hblocksimg)
var hBlocksmall2 = UIImageView(image: hblocksimg)
var hBlocksmall3 = UIImageView(image: hblocksimg)
var hBlocksmall4 = UIImageView(image: hblocksimg)


let vblockbimg = UIImage(named: "vblockb") // horizontal block big
var vBlockbig = UIImageView(image: vblockbimg)
var vBlockbig1 = UIImageView(image: vblockbimg)
var vBlockbig2 = UIImageView(image: vblockbimg)
var vBlockbig3 = UIImageView(image: vblockbimg)
var vBlockbig4 = UIImageView(image: vblockbimg)


let hblockbimg = UIImage(named: "hblockb") // horizontal block big
var hBlockbig = UIImageView(image: hblockbimg)
var hBlockbig1 = UIImageView(image: hblockbimg)
var hBlockbig2 = UIImageView(image: hblockbimg)
var hBlockbig3 = UIImageView(image: hblockbimg)
var hBlockbig4 = UIImageView(image: hblockbimg)


let exitimg = UIImage(named: "exit.png") // exit block
let exitBlock = UIImageView(image: exitimg)


var aa = gamesubView.frame.width/2


// difference between each block in gameview
var diff = CGFloat(2.0)

var xblock1 = diff
var xblock2 = CGFloat(diff*2 + blocksize)
var xblock3 = CGFloat(diff*3 + blocksize*2)
var xblock4 = CGFloat(diff*4 + blocksize*3)
var xblock5 = CGFloat(diff*5 + blocksize*4)
var xblock6 = CGFloat(diff*6 + blocksize*5)

var yblock1 = diff
var yblock2 = CGFloat(diff*2 + blocksize)
var yblock3 = CGFloat(diff*3 + blocksize*2)
var yblock4 = CGFloat(diff*4 + blocksize*3)
var yblock5 = CGFloat(diff*5 + blocksize*4)
var yblock6 = CGFloat(diff*6 + blocksize*5)

var xblock = CGFloat(5000.0)
var yblock = CGFloat(5000.0)

// touch point
var location = CGPoint(x: 0, y:0) // used in gameview
var tpoint = CGPoint(x: 0, y:0) // used in viewcontroller silde to start

// iaps
var adsremoved:Bool = defaults.boolForKey("adsremoved")
var levelunlocked:Bool = defaults.boolForKey("levelunlocked")
var didbuyad = false
var didbuyLevel = false

let tracker = GAI.sharedInstance().defaultTracker

func sendScreenView(title:String) {
    tracker.set(kGAIScreenName, value: title)
    tracker.allowIDFACollection = true
    tracker.send(GAIDictionaryBuilder.createScreenView().build() as [NSObject : AnyObject])
}

func trackEvent(category: String, action: String, label: String, value: NSNumber?) {
    let trackDictionary = GAIDictionaryBuilder.createEventWithCategory(category, action: action, label: label, value: value).build()
    tracker.send(trackDictionary as [NSObject : AnyObject])
}


//font

let FontComic = UIFont(name:"Cabold Comic", size: blocksize/2)!
let gamefont = UIFont(name:"Cabold Comic", size: topbottom/5)!
let levelfont = UIFont(name:"Cabold Comic", size: 33)! // used in first page score level


// set the values depending on level(to hide set the value to "xblock")
var mainx = xblock1 // main block only x can be changed

var (vbsx, vbsy)    = (xblock6, yblock1)                // vertical block small
var (vbbx, vbby, sizevbb)    = (xblock, yblock, blocksize3)                          // vertical block big
var (hbsx, hbsy)    = (xblock, yblock)                          // horizontal block small
var (hbbx, hbby, sizehbb)    = (xblock, yblock, blocksize3)                          // horizontal block big
var (vbs1x, vbs1y)  = (xblock, yblock)                // vertical block small 1
var (vbb1x, vbb1y, sizevbb1)  = (xblock, yblock, blocksize3)                          // vertical block big  1
var (hbs1x, hbs1y)  = (xblock, yblock)                          // horizontal block small 1
var (hbb1x, hbb1y, sizehbb1)  = (xblock, yblock, blocksize3)                          // horizontal block big 1
var (vbs2x, vbs2y)  = (xblock, yblock)                // vertical block small 2
var (vbb2x, vbb2y, sizevbb2)  = (xblock, yblock, blocksize3)                          // vertical block big  2
var (hbs2x, hbs2y)  = (xblock, yblock)                          // horizontal block small 2
var (hbb2x, hbb2y, sizehbb2)  = (xblock, yblock, blocksize3)                          // horizontal block big 2
var (vbs3x, vbs3y)  = (xblock, yblock)                // vertical block small 3
var (vbb3x, vbb3y, sizevbb3)  = (xblock, yblock, blocksize3)                          // vertical block big  3
var (hbs3x, hbs3y)  = (xblock, yblock)                          // horizontal block small3
var (hbb3x, hbb3y, sizehbb3)  = (xblock, yblock, blocksize3)                          // horizontal block big3
var (vbs4x, vbs4y)  = (xblock, yblock)                // vertical block small4
var (vbb4x, vbb4y, sizevbb4)  = (xblock, yblock, blocksize3)                          // vertical block big 4
var (hbs4x, hbs4y)  = (xblock, yblock)                          // horizontal block small 4
var (hbb4x, hbb4y, sizehbb4)  = (xblock, yblock, blocksize3)                          // horizontal block big 4



let storyboard:UIStoryboard = UIStoryboard(name: "Main", bundle: nil)















