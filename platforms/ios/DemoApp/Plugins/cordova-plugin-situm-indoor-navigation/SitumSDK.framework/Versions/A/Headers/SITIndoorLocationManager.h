//
//  SITIndoorLocationManager.h
//  SITIndoorLocation
//
//  Created by Abraham on 23/2/15.
//  Copyright (c) 2015 Situm. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "SITIndoorLocationError.h"

/**
 *  SITIndoorLocationManagerState
 *
 *  @discussion: Represents the current state of the indoor localization manager.
 */
typedef NS_ENUM(int, SITIndoorLocationManagerStates){
    /**
     *  Indoor Localization is not running.
     */
    kSITIndoorLocationManagerStateStopped = 0,
    
    /**
     *  Indoor Localization is running.
     */
    kSITIndoorLocationManagerStateStarted,    
};

@class SITIndoorBuilding, SITIndoorLevel, SITIndoorLocation, SITIndoorRoute;
@protocol SITIndoorLocationManagerDelegate;

/**
 *  The type of block callback for handling indoor locations data.
 *
 *  @param indoorLocation SITIndoorLocation object.
 *  @param error          NSError object in case there was a problem generating locations.
 */
typedef void (^SITIndoorLocationHandler)(SITIndoorLocation *indoorLocation, NSError *error);

/*!
 * This class provide you with methods to  of entry to the SitumSDK.
 */
@interface SITIndoorLocationManager : NSObject

/**
 *  Indoor Location Manager State
 *
 *  @return the current state of the indoor location manager
 */
@property (nonatomic, readonly) SITIndoorLocationManagerStates state;

/**
 *  Object implementing SITIndoorLocationManagerDelegate Protocol
 */
@property (nonatomic, weak) id<SITIndoorLocationManagerDelegate> delegate;


/*!
 *  Call this method to receive a reference to an initialized object of this class
 *  @discussion You should always use this method to obtain the manager object and should not try to create instances directly.
 */
+ (instancetype)sharedManager;

/*!
 *  Start reporting location
 *
 *  @param building              The building to which
 *  @param operationQueue        The queue to which the handler will be executed
 *  @param options               Dictionary containing options parameter that could modify how location works
 *  @param indoorLocationHandler Block of instructions to perform every time a new position is calculated
 *
 *  @return A Boolean value meaning if the operation was performed successfully or not.
 *  @discussion As a developer you should expect a new location every second.
 */
- (BOOL)startReportingIndoorLocationForBuilding:(SITIndoorBuilding *)building
                                        toQueue:(NSOperationQueue *)operationQueue
                                    withOptions:(NSDictionary *)options
                                    withHandler:(SITIndoorLocationHandler)indoorLocationHandler;


/*!
 *  @brief  This method stops reporting locations
 *  @discussion Calling this method when the shared manager is in inactive state will produce NO results
 *
 *  @return A Boolean value meaning if the operation was performed successfully or not.
 */
- (BOOL)stopReportingIndoorLocation;

/**
 *  Tell the system to adjust following location updates to a particular route
 *
 *  @param route a SITIndoorRoute object
 *
 *  @return BOOL value indicating if the operation has been successfull (YES) or not (NO)
 */
- (BOOL)adjustLocationToRoute:(SITIndoorRoute *)route;

/**
 *  Tell the system to cancel adjusting location updates to a particular route
 *
 *  @return BOOL value indicating if the operating has been successfull (YES) or not (NO).
 */
- (BOOL)stopAdjustingLocation;

/**
 *  Check if the system is adjusting locations to a particular route
 *
 *  @return BOOL value indicating if the location is being adjusted (YES) or not (NO)
 */
- (BOOL)isAdjustingLocation;
@end
