//
//  SITPOICategory.h
//  SitumSDK
//
//  Created by A Barros on 14/6/16.
//  Copyright © 2016 Situm. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 *  It represents the types of POI
 */
@interface SITPOICategory : NSObject

/**
 *  It represents a unique integer value for each category
 */
@property (nonatomic, strong) NSNumber *identifier;

/**
 *  Name of the category in English
 */
@property (nonatomic, strong) NSString *nameEn;

/**
 *  Name of the category in Spanish
 */
@property (nonatomic, strong) NSString *nameEs;

/**
 *  Unique identifier of a category
 */
@property (nonatomic, strong) NSString *code;

/**
 *  Relative URL where the icon of the category for the normal state can be retrieved
 */
@property (nonatomic, strong) NSString *iconURL;

/**
 *  Relative URL where the icon of the category for the selected state can be retrieved
 */
@property (nonatomic, strong) NSString *selectedIconURL;

/**
 *  Determines the visibility of a category (YES means available to all users, NO means available to a particular user). 
 */
@property (nonatomic) BOOL isPublic;


@end
