//
//  SITPOIExterior.h
//  SitumSDK
//
//  Created by A Barros on 14/4/15.
//  Copyright (c) 2015 Situm. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "SITPOIBase.h"

/**
 *  This class represents a Point Of Interest outside a SITIndoorBuilding
 */
@interface SITPOIExterior : SITPOIBase

/**
 *  Latitude coordinate of the Exterior POI.
 */
@property (nonatomic, strong) NSNumber *latitude;
/**
 *  Longitude coordinate of the Exterior POI.
 */
@property (nonatomic, strong) NSNumber *longitude;



@end
