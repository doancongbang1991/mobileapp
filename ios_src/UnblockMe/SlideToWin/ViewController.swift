//
//  ViewController.swift
//  SlideToWin
//
//  Created by djay mac on 09/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit
import GameKit
import StoreKit
import AVFoundation
var applaunched = false
var audioPlayer = AVAudioPlayer()


class ViewController: UIViewController, GKGameCenterControllerDelegate, SKProductsRequestDelegate, SKPaymentTransactionObserver {


    
    
    @IBOutlet weak var restore: UIButton!
    @IBOutlet weak var removeads: UIButton!
    @IBOutlet weak var levelLabel: UILabel!
    @IBOutlet weak var scoreLabel: UILabel!
    
    
    var totalscore = defaults.integerForKey("totalscore")

    
    

    



    
    
    
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if adsremoved == false && applaunched == false {
            if didbuyad == false {
                Chartboost.showInterstitial(CBLocationHomeScreen)
            }
            applaunched = true
        }
        


        //<---- User Info-----
        
        // levels completed lable
        levelLabel.font = levelfont
        levelLabel.textColor = UIColor(red: 0.345, green: 0.188, blue: 0.086, alpha: 1)
        levelLabel.shadowColor = UIColor .whiteColor()
        levelLabel.shadowOffset = CGSizeMake(2, 2)
        if totalLevelsCompleted == 0 { // because NSDefaults int values is 0
            totalLevelsCompleted = 1
        }
        levelLabel.text = "Level: \(totalLevelsCompleted - 1)"

        

        // levels completed lable
        scoreLabel.font = levelfont
        scoreLabel.textColor = UIColor(red: 0.345, green: 0.188, blue: 0.086, alpha: 1)
        scoreLabel.shadowColor = UIColor .whiteColor()
        scoreLabel.shadowOffset = CGSizeMake(2, 2)
        let scoreDouble:Double = Double(totalscore)/1000
        scoreLabel.text = "Score: \(scoreDouble)"
        

        
        
    }

    override func viewDidAppear(animated: Bool) {
        
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }

    
    @IBAction func startPressed(sender: UIButton) {

        let levelvc = self.storyboard?.instantiateViewControllerWithIdentifier("levelvc") as! LevelViewController
        
        
        if playMusic {
            let soundURL = NSBundle.mainBundle().URLForResource("lock", withExtension: "mp3")
            do {
                try audioPlayer = AVAudioPlayer(contentsOfURL: soundURL!)
            } catch {
                print("NO AUDIO PLAYER")
            }
            audioPlayer.play()
        }
        
        self.view.addSubview(levelvc.view)
        
        levelvc.view.transform = CGAffineTransformMakeScale(0.05, 0.05)
        
        UIView.animateWithDuration(0.6, delay: 0.0, options: UIViewAnimationOptions.CurveEaseOut, animations: { () -> Void in
            
            levelvc.view.transform = CGAffineTransformMakeScale(1.0, 1.0)
            
            }) { (finished) -> Void in
                
                levelvc.view.removeFromSuperview()
                self.presentViewController(levelvc, animated: false, completion: nil)
                
                
        }
    }
    
    
    

    
    // gamecenter delegate
    func gameCenterViewControllerDidFinish(gameCenterViewController: GKGameCenterViewController) {
        
        gameCenterViewController.dismissViewControllerAnimated(true, completion: nil)
        
        
    }
    

    @IBAction func gameCenter(sender: AnyObject) {
        
        let gc = GKGameCenterViewController()
        _ = self.view?.window?.rootViewController
        gc.gameCenterDelegate = self
        gc.viewState = GKGameCenterViewControllerState.Leaderboards
        self.presentViewController(gc, animated: true, completion: nil)

    }
    
    
    @IBAction func helpButton(sender: AnyObject) {
        
        let alert = UIAlertView(title: "How To Play", message: "Drag the Green Block to exit point to complete the level.", delegate: self, cancelButtonTitle: "Okay")
        alert.show()
        
    }
    
    // rate the application button
    @IBAction func rateButton(sender: AnyObject) {
        
        let itunesurl : NSURL = NSURL(string: appurl)!
        UIApplication.sharedApplication().openURL(itunesurl)
        
    }
    
    
    
    @IBAction func restoreBtn(sender: UIButton) {
        SKPaymentQueue.defaultQueue().addTransactionObserver(self)
        SKPaymentQueue.defaultQueue().restoreCompletedTransactions()
    }
    
    @IBAction func removeBtn(sender: UIButton) {
        if adsremoved || didbuyad {
            
            let alert = UIAlertView(title: "Already Removed", message: "Looks like you've already bought \"Remove Ads\" feature and you won't see any ads", delegate: self, cancelButtonTitle: "Okay")
            alert.show()
        } else {
            if(SKPaymentQueue.canMakePayments()) {
                let productID:NSSet = NSSet(objects: adsid)
                let request: SKProductsRequest = SKProductsRequest(productIdentifiers: productID as! Set<String>)
                request.delegate = self
                request.start()
            } else {
                print("User cant Purchase")
            }
        }
    }

    
    
    
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
            if (validProduct.productIdentifier == adsid) {
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
    
    func paymentQueueRestoreCompletedTransactionsFinished(queue: SKPaymentQueue) {
        print("transactions restored")
        

        for transaction in queue.transactions {
            let t: SKPaymentTransaction = transaction 
            
            let prodID = t.payment.productIdentifier as String
            
            switch prodID {
            case adsid:
                defaults.setBool(true, forKey: "adsremoved")
                didbuyad = true
            case levelsid:
                defaults.setBool(true, forKey: "levelunlocked")
                didbuyLevel = true
            default:
                print("IAP not setup")
            }
            
        }
    }
    
    func request(request: SKRequest, didFailWithError error: NSError) {
        print(error.localizedDescription)
    }
    func paymentQueue(queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        print("add paymnet")
        
        for transaction:AnyObject in transactions {
            let trans = transaction as! SKPaymentTransaction
            print(trans.error)
            
            switch trans.transactionState {
                
            case .Purchased:
                print("Purchase Successful")
                defaults.setBool(true, forKey: "adsremoved")
                didbuyad = true
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

