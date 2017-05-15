//
//  SITIndoorLevel.h
//  SitumSDK
//
//  Created by Abraham on 3/3/15.
//  Copyright (c) 2015 Situm. All rights reserved.
//

#ifndef SITIndoorLevel_h
#define SITIndoorLevel_h

#import <Foundation/Foundation.h>

/**
 *  This class describes the properties from a level of a building.
 *  @discussion You should not create objects of this class. Instead you should retrieve them using the
 *  appropiate method of the SITCommunicationManager class.
 */
@interface SITIndoorLevel : NSObject

@property (nonatomic, strong) NSNumber *identifier;
@property (nonatomic, strong) NSNumber *project_identifier;

/**
 *  Number
 */
@property (nonatomic, strong) NSNumber *level;
/**
 *  Name
 */
@property (nonatomic, strong) NSString *name;
/**
 *  Details
 */
@property (nonatomic, strong) NSString *detail;

/**
 *  Scale of the map image (px/meter)
 */
@property (nonatomic, strong) NSNumber *scale;
@property (nonatomic, strong) NSString *map_url;
@property (nonatomic, strong) NSString *server_map_url;

/**
 *  Convinient method to create a string with the numeric information of the level property
 *
 *  @return String with the numeric information of the level property
 */
- (NSString *)shortName;

@end
#endif