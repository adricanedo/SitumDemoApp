/********* SitumIndoorNavigation.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <SitumSDK/SitumSDK.h>

@interface SitumIndoorNavigation : CDVPlugin {
  // Member variables go here.
}

- (void)coolMethod:(CDVInvokedUrlCommand*)command;
@end

@implementation SitumIndoorNavigation

- (void)fetchBuildings:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    // NSString* echo = [command.arguments objectAtIndex:0];

    // if (echo != nil && [echo length] > 0) {
    //     pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    // } else {
    //     pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    // }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)fetchFloorsForBuilding:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    
}

- (void)fetchIndoorPOIsFromBuilding:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    
}

- (void)startLocationUpdate:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    
}

- (void)getRoute:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    
}

- (void)startNaviagtion:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    
}

@end
