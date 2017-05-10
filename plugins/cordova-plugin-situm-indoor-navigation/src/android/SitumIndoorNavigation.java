package cordova.plugin.situm.indoor.navigation;


import android.os.Build;
import android.support.annotation.NonNull;
import android.util.Log;

import com.ionicframework.demoapp675353.MainActivity;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import es.situm.sdk.SitumSdk;
import es.situm.sdk.directions.DirectionsRequest;
import es.situm.sdk.error.Error;
import es.situm.sdk.location.LocationListener;
import es.situm.sdk.location.LocationRequest;
import es.situm.sdk.location.LocationStatus;
import es.situm.sdk.model.cartography.Building;
import es.situm.sdk.model.cartography.Floor;
import es.situm.sdk.model.cartography.Poi;
import es.situm.sdk.model.cartography.Point;
import es.situm.sdk.model.location.Angle;
import es.situm.sdk.model.location.Bounds;
import es.situm.sdk.model.location.CartesianCoordinate;
import es.situm.sdk.model.location.Coordinate;
import es.situm.sdk.model.location.Dimensions;
import es.situm.sdk.model.location.Location;
import es.situm.sdk.utils.Handler;

/**
 * This class echoes a string called from JavaScript.
 */
public class SitumIndoorNavigation extends CordovaPlugin {
    private static final String TAG = MainActivity.class.getSimpleName();

    // The building identifier where positioning will start.
    // You can see your buildings IDs and names running this example in the Logcat
    private static final String BUILDING_ID = "YOUR_BUILDING_ID";


