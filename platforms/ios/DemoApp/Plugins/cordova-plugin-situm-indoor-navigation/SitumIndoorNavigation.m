/********* SitumIndoorNavigation.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
//#import <SitumSDK/SitumSDK.h>
#import "CustomClasses.m"


@interface SitumIndoorNavigation : CDVPlugin<SITDirectionsDelegate, SITLocationDelegate, SITNavigationDelegate> {
  // Member variables go here.

    NSMutableDictionary *buildingsStored;
    NSMutableDictionary *floorStored;
    NSMutableDictionary *poisStored;
    NSMutableDictionary *routesStored;

    NSDictionary *selectedBuildingJO;
    
    NSString *locationCallbackId, *routeCallbackId, *navigationProgressCallbackId;
}

- (void)fetchBuildings:(CDVInvokedUrlCommand*)command;
- (void)fetchFloorsForBuilding:(CDVInvokedUrlCommand*)command;
- (void)fetchIndoorPOIsFromBuilding:(CDVInvokedUrlCommand*)command;
- (void)startLocationUpdate:(CDVInvokedUrlCommand*)command;
- (void)getRoute:(CDVInvokedUrlCommand*)command;
- (void)startNaviagtion:(CDVInvokedUrlCommand*)command;

@end

@implementation SitumIndoorNavigation


+ (void)load {
    [SITServices provideAPIKey:@"9ebe6ce727fad5052f1402b513d48be50c2c7936b562754306285fb99ec84816" forEmail:@"qaiyumohamed@gmail.com"];
}

- (void)fetchBuildings:(CDVInvokedUrlCommand*)command
{
    if (buildingsStored == nil) {
        buildingsStored = [[NSMutableDictionary alloc] init];
    }
    
    [[SITCommunicationManager sharedManager] fetchBuildingsWithOptions:nil success:^(NSDictionary *mapping) {
        NSArray *list = [mapping objectForKey:@"results"];
        NSMutableArray *ja = [[NSMutableArray alloc] init];
        for (SITBuilding *obj in list) {
            [ja addObject:[CustomClasses.shared buildingToJsonObject:obj]];
            [buildingsStored setObject:obj forKey:obj.identifier];
        }
        CDVPluginResult* pluginResult = nil;
        if (list.count == 0) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no buildings. Create one in the Dashboard"];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

    } failure:^(NSError *error) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
    }];

}

- (void)fetchFloorsForBuilding:(CDVInvokedUrlCommand*)command
{
    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
    
    if (floorStored == nil) {
        floorStored = [[NSMutableDictionary alloc] init];
    }
    
    [[SITCommunicationManager sharedManager] fetchFloorsForBuilding:[buildingJO valueForKey:@"identifier"] withOptions:nil success:^(NSDictionary *mapping) {
        NSArray *list = [mapping objectForKey:@"results"];
        NSMutableArray *ja = [[NSMutableArray alloc] init];
        for (SITFloor *obj in list) {
            [ja addObject:[CustomClasses.shared floorToJsonObject:obj]];
            [floorStored setObject:obj forKey:[NSString stringWithFormat:@"%ld", (long)obj.level]];
        }
        CDVPluginResult* pluginResult = nil;
        if (list.count == 0) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no floors. Create one in the Dashboard"];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } failure:^(NSError *error) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
    }];
}

- (void)fetchIndoorPOIsFromBuilding:(CDVInvokedUrlCommand*)command
{
    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
    
    if (poisStored == nil) {
        poisStored = [[NSMutableDictionary alloc] init];
    }

     [[SITCommunicationManager sharedManager] fetchPoisOfBuilding:[buildingJO valueForKey:@"identifier"]  withOptions:nil success:^(NSDictionary *mapping) {
         NSArray *list = [mapping objectForKey:@"results"];
         NSMutableArray *ja = [[NSMutableArray alloc] init];
         for (SITPOI *obj in list) {
             [ja addObject:[CustomClasses.shared poiToJsonObject:obj]];
             [poisStored setObject:obj forKey:obj.name];
         }
         CDVPluginResult* pluginResult = nil;
         if (list.count == 0) {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You have no poi. Create one in the Dashboard"];
         } else {
             pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:ja.copy];
         }
         [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
     } failure:^(NSError *error) {
         [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description] callbackId:command.callbackId];
     }];
}

- (void)startLocationUpdate:(CDVInvokedUrlCommand*)command
{
    NSDictionary* buildingJO = (NSDictionary*)[command.arguments objectAtIndex:0];
    locationCallbackId = command.callbackId;
    selectedBuildingJO = buildingJO;
    
    SITLocationRequest *locationRequest = [[SITLocationRequest alloc] initWithPriority:kSITHighAccuracy provider:kSITHybridProvider updateInterval:2 buildingID:[buildingJO valueForKey:@"identifier"] operationQueue:[NSOperationQueue mainQueue] options:nil];
    [[SITLocationManager sharedInstance] requestLocationUpdates:locationRequest];
    [[SITLocationManager sharedInstance] setDelegate:self];
}

- (void)getRoute:(CDVInvokedUrlCommand*)command
{
    
    routeCallbackId = command.callbackId;
    
    NSDictionary* fromLocation = (NSDictionary*)[command.arguments objectAtIndex:0];
    NSDictionary* toPOI = (NSDictionary*)[command.arguments objectAtIndex:1];
    
    if (routesStored == nil) {
        routesStored = [[NSMutableDictionary alloc] init];
    }

    
    SITLocation *location = [CustomClasses.shared locationJsonObjectToLocation:fromLocation];
    SITPOI *poi = (SITPOI*)[poisStored objectForKey:@"name"];
    SITPoint *endPoint;
    if (poi) {
        endPoint = poi.position;
    } else {
        endPoint = [CustomClasses.shared pointJsonObjectToPoint:[toPOI objectForKey:@"position"]];
    }
    
    SITDirectionsRequest *directionsRequest = [[SITDirectionsRequest alloc] initWithRequestID:0 location:location destination:endPoint options:nil];
    [[SITDirectionsManager sharedInstance] requestDirections:directionsRequest];
    [[SITDirectionsManager sharedInstance] setDelegate:self];
}

- (void)startNaviagtion:(CDVInvokedUrlCommand*)command
{
    navigationProgressCallbackId = command.callbackId;
    
    NSDictionary* route = (NSDictionary*)[command.arguments objectAtIndex:0];
    
    SITRoute *routeObj = (SITRoute*)[routesStored objectForKey:[route valueForKey:@"timeStamp"]];
    if (routeObj) {
        SITNavigationRequest *navigationRequest = [[SITNavigationRequest alloc] initWithRoute:routeObj];
        
        [[SITNavigationManager sharedManager] requestNavigationUpdates:navigationRequest];
        [[SITNavigationManager sharedManager]  setDelegate:self];
    }
}

- (void) updateWithLocation:(SITLocation *)location {
    [[SITNavigationManager sharedManager] updateWithLocation:location];
}

- (void) removeUpdates {
    [[SITNavigationManager sharedManager] removeUpdates];
}


// SITLocationDelegate methods

- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
      didUpdateLocation:(nonnull SITLocation *)location {
    if (location) {
        [self updateWithLocation:location];
        NSDictionary *locationJO = [CustomClasses.shared locationToJsonObject:location];
        NSMutableDictionary *locationChanged = [[NSMutableDictionary alloc] init];
        [locationChanged setValue:@"locationChanged" forKey:@"type"];
        [locationChanged setValue:locationJO.copy forKey:@"value"];
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:locationChanged.copy];
        pluginResult.keepCallback = [NSNumber numberWithBool:true];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
    }
}

- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
       didFailWithError:(nonnull NSError *)error {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
    pluginResult.keepCallback = [NSNumber numberWithBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
}

- (void)locationManager:(nonnull id<SITLocationInterface>)locationManager
         didUpdateState:(SITLocationState)state {
    NSMutableDictionary *locationChanged = [[NSMutableDictionary alloc] init];
    [locationChanged setValue:@"statusChanged" forKey:@"type"];
    [locationChanged setValue:[EnumManager.shared locationStateToString:state] forKey:@"value"];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:locationChanged.copy];
    pluginResult.keepCallback = [NSNumber numberWithBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:locationCallbackId];
}


// SITDirectionsDelegate

- (void)directionsManager:(id<SITDirectionsInterface>)manager
 didFailProcessingRequest:(SITDirectionsRequest *)request
                withError:(NSError *)error {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:routeCallbackId];
}

- (void)directionsManager:(id<SITDirectionsInterface>)manager
        didProcessRequest:(SITDirectionsRequest *)request
             withResponse:(SITRoute *)route {
    NSString * timestamp = [NSString stringWithFormat:@"%f",[[NSDate date] timeIntervalSince1970] * 1000];
    
    NSMutableDictionary *routeJO = [[CustomClasses.shared routeToJsonObject:route] mutableCopy];
    [routeJO setValue:timestamp forKey:@"timeStamp"];
    [routesStored setObject:route forKey:timestamp];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:routeJO.copy];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:routeCallbackId];
}

// SITNavigationDelegate


- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
         didFailWithError:(NSError *)error {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
    pluginResult.keepCallback = [NSNumber numberWithBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
}

- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
        didUpdateProgress:(SITNavigationProgress *)progress
                  onRoute:(SITRoute *)route {
    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
    [navigationJO setValue:@"progress" forKey:@"type"];
    [navigationJO setValue:[CustomClasses.shared navigationProgressToJsonObject:progress] forKey:@"value"];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:navigationJO.copy];
    pluginResult.keepCallback = [NSNumber numberWithBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
}

- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
destinationReachedOnRoute:(SITRoute *)route {
    [self removeUpdates];
    
    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
    [navigationJO setValue:@"destinationReached" forKey:@"type"];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:navigationJO.copy];
    pluginResult.keepCallback = [NSNumber numberWithBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
}


- (void)navigationManager:(id<SITNavigationInterface>)navigationManager
         userOutsideRoute:(SITRoute *)route {
    NSMutableDictionary *navigationJO = [[NSMutableDictionary alloc] init];
    [navigationJO setValue:@"userOutsideRoute" forKey:@"type"];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:navigationJO.copy];
    pluginResult.keepCallback = [NSNumber numberWithBool:true];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:navigationProgressCallbackId];
}
@end
