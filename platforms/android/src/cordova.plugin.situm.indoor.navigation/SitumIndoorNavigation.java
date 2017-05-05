package cordova.plugin.situm.indoor.navigation;


import android.util.Log;

import com.ionicframework.demoapp675353.MainActivity;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collection;

import es.situm.sdk.SitumSdk;
import es.situm.sdk.error.Error;
import es.situm.sdk.model.cartography.Building;
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
                for (Building building : buildings) {
                    Log.i(TAG, "onSuccess: " + building.getIdentifier() + " - " + building.getName());

                    if (BUILDING_ID.equals(building.getIdentifier())) {
//                        selectedBuilding = building;
                    }
                }

                if (buildings.isEmpty()) {
                    Log.e(TAG, "onSuccess: you have no buildings. Create one in the Dashboard");
                    return;
                } else {
                    cbc.success(buildings.toString());
                }
            }

            @Override
            public void onFailure(Error error) {
                Log.e(TAG, "onFailure:" + error);
                cbc.error("Expected one non-empty string argument.");
            }
        });
    }
}
