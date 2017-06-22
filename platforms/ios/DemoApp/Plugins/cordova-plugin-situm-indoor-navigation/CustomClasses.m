//
//  CustomClasses.m
//  DemoApp
//
//  Created by ignisit on 5/19/17.
//
//


#import "CustomClasses.h"
#import "EnumManager.h"

NSString* emptyStrCheck(NSString *str) {
    if (!str || str == nil) {
        return @"";
    }
    return str;
}

static CustomClasses *customClassesSharedObj;

@implementation CustomClasses

+ (CustomClasses *)shared {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        customClassesSharedObj = [[CustomClasses alloc] init];
    });
    return customClassesSharedObj;
}

//Building

- (NSDictionary *) buildingToJsonObject:(SITIndoorBuilding *) building {
    
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:emptyStrCheck(building.address) forKey:@"address"];
    [jo setObject:[self boundsToJsonObject:building.bounds] forKey:@"bounds"];
    [jo setObject:[self boundsToJsonObject:building.boundsRotated] forKey:@"boundsRotated"];
    [jo setObject:[self coordinateToJsonObject:building.coordinate] forKey:@"center"];
//    [jo setObject:[self dimensionsToJsonObject:building.dimensions] forKey:@"dimensions"];
    [jo setObject:emptyStrCheck(building.name) forKey:@"name"];
    [jo setObject:emptyStrCheck(building.picture_thumb_url) forKey:@"pictureThumbUrl"];
    [jo setObject:emptyStrCheck(building.picture_url) forKey:@"pictureUrl"];
    [jo setObject:building.rotation forKey:@"rotation"];
    [jo setObject:emptyStrCheck(building.user_identifier) forKey:@"userIdentifier"];
    [jo setObject:emptyStrCheck([NSString stringWithFormat:@"%@", building.identifier]) forKey:@"identifier"];
    
    return jo.copy;
}

//Floor

- (NSDictionary *) floorToJsonObject:(SITIndoorLevel *) floor {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
//    [jo setObject:[NSNumber numberWithDouble:floor.altitude] forKey:@"altitude"];
    [jo setObject:emptyStrCheck([NSString stringWithFormat:@"%@", floor.project_identifier]) forKey:@"buildingIdentifier"];
    [jo setObject:floor.level forKey:@"level"];
    [jo setObject:floor.map_url forKey:@"mapUrl"];
    [jo setObject:floor.scale forKey:@"scale"];
    [jo setObject:[NSString stringWithFormat:@"%@", floor.identifier] forKey:@"identifier"];
    return jo.copy;
}

// POI

- (NSDictionary *) poiToJsonObject:(SITPOI *) poi {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:emptyStrCheck(poi.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:[self cartesianCoordinateToJsonObject:poi.position.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:poi.position.coordinate] forKey:@"coordinate"];
    [jo setObject:emptyStrCheck(poi.position.floorIdentifier) forKey:@"floorIdentifier"];
    [jo setObject:emptyStrCheck(poi.name) forKey:@"name"];
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
    [jo setObject:emptyStrCheck(location.position.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:[self angleToJsonObject:location.cartesianBearing] forKey:@"cartesianBearing"];
    [jo setObject:[self cartesianCoordinateToJsonObject:location.position.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:location.position.coordinate] forKey:@"coordinate"];
    [jo setObject:emptyStrCheck(location.position.floorIdentifier) forKey:@"floorIdentifier"];
    [jo setObject:[self pointToJsonObject:location.position] forKey:@"position"];
    [jo setObject:emptyStrCheck(location.provider) forKey:@"provider"];
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
    [jo setObject:emptyStrCheck(point.buildingIdentifier) forKey:@"buildingIdentifier"];
    [jo setObject:[self cartesianCoordinateToJsonObject:point.cartesianCoordinate] forKey:@"cartesianCoordinate"];
    [jo setObject:[self coordinateToJsonObject:point.coordinate] forKey:@"coordinate"];
    [jo setObject:emptyStrCheck(point.floorIdentifier) forKey:@"floorIdentifier"];
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
    
    NSMutableArray *pointsJsonArray = [[NSMutableArray alloc] init];
    NSMutableArray *stepsJsonArray = [[NSMutableArray alloc] init];
    for (SITRouteStep *routeStep in route.routeSteps) {
        [stepsJsonArray addObject:[self routeStepToJsonObject:routeStep]];
        [pointsJsonArray addObject:[self pointToJsonObject:routeStep.to]];
    }
    [pointsJsonArray addObject:[self pointToJsonObject:route.destination]];
    
    NSMutableArray *indicationsJsonArray = [[NSMutableArray alloc] init];
    for (SITIndication *indication in route.indications) {
        [indicationsJsonArray addObject:[self indicationToJsonObject:indication]];
    }
    
    [jo setObject:stepsJsonArray.copy forKey:@"edges"];
    [jo setObject:stepsJsonArray.firstObject forKey:@"firstStep"];
    [jo setObject:[self pointToJsonObject:route.origin] forKey:@"from"];
    [jo setObject:indicationsJsonArray forKey:@"indications"];
    [jo setObject:stepsJsonArray.lastObject forKey:@"lastStep"];
    [jo setObject:pointsJsonArray forKey:@"nodes"];
    [jo setObject:pointsJsonArray forKey:@"points"];
    [jo setObject:[self pointToJsonObject:route.destination] forKey:@"to"];
    [jo setObject:stepsJsonArray.copy forKey:@"steps"];
    return jo.copy;

}

//RouteStep

- (NSDictionary *) routeStepToJsonObject:(SITRouteStep *) routeStep {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:routeStep.stepDistance] forKey:@"distance"];
    [jo setObject:[NSNumber numberWithDouble:routeStep.distanceToGoal] forKey:@"distanceToGoal"];
    [jo setObject:[self pointToJsonObject:routeStep.from] forKey:@"from"];
    [jo setObject:[NSNumber numberWithInteger:routeStep.nextStepIndex] forKey:@"nextStepIndex"];
    [jo setObject:[self pointToJsonObject:routeStep.from] forKey:@"to"];
    [jo setObject:[NSNumber numberWithInteger:routeStep.index] forKey:@"id"];
    [jo setObject:[NSNumber numberWithBool:routeStep.isFirst] forKey:@"isFirst"];
    [jo setObject:[NSNumber numberWithBool:routeStep.isLast] forKey:@"isLast"];
    return jo.copy;
}

