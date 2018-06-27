//
//  GameOverView.swift
//  SlideToWin
//
//  Created by djay mac on 13/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit
import Social
import StoreKit



class GameOverView: UIViewController, UIAlertViewDelegate, SKProductsRequestDelegate, SKPaymentTransactionObserver  {

    @IBOutlet weak var levelLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var starsImg: UIImageView!
    
    var levelSelected: Int! // current gameover level
    var nextlevelnumber: Int!
    var timetaken: Int!
    
    @IBOutlet weak var removeadsbutton: UIButton!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        nextlevelnumber = levelSelected + 1
        
        if adsremoved || didbuyad {
            removeadsbutton.hidden = true
        }

        
        // levelcompleted label and styles
        levelLabel.font = levelfont
        levelLabel.textColor = UIColor(red: 0.341, green: 0.18, blue: 0.067, alpha: 1.0)
        levelLabel.text = "\(levelSelected)"
        
        // time taken to complete the level LABEL
        timeLabel.textColor = UIColor(red: 0.341, green: 0.18, blue: 0.067, alpha: 1.0) // (red: 0.636, green: 0.745, blue: 0.373, alpha: 1.0)
        timeLabel.font = levelfont
        let min = timetaken/60
        let hrs = timetaken/3600
        if timetaken < 60 {
            timeLabel.text = "Time: \(timetaken)" }
        else if timetaken >= 59 && timetaken < 3599 {
            if timetaken < 10 {
                
                timeLabel.text = "Time: \(min):0\(timetaken - min*60)"
            } else {
                timeLabel.text = "Time: \(timetaken/60):\(timetaken - min*60)" }
        } else if timetaken >= 3599 {
            if min - hrs*60 + 1 < 10 {
                timeLabel.text = "Time: \(hrs):0\(min - hrs*60 + hrs):\(timetaken - min*60)"
            } else {
                timeLabel.text = "Time: \(hrs):\(min - hrs*60 + hrs):\(timetaken - min*60)"
            }
        }
        
        
        
        
        if timetaken == 0 {
            starsImg.image = UIImage(named: "0star")
        } else if timetaken <= levelSelected*5 {
            starsImg.image = UIImage(named: "3star")
        } else if timetaken > 5 && timetaken < levelSelected*10 {
            starsImg.image = UIImage(named: "2star")
        } else if timetaken >= levelSelected*10 {
            starsImg.image = UIImage(named: "1star")
        } else {
            starsImg.image = UIImage(named: "0star")
        }
    }

    
    override func viewWillAppear(animated: Bool) {
        if adsremoved == false && showAdsOnLevelComplete {
            if didbuyad == false {
                Chartboost.showInterstitial(CBLocationHomeScreen)
            }
        }
    }

    
    
    @IBAction func homeButton(sender: AnyObject) {
        
        let mainvc = self.storyboard?.instantiateViewControllerWithIdentifier("mainvc") as! ViewController
        self.presentViewController(mainvc, animated: true, completion: nil)
        
    }
    
    
    @IBAction func replayButton(sender: AnyObject) {
        
        print("replaying level =  \(levelSelected)")

        let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
        gameview.levelSelected = Int(levelSelected)
        self.presentViewController(gameview, animated: true, completion: nil)
        
    }
    
    
    @IBAction func nextButton(sender: AnyObject) {
        if levelSelected + 1 < maxLevel {

            let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
            gameview.levelSelected = Int(levelSelected + 1)
            self.presentViewController(gameview, animated: true, completion: nil)
        } else {
            if levelunlocked || didbuyLevel {

                let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
                gameview.levelSelected = Int(levelSelected + 1)
                self.presentViewController(gameview, animated: true, completion: nil)
            } else {
                let alert = UIAlertView(title: "Buy More Levels For $0.99", message: "To Play Level \(maxLevel) and all Other Levels, You Must Buy \"Unlock All Levels\"", delegate: self, cancelButtonTitle: "Cancel", otherButtonTitles: "Buy")
                alert.show()
            }
        }
    }
    
    
    func alertView(alertView: UIAlertView, clickedButtonAtIndex buttonIndex: Int) {
        if buttonIndex == 1 {
            buyingProduct = levelsid
            if(SKPaymentQueue.canMakePayments()) {
                let productID:NSSet = NSSet(objects: levelsid)
                let request: SKProductsRequest = SKProductsRequest(productIdentifiers: productID as! Set<String>)
                request.delegate = self
                request.start()
            } else {
                print("User cant Purchase")
            }
        }
    }
    
    
    @IBAction func removeAdsBtn(sender: UIButton) {
        buyingProduct = adsid
        if(SKPaymentQueue.canMakePayments()) {
            let productID:NSSet = NSSet(objects: adsid)
            let request: SKProductsRequest = SKProductsRequest(productIdentifiers: productID as! Set<String>)
            request.delegate = self
            request.start()
        } else {
            print("User cant Purchase")
        }
    }
    
    
    @IBAction func facebookButton(sender: AnyObject) {
        
        if SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook) {
            
            let controller = SLComposeViewController(forServiceType:SLServiceTypeFacebook)
            
            controller.setInitialText("I just completed level \(levelSelected) in \(timetaken) seconds: Download \(gamename) \(appurl)")
            controller.addURL(NSURL(string: appurl) )
            
            self.presentViewController(controller, animated: true, completion: nil)
            controller.completionHandler = { (result:SLComposeViewControllerResult) -> Void in
                switch result {
                case SLComposeViewControllerResult.Cancelled:
                    print("fb cancel")
                case SLComposeViewControllerResult.Done:
                    trackEvent("share", action: "Fb Shared", label: "share fb", value: nil)
                }
            }
            
        } else {

            let alert = UIAlertView(title: "No Facebook Account", message: "Oops, you've not added facebook account in your iphone settings", delegate: self, cancelButtonTitle: "Okay")
            alert.show()
            
        }

        
    }
    
    
    
    @IBAction func twitterButton(sender: AnyObject) {
        
        if SLComposeViewController.isAvailableForServiceType(SLServiceTypeTwitter) {
            
            let controller = SLComposeViewController(forServiceType:SLServiceTypeTwitter)
            
            controller.setInitialText("I just completed level \(levelSelected) in \(timetaken) seconds: Download \(gamename) \(appurl)")
            controller.addURL(NSURL(string: appurl) )
            
            self.presentViewController(controller, animated: true, completion: nil)
            controller.completionHandler = { (result:SLComposeViewControllerResult) -> Void in
                switch result {
                case SLComposeViewControllerResult.Cancelled:
                    print("twitter cancel")
                case SLComposeViewControllerResult.Done:
                    trackEvent("share", action: "Tw Shared", label: "share tw", value: nil)
                }
            }
            
        } else {

            let alert = UIAlertView(title: "No Twitter Account", message: "Oops! Looks like you've not added Twitter account in your settings", delegate: self, cancelButtonTitle: "Okay")
            alert.show()
        }
        

    }
    
    func unlockAllLevels() {
        defaults.setBool(true, forKey: "levelunlocked")
        defaults.synchronize()
        didbuyLevel = true

        let gameview = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
        gameview.levelSelected = Int(levelSelected + 1)
        self.presentViewController(gameview, animated: true, completion: nil)
    }
    

    
    var buyingProduct:String!
    
    func buyProduct(product: SKProduct){
        print("Sending the Payment Request to Apple");
        let payment = SKPayment(product: product)
        SKPaymentQueue.defaultQueue().addTransactionObserver(self)
        SKPaymentQueue.defaultQueue().addPayment(payment);
    }
    
    
    func productsRequest(request: SKProductsRequest, didReceiveResponse response: SKProductsResponse) {
        
        print("got the request from Apple")
        let count : Int = response.products.count
        if (count > 0) {
            _ = response.products
            let validProduct: SKProduct = response.products[0] 
            if (validProduct.productIdentifier == buyingProduct) {
                print(validProduct.localizedTitle)
                print(validProduct.localizedDescription)
                print(validProduct.price)
                buyProduct(validProduct)
            } else {
                print(validProduct.productIdentifier)
            }
        } else {
            print("No Products")
        }
        
    }
    

    
    
    func paymentQueue(queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        print("add paymnet")
        
        for transaction:AnyObject in transactions {
            let trans = transaction as! SKPaymentTransaction
            print(trans.error)
            
            switch trans.transactionState {
                
            case .Purchased:
                let prodID = buyingProduct
                switch prodID {
                case adsid:
                    print("remove ads")
                    defaults.setBool(true, forKey: "adsremoved")
                    didbuyad = true
                case levelsid:
                    print("add levels to account")
                    self.unlockAllLevels()
                default:
                    print("IAP not setup")
                }
                SKPaymentQueue.defaultQueue().finishTransaction(transaction as! SKPaymentTransaction)
                queue.finishTransaction(trans)
                break;
            case .Failed:
                print("buy error")
                SKPaymentQueue.defaultQueue().finishTransaction(transaction as! SKPaymentTransaction)
                queue.finishTransaction(trans)
                break;
            default:
                print("default")
                break;
                
            }
        }
    }
    
    
    
    func finishTransaction(trans:SKPaymentTransaction)
    {
        print("finish trans")
    }
    
    
    
    func paymentQueue(queue: SKPaymentQueue, removedTransactions transactions: [SKPaymentTransaction])
    {
        print("remove trans");
    }
    
    
    
    
    
    
    
    
}
