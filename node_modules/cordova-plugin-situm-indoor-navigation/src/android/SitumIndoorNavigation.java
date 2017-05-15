package cordova.plugin.situm.indoor.navigation;


import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.ionicframework.demoapp675353.MainActivity;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PermissionHelper;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
import es.situm.sdk.model.directions.Route;
import es.situm.sdk.model.location.Location;
import es.situm.sdk.model.navigation.NavigationProgress;
import es.situm.sdk.navigation.NavigationListener;
import es.situm.sdk.navigation.NavigationRequest;
import es.situm.sdk.utils.Handler;

/**
 * This class echoes a string called from JavaScript.
 */
public class SitumIndoorNavigation extends CordovaPlugin {
  private static final String TAG = MainActivity.class.getSimpleName();
  private static final int LOCATION_PERMISSION_RESULT = 763;
  // The building identifier where positioning will start.
  // You can see your buildings IDs and names running this example in the Logcat
  private HashMap<String, Building> buildingsStored = new HashMap<String, Building>();
  private HashMap<String, Floor> floorsStored = new HashMap<String, Floor>();
  private HashMap<String, Poi> poisStored = new HashMap<String, Poi>();

  private CustomClasses customClasses = new CustomClasses();

  private HashMap<String, Route> routesStored = new HashMap<String, Route>();

  JSONObject selectedBuildingJO;
  CallbackContext locationCallback;