- (SITRouteStep *) routeStepJsonObjectToRouteStep:(NSDictionary *) jo {
    SITPoint *fromPoint = (SITPoint*)[jo objectForKey:@"from"];
    SITPoint *toPoint = (SITPoint*)[jo objectForKey:@"to"];
    
    SITRouteStep *routeStep = [[SITRouteStep alloc] initWithIndex:[(NSNumber*)[jo valueForKey:@"id"] integerValue] from:fromPoint to:toPoint isFirst:[(NSNumber*)[jo valueForKey:@"isFirst"] boolValue] isLast:[(NSNumber*)[jo valueForKey:@"isLast"] boolValue] nextStepIndex:[(NSNumber*)[jo valueForKey:@"nextStepIndex"] integerValue] stepDistance:[(NSNumber*)[jo valueForKey:@"distance"] doubleValue] distanceToGoal:[(NSNumber*)[jo valueForKey:@"distanceToGoal"] doubleValue]];
    
    return routeStep;
}

// Indication

- (NSDictionary *) indicationToJsonObject:(SITIndication *) indication {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[NSNumber numberWithDouble:indication.horizontalDistance] forKey:@"distance"];
    [jo setObject:[NSNumber numberWithFloat:indication.verticalDistance] forKey:@"distanceToNextLevel"];
    [jo setObject:[EnumManager.shared indicationTypeToString:indication.action] forKey:@"indicationType"];
    [jo setObject:[NSNumber numberWithFloat:indication.orientationChange] forKey:@"orientation"];
    [jo setObject:[EnumManager.shared orientationTypeToString:indication.orientation] forKey:@"orientationType"];
    [jo setObject:[NSNumber numberWithInteger:indication.destinationStepIndex] forKey:@"stepIdxDestination"];
    [jo setObject:[NSNumber numberWithInteger:indication.originStepIndex] forKey:@"stepIdxOrigin"];
    [jo setObject:[NSNumber numberWithBool:indication.needLevelChange] forKey:@"neededLevelChange"];
    return jo.copy;
}

- (SITIndication *) indicationJsonObjectToIndication:(NSDictionary *) jo {
    NSInteger stepIdxOrigin = [(NSNumber*)[jo valueForKey:@"stepIdxOrigin"] integerValue];
    NSInteger stepIdxDestination = [(NSNumber*)[jo valueForKey:@"stepIdxDestination"] integerValue];
    float horizontalDistance = [(NSNumber*)[jo valueForKey:@"distance"] floatValue];
    float orientationChange = [(NSNumber*)[jo valueForKey:@"orientation"] floatValue];
    float verticalDistance = [(NSNumber*)[jo valueForKey:@"distanceToNextLevel"] floatValue];
    kSITIndicationActions action = [EnumManager.shared stringToIndicationType:[jo valueForKey:@"indicationType"]];
    kSITIndicationOrientation orientation = [EnumManager.shared stringToOrientationType:[jo valueForKey:@"orientationType"]];
    
    SITIndication *indication = [[SITIndication alloc] initWithOriginStepIndex:stepIdxOrigin destinationStepIndex:stepIdxDestination action:action horizontalDistance:horizontalDistance orientation:orientation orientationChange:orientationChange verticalDistance:verticalDistance];
    
    return indication;
}

// NavigationProgress

- (NSDictionary *) navigationProgressToJsonObject:(SITNavigationProgress *) navigationProgress {
    NSMutableDictionary *jo  = [[NSMutableDictionary alloc] init];
    [jo setObject:[self pointToJsonObject:navigationProgress.closestPointToRoute] forKey:@"closestPointInRoute"];
    [jo setObject:[self indicationToJsonObject:navigationProgress.currentIndication] forKey:@"currentIndication"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.distanceToGoal] forKey:@"distanceToEndStep"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.distanceToEndStep] forKey:@"distanceToGoal"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.timeToEndStep] forKey:@"timeToEndStep"];
    [jo setObject:[NSNumber numberWithFloat:navigationProgress.timeToGoal] forKey:@"timeToGoal"];
    return jo.copy;
}
    
// check nil string

@end


