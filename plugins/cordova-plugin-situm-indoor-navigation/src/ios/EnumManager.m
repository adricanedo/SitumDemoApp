//
//  EnumManager.m
//  DemoApp
//
//  Created by ignisit on 5/23/17.
//
//

#import <Foundation/Foundation.h>
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

static EnumManager *enumManagerSharedObj;

@implementation EnumManager

+ (EnumManager *)shared {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        enumManagerSharedObj = [[EnumManager alloc] init];
    });
    return enumManagerSharedObj;
}

// orientationType

- (NSString*)orientationTypeToString:(kSITIndicationOrientation) orientation {
    NSString *type = @"";
    switch (orientation) {
        case kSITInvalidOrientation:
            type = @"Invalid";
            break;
        case kSITStraight:
            type = @"Straight";
            break;
        case kSITVeerRight:
            type = @"VeerRight";
            break;
        case kSITRight:
            type = @"Right";
            break;
        case kSITSharpRight:
            type = @"SharpRight";
            break;
        case kSITVeerLeft:
            type = @"VeerLeft";
            break;
        case kSITLeft:
            type = @"Left";
            break;
        case kSITSharpLeft:
            type = @"SharpLeft";
            break;
        case kSITBackward:
            type = @"Backward";
            break;
            
        default:
            break;
    }
    return type;
}

- (kSITIndicationOrientation)stringToOrientationType:(NSString*) orientation {
    kSITIndicationOrientation type = kSITInvalidOrientation;    
    if ([orientation isEqualToString:@"Invalid"]) {
        type = kSITInvalidOrientation;
    } else if ([orientation isEqualToString:@"Straight"]) {
        type = kSITStraight;
    } else if ([orientation isEqualToString:@"VeerRight"]) {
        type = kSITVeerRight;
    } else if ([orientation isEqualToString:@"Right"]) {
        type = kSITRight;
    } else if ([orientation isEqualToString:@"SharpRight"]) {
        type = kSITSharpRight;
    } else if ([orientation isEqualToString:@"VeerLeft"]) {
        type = kSITVeerLeft;
    } else if ([orientation isEqualToString:@"Left"]) {
        type = kSITLeft;
    } else if ([orientation isEqualToString:@"SharpLeft"]) {
        type = kSITSharpLeft;
    } else if ([orientation isEqualToString:@"Backward"]) {
        type = kSITBackward;
    }
    return type;
}

// indicationType

- (NSString*)indicationTypeToString:(kSITIndicationActions) action {
    NSString *type = @"";
    switch (action) {
        case kSITInvalidAction:
            type = @"Invalid";
            break;
        case kSITTurn:
            type = @"Turn";
            break;
        case kSITGoAhead:
            type = @"GoAhead";
            break;
        case kSITChangeFloor:
            type = @"ChangeFloor";
            break;
        case kSITEnd:
            type = @"End";
            break;
       
            
        default:
            break;
    }
    return type;
}

- (kSITIndicationActions)stringToIndicationType:(NSString*) action {
    kSITIndicationActions type = kSITInvalidAction;
    if ([action isEqualToString:@"Invalid"]) {
        type = kSITInvalidAction;
    } else if ([action isEqualToString:@"Turn"]) {
        type = kSITTurn;
    } else if ([action isEqualToString:@"GoAhead"]) {
        type = kSITGoAhead;
    } else if ([action isEqualToString:@"ChangeFloor"]) {
        type = kSITChangeFloor;
    } else if ([action isEqualToString:@"End"]) {
        type = kSITEnd;
    }
    return type;
}

// locationState


- (NSString*)locationStateToString:(SITLocationState) state {
    NSString *type = @"";
    switch (state) {
        case kSITLocationStopped:
            type = @"STOPPED";
            break;
        case kSITLocationCalculating:
            type = @"CALCULATING";
            break;
        case kSITLocationUserNotInBuilding:
            type = @"USER_NOT_IN_BUILDING";
            break;
        case kSITLocationStarted:
            type = @"STARTING";
            break;       
            
        default:
            break;
    }
    return type;
}

- (SITLocationState)stringToLocationState:(NSString*) state{
    SITLocationState type = kSITLocationStopped;
    if ([state isEqualToString:@"STOPPED"]) {
        type = kSITLocationStopped;
    } else if ([state isEqualToString:@"CALCULATING"]) {
        type = kSITLocationCalculating;
    } else if ([state isEqualToString:@"USER_NOT_IN_BUILDING"]) {
        type = kSITLocationUserNotInBuilding;
    } else if ([state isEqualToString:@"STARTING"]) {
        type = kSITLocationStarted;
    } 
    return type;
}
@end
