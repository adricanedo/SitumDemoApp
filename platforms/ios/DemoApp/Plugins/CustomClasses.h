//
//  CustomClasses.h
//  DemoApp
//
//  Created by ignisit on 5/24/17.
//
//
#import <SitumSDK/SitumSDK.h>

@interface CustomClasses : NSObject {
    // Member variables go here.
}
+ (CustomClasses *)shared;

//Building

- (NSDictionary *) buildingToJsonObject:(SITBuilding *) building;

//Floor

- (NSDictionary *) floorToJsonObject:(SITFloor *) floor;

// POI

- (NSDictionary *) poiToJsonObject:(SITPOI *) poi;

// Location

- (NSDictionary *) locationToJsonObject:(SITLocation *) location;

- (SITLocation *) locationJsonObjectToLocation:(NSDictionary *) jo;

// Coordinate

- (NSDictionary *) coordinateToJsonObject:(CLLocationCoordinate2D) coordinate;

- (CLLocationCoordinate2D) coordinateJsonObjectToCoordinate:(NSDictionary *) jo;

// Point

- (NSDictionary *) pointToJsonObject:(SITPoint *) point;

- (SITPoint *) pointJsonObjectToPoint:(NSDictionary *) jo;

// CartesianCoordinate

- (NSDictionary *) cartesianCoordinateToJsonObject:(SITCartesianCoordinate *) cartesianCoordinate;

- (SITCartesianCoordinate *) cartesianCoordinateJsonObjectToCartesianCoordinate:(NSDictionary *) jo;

// Dimensions

- (NSDictionary *) dimensionsToJsonObject:(SITDimensions *) dimensions;

// Bounds

- (NSDictionary *) boundsToJsonObject:(SITBounds) bounds;

// Angle

- (NSDictionary *) angleToJsonObject:(SITAngle *) angle;

// Route

- (NSDictionary *) routeToJsonObject:(SITRoute *) route;

//RouteStep

- (NSDictionary *) routeStepToJsonObject:(SITRouteStep *) routeStep;

- (SITRouteStep *) routeStepJsonObjectToRouteStep:(NSDictionary *) jo;

// Indication

- (NSDictionary *) indicationToJsonObject:(SITIndication *) indication;

- (SITIndication *) indicationJsonObjectToIndication:(NSDictionary *) jo;

// NavigationProgress

- (NSDictionary *) navigationProgressToJsonObject:(SITNavigationProgress *) navigationProgress;

@end

