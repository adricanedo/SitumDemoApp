package cordova.plugin.situm.indoor.navigation;


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
import es.situm.sdk.location.LocationManager;
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
        } else if (action.equals("startLocationUpdate")) {
            JSONObject building = args.getJSONObject(0);
            if (building != null) {
                this.startLocationUpdate(building, callbackContext);
            }
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
                    JSONObject bjo = new JSONObject();
                    try {
                        bjo.put("address", building.getAddress());
                        bjo.put("bounds", boundsToJsonObject(building.getBounds()));
                        bjo.put("boundsRotated", boundsToJsonObject(building.getBoundsRotated()));
                        bjo.put("center", coordinateToJsonObject(building.getCenter()));
                        bjo.put("dimensions", dimensionsToJsonObject(building.getDimensions()));
                        bjo.put("infoHtml", building.getInfoHtml());
                        bjo.put("name", building.getName());
                        bjo.put("pictureThumbUrl", building.getPictureThumbUrl().toString());
                        bjo.put("pictureUrl", building.getPictureUrl().toString());
                        bjo.put("rotation", angleToJsonObject(building.getRotation()));
                        bjo.put("userIdentifier", building.getUserIdentifier());
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
                    cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, buildingsJA));
                }
            }

            @Override
            public void onFailure(Error error) {
                Log.e(TAG, "onFailure:" + error);
                cbc.error("Expected one non-empty string argument.");
            }
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
                            floorJO.put("buildingIdentifier", floor.getBuildingIdentifier());
                            floorJO.put("level", floor.getLevel());
                            floorJO.put("mapUrl", floor.getMapUrl());
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
                        cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, floorsJA));
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
                        JSONObject poiJO = new JSONObject();
                        try {
                            poiJO.put("buildingIdentifier", poi.getBuildingIdentifier());
                            poiJO.put("cartesianCoordinate", cartesianCoordinateToJsonObject(poi.getCartesianCoordinate()));
                            poiJO.put("coordinate", coordinateToJsonObject(poi.getCoordinate()));
                            poiJO.put("floorIdentifier", poi.getFloorIdentifier());
                            poiJO.put("name", poi.getName());
                            poiJO.put("position", pointToJsonObject(poi.getPosition()));
                            poiJO.put("isIndoor", poi.isIndoor());
                            poiJO.put("isOutdoor", poi.isOutdoor());
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
                        cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, poisJA));
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


  private void startLocationUpdate(JSONObject building, CallbackContext callbackContext) {
    final CallbackContext cb = callbackContext;

      Building selectedBuilding = null;
      try {
          selectedBuilding = buildingsList.get(building.get("identifier"));
      } catch (JSONException e) {
          e.printStackTrace();
      }

      if (selectedBuilding != null) {
          LocationRequest locationRequest = new LocationRequest.Builder()
                  .buildingIdentifier(selectedBuilding.getIdentifier())
                  .build();

          LocationListener locationListener = new LocationListener() {
              @Override
              public void onLocationChanged(Location location) {
                  JSONObject locationChanged = new JSONObject();
                  JSONObject locationJO = new JSONObject();
                  try {
                      locationJO.put("accuracy", location.getAccuracy());
                      locationJO.put("bearing", angleToJsonObject(location.getBearing()));
                      locationJO.put("bearingQuality", location.getBearingQuality().toString());
                      locationJO.put("buildingIdentifier", location.getBuildingIdentifier());
                      locationJO.put("cartesianBearing", angleToJsonObject(location.getCartesianBearing()));
                      locationJO.put("cartesianCoordinate", cartesianCoordinateToJsonObject(location.getCartesianCoordinate()));
                      locationJO.put("coordinate", coordinateToJsonObject(location.getCoordinate()));
                      locationJO.put("floorIdentifier", location.getFloorIdentifier());
                      locationJO.put("position", pointToJsonObject(location.getPosition()));
                      locationJO.put("provider", location.getProvider());
                      locationJO.put("quality", location.getQuality().toString());
                      locationJO.put("hasBearing", location.hasBearing());
                      locationJO.put("hasCartesianBearing", location.hasCartesianBearing());
                      locationJO.put("isIndoor", location.isIndoor());
                      locationJO.put("isOutdoor", location.isOutdoor());

                      locationChanged.put("type", "locationChanged");
                      locationChanged.put("value", locationJO);
                  } catch (JSONException e) {
                      e.printStackTrace();
                  }
                  PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, locationChanged);
                  pluginResult.setKeepCallback(true);
                  cb.sendPluginResult(pluginResult);
              }

              @Override
              public void onStatusChanged(LocationStatus locationStatus) {
                  JSONObject locationChanged = new JSONObject();
                  try {
                      locationChanged.put("type", "statusChanged");
                      locationChanged.put("value", locationStatus.toString());
                  } catch (JSONException e) {
                      e.printStackTrace();
                  }
                  PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, locationChanged);
                  pluginResult.setKeepCallback(true);
                  cb.sendPluginResult(pluginResult);
              }

              @Override
              public void onError(Error error) {
                  cb.error(error.getMessage());
              }
          };
          SitumSdk.locationManager().requestLocationUpdates(locationRequest, locationListener);
      } else {
          try {
              cb.error("Building with id="+building.get("identifier")+"not found");
          } catch (JSONException e) {
              e.printStackTrace();
          }
      }
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
            jo.put("northEast", coordinateToJsonObject(bounds.getNorthEast()));
            jo.put("northWest", coordinateToJsonObject(bounds.getNorthWest()));
            jo.put("southEast", coordinateToJsonObject(bounds.getSouthEast()));
            jo.put("southWest", coordinateToJsonObject(bounds.getSouthWest()));
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
        jo.put("buildingIdentifier", point.getBuildingIdentifier());
        jo.put("cartesianCoordinate", cartesianCoordinateToJsonObject(point.getCartesianCoordinate()));
        jo.put("coordinate", coordinateToJsonObject(point.getCoordinate()));
        jo.put("floorIdentifier", point.getFloorIdentifier());
        jo.put("isIndoor", point.isIndoor());
        jo.put("isOutdoor", point.isOutdoor());
      } catch (JSONException e) {
        e.printStackTrace();
      }
      return  jo;
    }

}
