//
//  SocialDelegate.swift
//  ToDeOlho
//
//  Created by Paulo Passos on 13/01/19.
//  Copyright © 2019 paulopassos. All rights reserved.
//

import Foundation

protocol SocialDelegate {
    func onFBSuccessResponse(user : Any)
    func onFBErrorResponse(error : Error?)
    
    func onGoogleSuccessResponse(user : Any)
    func onGoogleErrorResponse(error : Error?)
}
