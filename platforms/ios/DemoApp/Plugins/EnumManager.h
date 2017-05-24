//
//  EnumManager.h
//  DemoApp
//
//  Created by ignisit on 5/24/17.
//
//

#import <SitumSDK/SitumSDK.h>

@interface EnumManager : NSObject {
    
    
    // Member variables go here.
}
+ (EnumManager *)shared ;

// orientationType
- (NSString*)orientationTypeToString:(kSITIndicationOrientation) orientation;
- (kSITIndicationOrientation)stringToOrientationType:(NSString*) orientation;

// indicationType
- (NSString*)indicationTypeToString:(kSITIndicationActions) action ;
- (kSITIndicationActions)stringToIndicationType:(NSString*) action ;

// locationState
- (NSString*)locationStateToString:(SITLocationState) state ;
- (SITLocationState)stringToLocationState:(NSString*) state ;

@end
