//
//  GCHelper.swift
//  SlideToWin
//
//  Created by djay mac on 02/01/15.
//  Copyright (c) 2015 DJay. All rights reserved.
//

import UIKit
import GameKit

protocol GameCenterInteractorNotifications
{
    func willSignIn()
    func didSignIn()
    func failedToSignInWithError(anError:NSError)
    func failedToSignIn()
}

class GameCenterInteractor: NSObject, GKLocalPlayerListener {
    

    let localPlayer = GKLocalPlayer.localPlayer()
    var delegate: GameCenterInteractorNotifications?
    var callingViewController: UIViewController?

    class var sharedInstance : GameCenterInteractor {
        struct Static {
            static let instance : GameCenterInteractor = GameCenterInteractor()
        }
        return Static.instance
}


    func authenticationCheck()
    {
        if (self.localPlayer.authenticated == false)
        {
            //Authenticate the player
            print("The local player is not authenticated.")
            self.authenticateLocalPlayer()
        } else
        {
            print("The local player is authenticated")
            // Register the listener
            self.localPlayer.registerListener(self)
            // At this point you can download match data from Game Center.
        }
}


    func authenticateLocalPlayer()
    {
        self.delegate?.willSignIn()
        
        self.localPlayer.authenticateHandler = {(viewController : UIViewController?, error : NSError?) -> Void in
            if (viewController != nil)
            {
                dispatch_async(dispatch_get_main_queue(), {
//                    self.showAuthenticationDialogueWhenReasonable(presentingViewController: self.callingViewController!, gameCenterController: viewController)
                     print("no game center")
                })
            }
                
            else if (self.localPlayer.authenticated == true)
            {
                print("Player logged in to GameCenter")
                self.localPlayer.registerListener(self)
                self.delegate?.didSignIn()
            }
                
            else
            {
                print("User Still Not Authenticated")
                self.delegate?.failedToSignIn()
                // Delegate can take necessary action. For example: present a UIAlertController noting that sign in failed.
            }
            
            if (error != nil)
            {
                print("Failed to sign in with error:\(error!.localizedDescription).")
                self.delegate?.failedToSignInWithError(error!)
                // Delegate can take necessary action. For example: present a UIAlertController with the error details.
            }
        }
}


    func showAuthenticationDialogueWhenReasonable(presentingViewController presentingViewController:UIViewController, gameCenterController:UIViewController)
    {
        presentingViewController.presentViewController(gameCenterController, animated: true, completion: nil)
}

func reportAchievementIdentifier(identifier: String, percent: Double) {
        let achievement = GKAchievement(identifier: identifier)
        
        achievement.percentComplete = percent
        achievement.showsCompletionBanner = true
        GKAchievement.reportAchievements([achievement]) { (error) -> Void in
            if error != nil {
                print("Error in reporting achievements: \(error)")
            } else {
                        print("score reported \(achievement)")
                    }
        }
    }
    
    func reportLeaderboardIdentifier(identifier: String, score: Int) {
        let scoreObject = GKScore(leaderboardIdentifier: identifier)
        scoreObject.value = Int64(score)
        GKScore.reportScores([scoreObject]) { (error) -> Void in
            if error != nil {
                print("Error in reporting leaderboard scores: \(error)")
            } else {
                        print("score reported \(scoreObject)")
                    }
        }
    }
   
    
    
    
}












