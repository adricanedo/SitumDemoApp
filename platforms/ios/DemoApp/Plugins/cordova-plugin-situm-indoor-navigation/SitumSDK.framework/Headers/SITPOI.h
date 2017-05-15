//
//  SITPOI.h
//  SitumSDK
//
//  Created by Abraham on 9/3/15.
//  Copyright (c) 2015 Situm. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "SITPOIBase.h"
#import "SITIndoorPoint.h"
/**
 *  This class represents a Point Of Interest inside a SITIndoorBuilding
 *  @see See SITPOIBase to check base properties
 */
@interface SITPOI : SITPOIBase

/**
 *  Identifier of the floor in which the POI resides
 */
@property (nonatomic, strong) NSNumber *level_identifier;
/**
 *  x coordinate of the POI
 */
@property (nonatomic, strong) NSNumber *x;
/**
 *  y coordinate of the POI
 */
@property (nonatomic, strong) NSNumber *y;

/**
 *  radius (m) of the cylindrical area of the POI around the (x,y) point
 */
@property (nonatomic, strong) NSNumber *radius;

/**
 *  sergasID custom ID property
 */
@property (nonatomic, strong) NSNumber *sergasID;

/**
 *  hasShifts custom property for Sergas
 */
@property (nonatomic) BOOL hasShifts;

/**
 *  Method to construct a SITIndoorPoint to use  as a point to calcule routes to/from it
 *
 *  @return SITIndoorPoint object
 */
- (SITIndoorPoint *)indoorPoint;

@end
