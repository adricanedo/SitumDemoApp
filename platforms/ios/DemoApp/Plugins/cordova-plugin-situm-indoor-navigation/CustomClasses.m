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


@implementation CustomClasses

//Building

- (NSDictionary *) buildingToJsonObject:(SITBuilding *) building {
    
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:building.address forKey:@"address"];
    [jo setObject:[self boundsToJsonObject:building.bounds] forKey:@"bounds"];
    [jo setObject:[self boundsToJsonObject:building.rotatedBounds] forKey:@"boundsRotated"];
    [jo setObject:[self coordinateToJsonObject:building.center] forKey:@"center"];
    [jo setObject:[self dimensionsToJsonObject:building.dimensions] forKey:@"dimensions"];
    [jo setObject:building.infoHTML forKey:@"infoHtml"];
    [jo setObject:building.name forKey:@"name"];
    [jo setObject:building.pictureThumbURL.direction forKey:@"pictureThumbUrl"];
    [jo setObject:building.pictureURL.direction forKey:@"pictureUrl"];
    [jo setObject:[self angleToJsonObject:building.rotation] forKey:@"rotation"];
    [jo setObject:building.userIdentifier forKey:@"userIdentifier"];
    [jo setObject:building.identifier forKey:@"identifier"];
    
    return jo.copy;
}

//Floor

- (NSDictionary *) floorToJsonObject:(SITFloor *) floor {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:floor.altitude] forKey:@"altitude"];
    [jo setObject:floor.buildingIdentifier forKey:@"buildingIdentifier"];
    [jo setObject:[NSNumber numberWithInteger:floor.level] forKey:@"level"];
    [jo setObject:floor.mapURL.direction forKey:@"mapUrl"];
    [jo setObject:[NSNumber numberWithDouble:floor.scale] forKey:@"scale"];
    return jo.copy;
}

// POI

- (NSDictionary *) poiToJsonObject:(SITPOI *) poi {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:poi.buildingIdentifier forKey:@"buildingIdentifier"];
    [jo setObject:[self cartesianCoordinateToJsonObject:poi.position.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:poi.position.coordinate] forKey:@"coordinate"];
    [jo setObject:poi.position.floorIdentifier forKey:@"floorIdentifier"];
    [jo setObject:poi.name forKey:@"name"];
    [jo setObject:[self pointToJsonObject:poi.position] forKey:@"position"];
    [jo setObject:[NSNumber numberWithBool:poi.position.isIndoor] forKey:@"isIndoor"];
    [jo setObject:[NSNumber numberWithBool:poi.position.isOutdoor] forKey:@"isOutdoor"];
    return jo.copy;
}

// Location

- (NSDictionary *) locationToJsonObject:(SITLocation *) location {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithFloat:location.accuracy] forKey:@"accuracy"];
    [jo setObject:[self angleToJsonObject:location.bearing] forKey:@"bearing"];
    [jo setObject:location.position.buildingIdentifier forKey:@"buildingIdentifier"];
    [jo setObject:[self angleToJsonObject:location.cartesianBearing] forKey:@"cartesianBearing"];
    [jo setObject:[self cartesianCoordinateToJsonObject:location.position.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:location.position.coordinate] forKey:@"coordinate"];
    [jo setObject:location.position.floorIdentifier forKey:@"floorIdentifier"];
    [jo setObject:[self pointToJsonObject:location.position] forKey:@"position"];
    [jo setObject:location.provider forKey:@"provider"];
    [jo setObject:[NSNumber numberWithInteger:location.quality] forKey:@"quality"];
    [jo setObject:[NSNumber numberWithDouble:location.timestamp] forKey:@"timestamp"];
    [jo setObject:[NSNumber numberWithBool:location.position.isIndoor] forKey:@"isIndoor"];
    [jo setObject:[NSNumber numberWithBool:location.position.isOutdoor] forKey:@"isOutdoor"];
    return jo.copy;
}

- (SITLocation *) locationJsonObjectToLocation:(NSDictionary *) jo {
    NSTimeInterval timestamp = [(NSNumber*)[jo valueForKey:@"timestamp"] doubleValue];
    SITPoint *position = [self pointJsonObjectToPoint:[jo objectForKey:@"position"]];
    float bearing = [(NSNumber*)[jo objectForKey:@"bearing"] floatValue];
    float cartesianBearing = [(NSNumber*)[jo objectForKey:@"cartesianBearing"] floatValue];
    kSITQualityValues quality = kSITHigh;
    if ([(NSNumber*)[jo objectForKey:@"cartesianBearing"] integerValue] == 0) {
        quality = kSITLow;
    }
    float accuracy = [(NSNumber*)[jo objectForKey:@"accuracy"] floatValue];
    
    SITLocation *location = [[SITLocation alloc] initWithTimestamp:timestamp position:position bearing:bearing cartesianBearing:cartesianBearing quality:quality accuracy:accuracy provider:[jo objectForKey:@"provider"]];
    return location;
}

 // Coordinate

- (NSDictionary *) coordinateToJsonObject:(CLLocationCoordinate2D) coordinate {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:coordinate.latitude] forKey:@"latitude"];
    [jo setObject:[NSNumber numberWithDouble:coordinate.longitude] forKey:@"longitude"];
    return jo.copy;
}

