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

import java.util.Collection;

import es.situm.sdk.SitumSdk;
import es.situm.sdk.error.Error;
import es.situm.sdk.model.cartography.Building;
import es.situm.sdk.model.location.Angle;
import es.situm.sdk.model.location.Bounds;
import es.situm.sdk.model.location.Coordinate;
import es.situm.sdk.model.location.Dimensions;
import es.situm.sdk.utils.Handler;

/**
 * This class echoes a string called from JavaScript.
 */
public class SitumIndoorNavigation extends CordovaPlugin {
    private static final String TAG = MainActivity.class.getSimpleName();

    // The building identifier where positioning will start.
    // You can see your buildings IDs and names running this example in the Logcat
    private static final String BUILDING_ID = "YOUR_BUILDING_ID";

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
            String message = args.getString(0);
            this.fetchBuildings(message, callbackContext);
            return true;
        }
        return false;
    }

    private void fetchBuildings(String message, CallbackContext callbackContext) {
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

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    buildingsJA.put(bjo);
                }

                if (buildings.isEmpty()) {
                    Log.e(TAG, "onSuccess: you have no buildings. Create one in the Dashboard");
                    return;
                } else {
                    cbc.sendPluginResult(new PluginResult(PluginResult.Status.OK, buildingsJA.toString()));
                }
            }

            @Override
            public void onFailure(Error error) {
                Log.e(TAG, "onFailure:" + error);
                cbc.error("Expected one non-empty string argument.");
            }
        });
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

}