    private HashMap<String, Building> buildingsList = new HashMap<String, Building>();
    private HashMap<String, Floor> floorsList = new HashMap<String, Floor>();
    private HashMap<String, Poi> poisList = new HashMap<String, Poi>();

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    @Override
    public void initialize(final CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        SitumSdk.init(cordova.getActivity().getApplicationContext());
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("fetchBuildings")) {
            this.fetchBuildings(callbackContext);
            return true;
        } else if (action.equals("fetchFloorsForBuilding")) {
            JSONObject building = args.getJSONObject(0);
            this.fetchFloorsForBuilding(building, callbackContext);
            return true;
        } else if (action.equals("fetchIndoorPOIsFromBuilding")) {
            JSONObject building = args.getJSONObject(0);
            this.fetchIndoorPOIsFromBuilding(building, callbackContext);
            return true;
        }
        return false;
    }

    private void fetchBuildings(CallbackContext callbackContext) {
        final CallbackContext cbc = callbackContext;

        //Get all the buildings of the account
        SitumSdk.communicationManager().fetchBuildings(new Handler<Collection<Building>>() {
            @Override
            public void onSuccess(Collection<Building> buildings) {
                Log.d(TAG, "onSuccess: Your buildings: ");

                JSONArray buildingsJA = new JSONArray();

                for (Building building : buildings) {
                    Log.i(TAG, "onSuccess: " + building.getIdentifier() + " - " + building.getName());

                    if (BUILDING_ID.equals(building.getIdentifier())) {
//                        selectedBuilding = building;
                    }

                    JSONObject bjo = new JSONObject();
                    try {
                        bjo.put("address", building.getAddress());
                        bjo.put("bounds", boundsToJsonObject(building.getBounds()));
                        bjo.put("bounds-rotated", boundsToJsonObject(building.getBoundsRotated()));
                        bjo.put("center", coordinateToJsonObject(building.getCenter()));
                        bjo.put("dimensions", dimensionsToJsonObject(building.getDimensions()));
                        bjo.put("info-html", building.getInfoHtml());
                        bjo.put("name", building.getName());
                        bjo.put("picture-thum-url", building.getPictureThumbUrl().toString());
                        bjo.put("picture-url", building.getPictureUrl().toString());
                        bjo.put("rotation", angleToJsonObject(building.getRotation()));
                        bjo.put("user-identifier", building.getUserIdentifier());
                        bjo.put("identifier", building.getIdentifier());

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    buildingsJA.put(bjo);

                    buildingsList.put(building.getIdentifier(), building);
                }

                if (buildings.isEmpty()) {
                    Log.e(TAG, "onSuccess: you have no buildings. Create one in the Dashboard");
                    cbc.error("you have no buildings. Create one in the Dashboard");
                } else {
                    cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, buildingsJA.toString()));
                }
            }

            @Override
            public void onFailure(Error error) {
                Log.e(TAG, "onFailure:" + error);
                cbc.error("Expected one non-empty string argument.");
            }

            DirectionsRequest dr = new DirectionsRequest.Builder().from()
        });
    }

    private void fetchFloorsForBuilding(JSONObject building, CallbackContext callbackContext) {
        final CallbackContext cbc = callbackContext;

        try {
            Building selectedBuilding = buildingsList.get(building.getString("identifier"));

            SitumSdk.communicationManager().fetchFloorsFromBuilding(selectedBuilding, new Handler<Collection<Floor>>() {
                @Override
                public void onSuccess(Collection<Floor> floors) {
                    JSONArray floorsJA = new JSONArray();

                    for (Floor floor : floors) {
                        Log.i(TAG, "onSuccess: " + floor.getIdentifier() + " - " + floor.getLevel());


                        JSONObject floorJO = new JSONObject();
                        try {
                            floorJO.put("altitude", floor.getAltitude());
                            floorJO.put("building-identifier", floor.getBuildingIdentifier());
                            floorJO.put("level", floor.getLevel());
                            floorJO.put("map-url", floor.getMapUrl());
                            floorJO.put("scale", floor.getScale());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        floorsJA.put(floorJO);

                        floorsList.put(String.valueOf(floor.getLevel()), floor);
                    }

                    if (floors.isEmpty()) {
                        Log.e(TAG, "onSuccess: you have no floors. Create one in the Dashboard");
                        cbc.error("you have no floors. Create one in the Dashboard");
                    } else {
                        cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, floorsJA.toString()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    cbc.error(error.toString());
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void fetchIndoorPOIsFromBuilding(JSONObject building, CallbackContext callbackContext) {
        final CallbackContext cbc = callbackContext;

        try {
            Building selectedBuilding = buildingsList.get(building.getString("identifier"));

            SitumSdk.communicationManager().fetchIndoorPOIsFromBuilding(selectedBuilding, new Handler<Collection<Poi>>() {
                @Override
                public void onSuccess(Collection<Poi> pois) {
                    JSONArray poisJA = new JSONArray();

                    for (Poi poi : pois) {
                        Log.i(TAG, "onSuccess: " + poi.getFloorIdentifier() + " - " + poi.getName());


                        JSONObject poiJO = new JSONObject();
                        try {
                            poiJO.put("identifier", poi.getIdentifier());
//                            poiJO.put("building-identifier", poi.getBuildingIdentifier());
//                            poiJO.put("level", poi.getLevel());
//                            poiJO.put("map-url", poi.getMapUrl());
//                            poiJO.put("scale", poi.getScale());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        poisJA.put(poiJO);

                        poisList.put(String.valueOf(poi.getName()), poi);
                    }

                    if (pois.isEmpty()) {
                        Log.e(TAG, "onSuccess: you have no floors. Create one in the Dashboard");
                        cbc.error("you have no floors. Create one in the Dashboard");
                    } else {
                        cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, poisJA.toString()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    cbc.error(error.toString());
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


  private void startLocationUpdate(CallbackContext callbackContext) {
    final CallbackContext cb = callbackContext;

    LocationRequest.Builder builder =  new LocationRequest.Builder();
    LocationListener locationListener = new LocationListener() {
      @Override
      public void onLocationChanged(@NonNull Location location) {
        JSONObject locationChanged = new JSONObject();
        JSONObject locationJO = new JSONObject();
        try {
          locationJO.put("accuracy", location.getAccuracy());
          locationJO.put("bearing", angleToJsonObject(location.getBearing()));
          locationJO.put("bearing-quality", location.getQuality().name());
          locationJO.put("building-identifier", location.getBuildingIdentifier());
          locationJO.put("cartesian-bearing", angleToJsonObject(location.getCartesianBearing()));
          locationJO.put("coordinate", coordinateToJsonObject(location.getCoordinate()));
          locationJO.put("floor-identifier", location.getFloorIdentifier());
          locationJO.put("position", pointToJsonObject(location.getPosition()));
          locationJO.put("provider", location.getProvider());
          locationJO.put("quality", location.getQuality().name());
          locationJO.put("has-bearing", location.hasBearing());
          locationJO.put("has-cartesian-bearing", location.hasCartesianBearing());
          locationJO.put("isindoor", location.isIndoor());
          locationJO.put("isoutdoor", location.isOutdoor());

          locationChanged.put("type", "location-changed");
          locationChanged.put("location", locationJO);
        } catch (JSONException e) {
          e.printStackTrace();
        }
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, locationChanged);
        pluginResult.setKeepCallback(true);
        cb.sendPluginResult(pluginResult);
      }

      @Override
      public void onStatusChanged(@NonNull LocationStatus locationStatus) {
        
      }

      @Override
      public void onError(@NonNull Error error) {
        cb.error(error.getMessage());
      }
    };
  }
    // Utility Methods

    private JSONObject coordinateToJsonObject(Coordinate coordinate) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("latitude", coordinate.getLatitude());
            jo.put("longitude", coordinate.getLongitude());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

  private JSONObject cartesianCoordinateToJsonObject(CartesianCoordinate cartesianCoordinate) {
    JSONObject jo = new JSONObject();
    try {
      jo.put("x", cartesianCoordinate.getX());
      jo.put("y", cartesianCoordinate.getY());
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return  jo;
  }

    private JSONObject dimensionsToJsonObject(Dimensions dimensions) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("width", dimensions.getWidth());
            jo.put("height", dimensions.getHeight());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    private JSONObject boundsToJsonObject(Bounds bounds) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("north-east", coordinateToJsonObject(bounds.getNorthEast()));
            jo.put("north-west", coordinateToJsonObject(bounds.getNorthWest()));
            jo.put("south-east", coordinateToJsonObject(bounds.getSouthEast()));
            jo.put("south-west", coordinateToJsonObject(bounds.getSouthWest()));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    private JSONObject angleToJsonObject(Angle angle) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("degrees", angle.degrees());
            jo.put("degreesClockwise", angle.degreesClockwise());
            jo.put("radians", angle.radians());
            jo.put("radiansMinusPiPi", angle.radiansMinusPiPi());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    private JSONObject pointToJsonObject(Point point) {
      JSONObject jo = new JSONObject();
      try {
        jo.put("building-identifier", point.getBuildingIdentifier());
        jo.put("cartesian-coordinate", cartesianCoordinateToJsonObject(point.getCartesianCoordinate()));
        jo.put("coordinate", coordinateToJsonObject(point.getCoordinate()));
        jo.put("floor-identifier", point.getFloorIdentifier());
        jo.put("isindoor", point.isIndoor());
        jo.put("isoutdoor", point.isOutdoor());
      } catch (JSONException e) {
        e.printStackTrace();
      }
      return  jo;
    }

}
