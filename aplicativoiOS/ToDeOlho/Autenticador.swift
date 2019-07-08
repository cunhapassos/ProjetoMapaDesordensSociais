//
//  Autenticador.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 13/01/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import Foundation
import FBSDKCoreKit
import FBSDKLoginKit

class Autenticador{
    
    var delegate : SocialDelegate? = nil
    
    func facebookLogin(){
        print("Profile Fetched")
        
        let params = ["fields" : "first_name, last_name , email  , picture.type(large)"]
        FBSDKGraphRequest.init(graphPath: "me", parameters: params).start { (connection, result, error ) in
            if(error != nil){
                print("Profile Error")
                self.delegate?.onFBErrorResponse(error: error)
                return
            }
            
            print(result ?? "")
            self.delegate?.onFBSuccessResponse(user: result!)
        }
    }
}