- (CLLocationCoordinate2D) coordinateJsonObjectToCoordinate:(NSDictionary *) jo {
    CLLocationDegrees latitude = [(NSNumber*)[jo objectForKey:@"latitude"] doubleValue];
    CLLocationDegrees longitude = [(NSNumber*)[jo objectForKey:@"longitude"] doubleValue];

    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitude, longitude);
    return coordinate;
}


// Point

- (NSDictionary *) pointToJsonObject:(SITPoint *) point {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:point.buildingIdentifier forKey:@"buildingIdentifier"];
    [jo setObject:[self cartesianCoordinateToJsonObject:point.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:point.coordinate] forKey:@"coordinate"];
    [jo setObject:point.floorIdentifier forKey:@"floorIdentifier"];
    [jo setObject:[NSNumber numberWithDouble:point.isIndoor] forKey:@"isIndoor"];
    [jo setObject:[NSNumber numberWithDouble:point.isOutdoor] forKey:@"isOutdoor"];
    return jo.copy;

}

- (SITPoint *) pointJsonObjectToPoint:(NSDictionary *) jo {
    SITPoint *point = [[SITPoint alloc] initWithCoordinate:[self coordinateJsonObjectToCoordinate:[jo objectForKey:@"coordinate"]] buildingIdentifier:[jo valueForKey:@"buildingIdentifier"] floorIdentifier:[jo valueForKey:@"floorIdentifier"] cartesianCoordinate:[self cartesianCoordinateJsonObjectToCartesianCoordinate:[jo objectForKey:@"cartesianCoordinate"]]];
    return point;
}

// CartesianCoordinate

- (NSDictionary *) cartesianCoordinateToJsonObject:(SITCartesianCoordinate *) cartesianCoordinate {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:cartesianCoordinate.x] forKey:@"x"];
    [jo setObject:[NSNumber numberWithDouble:cartesianCoordinate.y] forKey:@"y"];
    return jo.copy;

}

- (SITCartesianCoordinate *) cartesianCoordinateJsonObjectToCartesianCoordinate:(NSDictionary *) jo {
    SITCartesianCoordinate *cartesianCoordinate = [[SITCartesianCoordinate alloc] initWithX:[[jo valueForKey:@"x"] doubleValue] y:[[jo valueForKey:@"y"] doubleValue]];
    return cartesianCoordinate;
}

// Dimensions

- (NSDictionary *) dimensionsToJsonObject:(SITDimensions *) dimensions {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:dimensions.width] forKey:@"width"];
    [jo setObject:[NSNumber numberWithDouble:dimensions.height] forKey:@"height"];
    return jo.copy;

}

 // Bounds

- (NSDictionary *) boundsToJsonObject:(SITBounds) bounds {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[self coordinateToJsonObject:bounds.northEast] forKey:@"northEast"];
    [jo setObject:[self coordinateToJsonObject:bounds.northWest] forKey:@"northWest"];
    [jo setObject:[self coordinateToJsonObject:bounds.southEast] forKey:@"southEast"];
    [jo setObject:[self coordinateToJsonObject:bounds.southWest] forKey:@"southWest"];
    return jo.copy;
}

// Angle

- (NSDictionary *) angleToJsonObject:(SITAngle *) angle {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:angle.degrees] forKey:@"degrees"];
    [jo setObject:[NSNumber numberWithDouble:angle.radians] forKey:@"radians"];
    return jo.copy;
}

// Route

- (NSDictionary *) routeToJsonObject:(SITRoute *) route {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    
    NSMutableArray *stepsJsonArray = [[NSMutableArray alloc] init];
    for (SITRouteStep *routeStep in route.routeSteps) {
        [stepsJsonArray addObject:[self routeStepToJsonObject:routeStep]];
    }
    NSMutableArray *indicationsJsonArray = [[NSMutableArray alloc] init];
    for (SITIndication *indication in route.indications) {
        [indicationsJsonArray addObject:[self indicationToJsonObject:indication]];
    }
    
    [jo setObject:[NSNumber numberWithDouble:coordinate.latitude] forKey:@"latitude"];
    [jo setObject:[NSNumber numberWithDouble:coordinate.longitude] forKey:@"longitude"];
    return jo.copy;

}

//RouteStep

- (NSDictionary *) routeStepToJsonObject:(SITRouteStep *) routeStep {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:coordinate.latitude] forKey:@"latitude"];
    [jo setObject:[NSNumber numberWithDouble:coordinate.longitude] forKey:@"longitude"];
    return jo.copy;

}

- (SITRouteStep *) routeStepJsonObjectToRouteStep:(NSDictionary *) jo {

}

// Indication

- (NSDictionary *) indicationToJsonObject:(SITIndication *) indication {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:coordinate.latitude] forKey:@"latitude"];
    [jo setObject:[NSNumber numberWithDouble:coordinate.longitude] forKey:@"longitude"];
    return jo.copy;

}

- (SITIndication *) indicationJsonObjectToIndication:(NSDictionary *) jo {

}

// NavigationProgress

- (NSDictionary *) navigationProgressToJsonObject:(SITNavigationProgress *) navigationProgress {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:coordinate.latitude] forKey:@"latitude"];
    [jo setObject:[NSNumber numberWithDouble:coordinate.longitude] forKey:@"longitude"];
    return jo.copy;

}
@end
