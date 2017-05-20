//
//  CustomClasses.m
//  DemoApp
//
//  Created by ignisit on 5/19/17.
//
//

#import <Foundation/Foundation.h>
#import <SitumSDK/SitumSDK.h>

@interface CustomClasses : NSObject {
    // Member variables go here.
}

//Building

- (NSDictionary *) buildingToJsonObject:(SITBuilding *) buildingd;

//Floor

- (NSDictionary *) floorToJsonObject:(CLFloor *) buildingd;

// POI

- (NSDictionary *) poiToJsonObject:(SITIndoorBuilding *) buildingd;

// Location

- (NSDictionary *) locationToJsonObject:(SITIndoorBuilding *) buildingd;

- (NSDictionary *) locationJsonObjectToLocation:(SITIndoorBuilding *) buildingd;

 // Coordinate

- (NSDictionary *) coordinateToJsonObject:(SITIndoorBuilding *) buildingd;

- (NSDictionary *) coordinateJsonObjectToCoordinate:(SITIndoorBuilding *) buildingd;

// Point

- (NSDictionary *) pointToJsonObject:(SITIndoorBuilding *) buildingd;

- (NSDictionary *) pointJsonObjectToPoint:(SITIndoorBuilding *) buildingd;

// CartesianCoordinate

- (NSDictionary *) cartesianCoordinateToJsonObject:(SITIndoorBuilding *) buildingd;

- (NSDictionary *) cartesianCoordinateJsonObjectToCartesianCoordinate:(SITIndoorBuilding *) buildingd;

// Dimensions

- (NSDictionary *) dimensionsToJsonObject:(SITIndoorBuilding *) buildingd;

 // Bounds

- (NSDictionary *) boundsToJsonObject:(SITIndoorBuilding *) buildingd;

// Angle

- (NSDictionary *) angleToJsonObject:(SITIndoorBuilding *) buildingd;

// Route

- (NSDictionary *) routeToJsonObject:(SITIndoorBuilding *) buildingd;

//RouteStep

- (NSDictionary *) routeStepToJsonObject:(SITIndoorBuilding *) buildingd;

- (NSDictionary *) routeStepJsonObjectToRouteStep:(SITIndoorBuilding *) buildingd;

// Indication

- (NSDictionary *) indicationToJsonObject:(SITIndoorBuilding *) buildingd;

- (NSDictionary *) indicationJsonObjectToIndication:(SITIndoorBuilding *) buildingd;

// NavigationProgress

- (NSDictionary *) navigationProgressToJsonObject:(SITIndoorBuilding *) buildingd;

@end


@implementation CustomClasses

@end
