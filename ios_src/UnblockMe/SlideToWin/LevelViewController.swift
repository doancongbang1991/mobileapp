//
//  LevelViewController.swift
//  SlideToWin
//
//  Created by djay mac on 10/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit
import StoreKit


class LevelViewController: UIViewController, UICollectionViewDelegateFlowLayout, UICollectionViewDataSource, UIAlertViewDelegate, SKProductsRequestDelegate, SKPaymentTransactionObserver  {
    
    @IBOutlet var collectionView: UICollectionView?
    var levelSelected:Int!
    
    @IBOutlet weak var selectLevelLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

    }
    
    
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 100
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("levelViewCell", forIndexPath: indexPath) as! LevelViewCell
        let levelSelected = indexPath.row + 1
        if levelSelected <= totalLevelsCompleted || levelSelected == 1 { // because totallevel initial value is 0
            cell.textLabel?.font = levelfont
            cell.textLabel?.text = "\(levelSelected)"
            cell.imageView?.image = UIImage(named: "levelback")
            cell.textLabel?.textColor = UIColor.whiteColor()
            cell.textLabel?.shadowOffset = CGSize(width: 2, height: 2)
            var leveltime: Int!
            
            if levelSelected == 1 { leveltime = leveltime1 } else if levelSelected == 2 { leveltime = leveltime2 } else if levelSelected == 3 { leveltime = leveltime3 } else if levelSelected == 4 { leveltime = leveltime4 } else if levelSelected == 5 { leveltime = leveltime5 } else if levelSelected == 6 { leveltime = leveltime6 } else if levelSelected == 7 { leveltime = leveltime7 } else if levelSelected == 8 { leveltime = leveltime8 } else if levelSelected == 9 { leveltime = leveltime9 } else if levelSelected == 10 { leveltime = leveltime10 } else if levelSelected == 11 { leveltime = leveltime11 } else if levelSelected == 12 { leveltime = leveltime12 } else if levelSelected == 13 { leveltime = leveltime13 } else if levelSelected == 14 { leveltime = leveltime14 } else if levelSelected == 15 { leveltime = leveltime15 } else if levelSelected == 16 { leveltime = leveltime16 } else if levelSelected == 17 { leveltime = leveltime17 } else if levelSelected == 18 { leveltime = leveltime18 } else if levelSelected == 19 { leveltime = leveltime19 } else if levelSelected == 20 { leveltime = leveltime20 } else if levelSelected == 21 { leveltime = leveltime21 } else if levelSelected == 22 { leveltime = leveltime22 } else if levelSelected == 23 { leveltime = leveltime23 } else if levelSelected == 24 { leveltime = leveltime24 } else if levelSelected == 25 { leveltime = leveltime25 } else if levelSelected == 26 { leveltime = leveltime26 } else if levelSelected == 27 { leveltime = leveltime27 } else if levelSelected == 28 { leveltime = leveltime28 } else if levelSelected == 29 { leveltime = leveltime29 } else if levelSelected == 30 { leveltime = leveltime30 } else if levelSelected == 31 { leveltime = leveltime31 } else if levelSelected == 32 { leveltime = leveltime32 } else if levelSelected == 33 { leveltime = leveltime33 } else if levelSelected == 34 { leveltime = leveltime34 } else if levelSelected == 35 { leveltime = leveltime35 } else if levelSelected == 36 { leveltime = leveltime36 } else if levelSelected == 37 { leveltime = leveltime37 } else if levelSelected == 38 { leveltime = leveltime38 } else if levelSelected == 39 { leveltime = leveltime39 } else if levelSelected == 40 { leveltime = leveltime40 } else if levelSelected == 41 { leveltime = leveltime41 } else if levelSelected == 42 { leveltime = leveltime42 } else if levelSelected == 43 { leveltime = leveltime43 } else if levelSelected == 44 { leveltime = leveltime44 } else if levelSelected == 45 { leveltime = leveltime45 } else if levelSelected == 46 { leveltime = leveltime46 } else if levelSelected == 47 { leveltime = leveltime47 } else if levelSelected == 48 { leveltime = leveltime48 } else if levelSelected == 49 { leveltime = leveltime49 } else if levelSelected == 50 { leveltime = leveltime50 } else if levelSelected == 51 { leveltime = leveltime51 } else if levelSelected == 52 { leveltime = leveltime52 } else if levelSelected == 53 { leveltime = leveltime53 } else if levelSelected == 54 { leveltime = leveltime54 } else if levelSelected == 55 { leveltime = leveltime55 } else if levelSelected == 56 { leveltime = leveltime56 } else if levelSelected == 57 { leveltime = leveltime57 } else if levelSelected == 58 { leveltime = leveltime58 } else if levelSelected == 59 { leveltime = leveltime59 } else if levelSelected == 60 { leveltime = leveltime60 } else if levelSelected == 61 { leveltime = leveltime61 } else if levelSelected == 62 { leveltime = leveltime62 } else if levelSelected == 63 { leveltime = leveltime63 } else if levelSelected == 64 { leveltime = leveltime64 } else if levelSelected == 65 { leveltime = leveltime65 } else if levelSelected == 66 { leveltime = leveltime66 } else if levelSelected == 67 { leveltime = leveltime67 } else if levelSelected == 68 { leveltime = leveltime68 } else if levelSelected == 69 { leveltime = leveltime69 } else if levelSelected == 70 { leveltime = leveltime70 } else if levelSelected == 71 { leveltime = leveltime71 } else if levelSelected == 72 { leveltime = leveltime72 } else if levelSelected == 73 { leveltime = leveltime73 } else if levelSelected == 74 { leveltime = leveltime74 } else if levelSelected == 75 { leveltime = leveltime75 } else if levelSelected == 76 { leveltime = leveltime76 } else if levelSelected == 77 { leveltime = leveltime77 } else if levelSelected == 78 { leveltime = leveltime78 } else if levelSelected == 79 { leveltime = leveltime79 } else if levelSelected == 80 { leveltime = leveltime80 } else if levelSelected == 81 { leveltime = leveltime81 } else if levelSelected == 82 { leveltime = leveltime82 } else if levelSelected == 83 { leveltime = leveltime83 } else if levelSelected == 84 { leveltime = leveltime84 } else if levelSelected == 85 { leveltime = leveltime85 } else if levelSelected == 86 { leveltime = leveltime86 } else if levelSelected == 87 { leveltime = leveltime87 } else if levelSelected == 88 { leveltime = leveltime88 } else if levelSelected == 89 { leveltime = leveltime89 } else if levelSelected == 90 { leveltime = leveltime90 } else if levelSelected == 91 { leveltime = leveltime91 } else if levelSelected == 92 { leveltime = leveltime92 } else if levelSelected == 93 { leveltime = leveltime93 } else if levelSelected == 94 { leveltime = leveltime94 } else if levelSelected == 95 { leveltime = leveltime95 } else if levelSelected == 96 { leveltime = leveltime96 } else if levelSelected == 97 { leveltime = leveltime97 } else if levelSelected == 98 { leveltime = leveltime98 } else if levelSelected == 99 { leveltime = leveltime99 } else if levelSelected == 100 { leveltime = leveltime100 }
            
            
            
            if leveltime == 0 {
                cell.StarView?.image = UIImage(named: "0star")
            } else if leveltime <= levelSelected*5 {
                cell.StarView?.image = UIImage(named: "3star")
            } else if leveltime > 5 && leveltime < levelSelected*10 {
                cell.StarView?.image = UIImage(named: "2star")
            } else if leveltime >= levelSelected*10 {
                cell.StarView?.image = UIImage(named: "1star")
            } else {
                cell.StarView?.image = UIImage(named: "0star")
            }
            
            
        } else  {
            cell.textLabel?.text = ""
            cell.imageView?.image = UIImage(named: "locked")
            cell.StarView?.image = UIImage(named: "whiteback")
        }
        return cell
    }
    
    
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        let levelSelected = indexPath.row + 1
        let gamevc = self.storyboard?.instantiateViewControllerWithIdentifier("gamevc") as! GameViewController
        gamevc.levelSelected = levelSelected

        
        if levelSelected <= totalLevelsCompleted || levelSelected == 1 {
            if levelSelected >= maxLevel {
                if levelunlocked || didbuyLevel  {
                        self.presentViewController(gamevc, animated: true, completion: nil)
                        print("you selected \(levelSelected) and next level is \(levelSelected + 1)")
                } else {
                    let alert = UIAlertView(title: "Unlock All Levels For $0.99", message: "To Play Level \(maxLevel) and all Other Levels, You Must Buy \"Unlock All Levels\"", delegate: self, cancelButtonTitle: "Cancel", otherButtonTitles: "Buy")
                    alert.show()
                }
                
            } else {
                self.presentViewController(gamevc, animated: true, completion: nil)
                print("you selected \(levelSelected) and next level is \(levelSelected + 1)")
            }
        } else {
            let alert = UIAlertView(title: "Level is locked", message: "Complete the last Level to unlock this Level", delegate: self, cancelButtonTitle: "Okay")
            alert.show()
        }
        
        
        
    }
    

    func alertView(alertView: UIAlertView, clickedButtonAtIndex buttonIndex: Int) {
        if buttonIndex == 1 {
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
    
    
    
    
    
    
    
    
    
    
    
    
    
    @IBAction func backAction(sender: AnyObject) {
        let mainvc = self.storyboard?.instantiateViewControllerWithIdentifier("mainvc") as! ViewController
        
        self.view.addSubview(mainvc.view)
        
      //  mainvc.view.transform = CGAffineTransformMakeScale(0.05, 0.05)
        mainvc.view.transform = CGAffineTransformRotate(CGAffineTransformMakeScale(0.05, 0.05), 360)
        UIView.animateWithDuration(0.5, delay: 0.0, options: UIViewAnimationOptions.CurveEaseOut, animations: { () -> Void in
            
            mainvc.view.transform = CGAffineTransformMakeScale(1.0, 1.0)
           // mainvc.view.transform = CGAffineTransformRotate(CGAffineTransformMakeScale(1.0, 1.0), 0)
            
            }) { (finished) -> Void in
                
                mainvc.view.removeFromSuperview()
                self.presentViewController(mainvc, animated: false, completion: nil)
                
            }
    }
    

    

    
    
    
    func unlockAllLevels() {
        defaults.setBool(true, forKey: "levelunlocked")
        didbuyLevel = true
        let alert = UIAlertView(title: "Great! All Levels unlocked", message: "Now You can continue to play all the levels for free", delegate: self, cancelButtonTitle: "Okay")
        alert.show()
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
            if (validProduct.productIdentifier == levelsid) {
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
                print("Purchase Successful")
                self.unlockAllLevels()
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
 