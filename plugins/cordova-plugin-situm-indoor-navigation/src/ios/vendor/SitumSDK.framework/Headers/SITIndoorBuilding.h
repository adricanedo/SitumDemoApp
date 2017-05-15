//
//  SITIndoorBuilding.h
//  SitumSDK
//
//  Created by Abraham on 3/3/15.
//  Copyright (c) 2015 Situm. All rights reserved.
//

#ifndef SITIndoorBuilding_h
#define SITIndoorBuilding_h

#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>

@class SITIndoorBuildingModel;

/**
 *  SITBounds represents a rectangular box containing the geographic coordinates of the corners of the region
 */
typedef struct {
    CLLocationCoordinate2D southWest;
    CLLocationCoordinate2D southEast;
    CLLocationCoordinate2D northEast;
    CLLocationCoordinate2D northWest;
} SITBounds;

/**
 *  This class provide details on the building with support for indoor location.
 *  @discussion You should not create objects of this class. Instead you should retrieve them using the
 *  appropiate method of the SITCommunicationManager class.
 */

@interface SITIndoorBuilding : NSObject

// use this as a private property
@property (nonatomic, strong) NSNumber *identifier;
@property (nonatomic, strong) NSNumber *user_identifier;

/**
 *  Name of the building.
 */
@property (nonatomic, strong) NSString *name;
/**
 *  Address string of the building.
 */
@property (nonatomic, strong) NSString *address;
/**
 *  Latitude coordinate of the building.
 */
@property (nonatomic, strong) NSNumber *latitude;
/**
 *  Longitude coordinate of the building.
 */
@property (nonatomic, strong) NSNumber *longitude;

/**
 *  This property is the url of the picture of a SITIndoorBuilding at high quality
 */
@property (nonatomic, strong) NSString *picture_url;

/**
 *  This property is the url of the picture of a SITIndoorBuilding at low quality
 */
@property (nonatomic, strong) NSString *picture_thumb_url;

@property (nonatomic, strong) NSString *server_url;

@property (nonatomic, strong) NSNumber *width;

@property (nonatomic, strong) NSNumber *length;

// customID
@property (nonatomic, strong) NSString *sergasID;
// Array of SITCorner
@property (nonatomic, strong) NSArray *corners;
@property (nonatomic, strong) NSNumber *rotation;

/**
 *  Detailed information in an HTML format
 */
@property (nonatomic, readonly) NSString *info;

/**
 *  Convinient method to restore a CLLocationCoordinate2D object from latitude and longitude coordinates
 *
 *  @return CLLocationCoordinate2D
 */
- (CLLocationCoordinate2D)coordinate;

- (NSDictionary *)hostAndPortFromServerURL;

/**
 *  Converts the orientation from floorplan coordinates to geographic coordinates
 *
 *  @param yaw  value of the orientation in floorplan coordinate. Normally this value is retrieved from SITIndoorLocation
 *  @return float Number with angle (radians)
 *  @discussion If you want to use this value in degrees you should convert it by applying the conversion 180/M_PI
 */
- (NSNumber *)angleFromYaw:(NSNumber *)yaw;

/**
 *  Converts a floorplan coordinate in a geographic coordinate
 *
 *  @param point CGPoint with x and y floorplan coordinates
 *
 *  @return Geographic coordinate
 */
- (CLLocationCoordinate2D)coordinateFromPoint:(CGPoint)point;

/**
 *  Returns a CGPoint for where coordinates sit on the floorplan
 *
 *  @param coordinate Geographic coordinate inside a SITBounds region
 *
 *  @return CGPoint with x and y coordinates
 */
- (CGPoint)pointFromCoordinate:(CLLocationCoordinate2D)coordinate;

/**
 *  Represent the region of a SITIndoorLevel map
 *
 *  @return SITBounds structure with NortWest, NorthEast, SouthWest and SouthEast coordinates
 */
- (SITBounds)bounds;

- (SITBounds)boundsRotated;

/**
 *  Determines if the building has a valid model
 *
 *  @return BOOL value that determines if the model of the building is valid (YES) or not (NO)
 */
- (BOOL)hasValidModel;

- (SITIndoorBuildingModel *)model;

@end
#endif