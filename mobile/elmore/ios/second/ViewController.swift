//
//  ViewController.swift
//  second
//
//  Created by bang doan on 10/26/15.
//  Copyright © 2015 bang doan. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    //let url = "http://mobile.taiminh.com/elmore/"
    @IBOutlet weak var webView: UIWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let url = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "www")
        let requestURL = URL(string:url!)
        let request = URLRequest(url: requestURL!)
        webView.loadRequest(request)
        //let requestURL = URL(string:url)
        //let request = URLRequest(url: requestURL!)
        //webView.loadRequest(request)
        //swipe left or right to go back or foward
        let leftSwipe = UISwipeGestureRecognizer(target: self, action: #selector(ViewController.handleSwipes(_:)))
        let rightSwipe = UISwipeGestureRecognizer(target: self, action: #selector(ViewController.handleSwipes(_:)))
        
        leftSwipe.direction = .left
        rightSwipe.direction = .right
        
        view.addGestureRecognizer(leftSwipe)
        view.addGestureRecognizer(rightSwipe)
    
    }
    //swipe left to go forward
    func handleSwipes(_ sender:UISwipeGestureRecognizer) {
        if (sender.direction == .left) {
            webView.goForward()
            
        }
        //swipe right to go backward
        if (sender.direction == .right) {
            webView.goBack()
            
        }
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override var prefersStatusBarHidden : Bool {
        return true
    }

}