  private String currentTimeStamp() {
    Long tsLong = System.currentTimeMillis() / 1000;
    String ts = tsLong.toString();
    return ts;
  }

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
    } else if (action.equals("getRoute")) {
      JSONObject fromLocation = args.getJSONObject(0);
      JSONObject toPoi = args.getJSONObject(1);
      if (fromLocation != null && toPoi != null) {
        this.getRoute(fromLocation, toPoi, callbackContext);
      }
      return true;
    } else if (action.equals("startNaviagtion")) {
      JSONObject route = args.getJSONObject(0);
      if (route != null) {
        this.startNavigation(route, callbackContext);
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
          JSONObject bjo = customClasses.buildingToJsonObject(building);
          buildingsJA.put(bjo);
          buildingsStored.put(building.getIdentifier(), building);
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
      Building selectedBuilding = buildingsStored.get(building.getString("identifier"));

      SitumSdk.communicationManager().fetchFloorsFromBuilding(selectedBuilding, new Handler<Collection<Floor>>() {
        @Override
        public void onSuccess(Collection<Floor> floors) {
          JSONArray floorsJA = new JSONArray();

          for (Floor floor : floors) {
            Log.i(TAG, "onSuccess: " + floor.getIdentifier() + " - " + floor.getLevel());
            JSONObject floorJO = customClasses.floorToJsonObject(floor);
            floorsJA.put(floorJO);
            floorsStored.put(String.valueOf(floor.getLevel()), floor);
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
      Building selectedBuilding = buildingsStored.get(building.getString("identifier"));

      SitumSdk.communicationManager().fetchIndoorPOIsFromBuilding(selectedBuilding, new Handler<Collection<Poi>>() {
        @Override
        public void onSuccess(Collection<Poi> pois) {
          JSONArray poisJA = new JSONArray();

          for (Poi poi : pois) {
            JSONObject poiJO = customClasses.poiToJsonObject(poi);
            poisJA.put(poiJO);
            poisStored.put(poi.getName(), poi);
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

  public void onRequestPermissionResult(int requestCode, String[] permissions,
                                        int[] grantResults) throws JSONException
  {
    if (requestCode == LOCATION_PERMISSION_RESULT) {
      locationUpdate();
    }
  }

  private void startLocationUpdate(JSONObject building, CallbackContext callbackContext) {
    locationCallback = callbackContext;
    selectedBuildingJO = building;

    int permissionCheck = ContextCompat.checkSelfPermission(cordova.getActivity().getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION);

    if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
      locationUpdate();
    } else {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        PermissionHelper.requestPermissions(this,LOCATION_PERMISSION_RESULT, new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
          Manifest.permission.ACCESS_COARSE_LOCATION});
      }
    }
  }

  private void locationUpdate() {
    Building selectedBuilding = null;
    try {
      selectedBuilding = buildingsStored.get(selectedBuildingJO.get("identifier"));
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
          updateWithLocation(location);

          JSONObject locationJO = customClasses.locationToJsonObject(location);
          JSONObject locationChanged = new JSONObject();
          try {
            locationChanged.put("type", "locationChanged");
            locationChanged.put("value", locationJO);
          } catch (JSONException e) {
            e.printStackTrace();
          }
          PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, locationChanged);
          pluginResult.setKeepCallback(true);
          locationCallback.sendPluginResult(pluginResult);
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
          locationCallback.sendPluginResult(pluginResult);
        }

        @Override
        public void onError(Error error) {
          PluginResult pluginResult = new PluginResult(PluginResult.Status.ERROR, error.getMessage());
          pluginResult.setKeepCallback(true);
          locationCallback.sendPluginResult(pluginResult);
        }
      };
      SitumSdk.locationManager().requestLocationUpdates(locationRequest, locationListener);
    } else {
      try {
        locationCallback.error("Building with id=" + selectedBuildingJO.get("identifier") + "not found");
      } catch (JSONException e) {
        e.printStackTrace();
      }
    }
  }

  private void getRoute(JSONObject fromLocation, JSONObject toPOI, CallbackContext callbackContext) {
    final CallbackContext cb = callbackContext;

    try {
      final Location location = customClasses.locationJsonObjectToLocation(fromLocation);
      Poi poi = poisStored.get(toPOI.getString("name"));
      Point endPoint;
      if (poi != null) {
        endPoint = poi.getPosition();
      } else {
        endPoint = customClasses.pointJsonObjectToPoint(toPOI.getJSONObject("position"));
      }

      DirectionsRequest directionsRequest = new DirectionsRequest.Builder().from(location).to(endPoint).build();

      SitumSdk.directionsManager().requestDirections(directionsRequest, new Handler<Route>() {
        @Override
        public void onSuccess(Route route) {
          JSONObject routeJO = customClasses.routeToJsonObject(route);
          try {
            routeJO.put("timeStamp", currentTimeStamp());
          } catch (JSONException e) {
            e.printStackTrace();
          }
          PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, routeJO);
          cb.sendPluginResult(pluginResult);
          routesStored.put(currentTimeStamp(), route);
        }

        @Override
        public void onFailure(Error error) {
          cb.error("Error while calculating route " + error.getMessage());
        }
      });
    } catch (JSONException e) {
      cb.error("Error while calculating route " + e.getMessage());
      e.printStackTrace();
    }

  }

  private void startNavigation(JSONObject route, CallbackContext callbackContext) {
    final CallbackContext cb = callbackContext;

    try {
      Route routeObj = routesStored.get(route.getString("timeStamp"));
      if (routeObj != null) {
        NavigationRequest navigationRequest = new NavigationRequest.Builder().route(routeObj).build();
        SitumSdk.navigationManager().requestNavigationUpdates(navigationRequest, new NavigationListener() {
          @Override
          public void onDestinationReached() {

            removeUpdates();

            JSONObject navigationJO = new JSONObject();
            try {
              navigationJO.put("type", "destinationReached");
            } catch (JSONException e) {
              e.printStackTrace();
            }
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, navigationJO);
            pluginResult.setKeepCallback(true);
            cb.sendPluginResult(pluginResult);
          }

          @Override
          public void onProgress(NavigationProgress navigationProgress) {
            JSONObject navigationJO = new JSONObject();
            try {
              navigationJO.put("type", "progress");
              navigationJO.put("value", customClasses.navigationProgressToJsonObject(navigationProgress));
            } catch (JSONException e) {
              e.printStackTrace();
            }
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, navigationJO);
            pluginResult.setKeepCallback(true);
            cb.sendPluginResult(pluginResult);
          }

          @Override
          public void onUserOutsideRoute() {
            JSONObject navigationJO = new JSONObject();
            try {
              navigationJO.put("type", "userOutsideRoute");
            } catch (JSONException e) {
              e.printStackTrace();
            }
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, navigationJO);
            pluginResult.setKeepCallback(true);
            cb.sendPluginResult(pluginResult);
          }
        });
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }


  private void updateWithLocation(Location location) {
    SitumSdk.navigationManager().updateWithLocation(location);
  }

  private void removeUpdates() {
    SitumSdk.navigationManager().removeUpdates();
  }
}
