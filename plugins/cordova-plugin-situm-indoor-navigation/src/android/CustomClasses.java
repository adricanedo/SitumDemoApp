package cordova.plugin.situm.indoor.navigation;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collection;

import es.situm.sdk.model.cartography.Building;
import es.situm.sdk.model.cartography.Floor;
import es.situm.sdk.model.cartography.Poi;
import es.situm.sdk.model.cartography.Point;
import es.situm.sdk.model.directions.Indication;
import es.situm.sdk.model.directions.Route;
import es.situm.sdk.model.directions.RouteStep;
import es.situm.sdk.model.location.Angle;
import es.situm.sdk.model.location.Bounds;
import es.situm.sdk.model.location.CartesianCoordinate;
import es.situm.sdk.model.location.Coordinate;
import es.situm.sdk.model.location.Dimensions;
import es.situm.sdk.model.location.Location;
import es.situm.sdk.model.navigation.NavigationProgress;

/**
 * Created by ignisit on 5/11/17.
 */

class CustomClasses {

    //Building

    protected JSONObject buildingToJsonObject(Building building) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("address", building.getAddress());
            jo.put("bounds", boundsToJsonObject(building.getBounds()));
            jo.put("boundsRotated", boundsToJsonObject(building.getBoundsRotated()));
            jo.put("center", coordinateToJsonObject(building.getCenter()));
            jo.put("dimensions", dimensionsToJsonObject(building.getDimensions()));
            jo.put("infoHtml", building.getInfoHtml());
            jo.put("name", building.getName());
            jo.put("pictureThumbUrl", building.getPictureThumbUrl().getValue());
            jo.put("pictureUrl", building.getPictureUrl().getValue());
            jo.put("rotation", building.getRotation().radians());
            jo.put("userIdentifier", building.getUserIdentifier());
            jo.put("identifier", building.getIdentifier());

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }



    //Floor

    protected  JSONObject floorToJsonObject(Floor floor) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("altitude", floor.getAltitude());
            jo.put("buildingIdentifier", floor.getBuildingIdentifier());
            jo.put("level", floor.getLevel());
            jo.put("mapUrl", floor.getMapUrl().getValue());
            jo.put("scale", floor.getScale());
            jo.put("identifier", floor.getIdentifier());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }



    // POI

    protected  JSONObject poiToJsonObject(Poi poi) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("buildingIdentifier", poi.getBuildingIdentifier());
            jo.put("cartesianCoordinate", cartesianCoordinateToJsonObject(poi.getCartesianCoordinate()));
            jo.put("coordinate", coordinateToJsonObject(poi.getCoordinate()));
            jo.put("floorIdentifier", poi.getFloorIdentifier());
            jo.put("name", poi.getName());
            jo.put("position", pointToJsonObject(poi.getPosition()));
            jo.put("isIndoor", poi.isIndoor());
            jo.put("isOutdoor", poi.isOutdoor());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }




    // Location

    protected  JSONObject locationToJsonObject(Location location) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("accuracy", location.getAccuracy());
            jo.put("bearing", angleToJsonObject(location.getBearing()));
            jo.put("bearingQuality", location.getBearingQuality().toString());
            jo.put("buildingIdentifier", location.getBuildingIdentifier());
            jo.put("cartesianBearing", angleToJsonObject(location.getCartesianBearing()));
            jo.put("cartesianCoordinate", cartesianCoordinateToJsonObject(location.getCartesianCoordinate()));
            jo.put("coordinate", coordinateToJsonObject(location.getCoordinate()));
            jo.put("floorIdentifier", location.getFloorIdentifier());
            jo.put("position", pointToJsonObject(location.getPosition()));
            jo.put("provider", location.getProvider());
            jo.put("quality", location.getQuality().toString());
            jo.put("hasBearing", location.hasBearing());
            jo.put("timestamp", location.getTime());
            jo.put("hasCartesianBearing", location.hasCartesianBearing());
            jo.put("isIndoor", location.isIndoor());
            jo.put("isOutdoor", location.isOutdoor());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo;
    }

    protected Location locationJsonObjectToLocation(JSONObject jo) {
        Location location = null;
        try {
            location = new Location.Builder(jo.getLong("timestamp"),
                    jo.getString("provider"),
                    pointJsonObjectToPoint(jo.getJSONObject("position")),
                    Float.valueOf(jo.getString("accuracy")))
                    .build();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  location;
    }




    // Coordinate

    protected JSONObject coordinateToJsonObject(Coordinate coordinate) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("latitude", coordinate.getLatitude());
            jo.put("longitude", coordinate.getLongitude());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    protected Coordinate coordinateJsonObjectToCoordinate(JSONObject jo) {
        Coordinate coordinate = null;
        try {
            coordinate = new Coordinate(jo.getDouble("latitude"), jo.getDouble("longitude"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  coordinate;
    }



    // Point

    protected JSONObject pointToJsonObject(Point point) {
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

    protected Point pointJsonObjectToPoint(JSONObject jo) {
        Point point = null;
        try {
            point = new Point(jo.getString("buildingIdentifier"), jo.getString("floorIdentifier"), coordinateJsonObjectToCoordinate(jo.getJSONObject("coordinate")), cartesianCoordinateJsonObjectToCartesianCoordinate(jo.getJSONObject("cartesianCoordinate")));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  point;
    }




    // CartesianCoordinate

    protected JSONObject cartesianCoordinateToJsonObject(CartesianCoordinate cartesianCoordinate) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("x", cartesianCoordinate.getX());
            jo.put("y", cartesianCoordinate.getY());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    protected CartesianCoordinate cartesianCoordinateJsonObjectToCartesianCoordinate(JSONObject jo) {
        CartesianCoordinate cartesianCoordinate = null;
        try {
            cartesianCoordinate = new CartesianCoordinate(jo.getDouble("x"), jo.getDouble("y"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  cartesianCoordinate;
    }


    // Dimensions

    protected JSONObject dimensionsToJsonObject(Dimensions dimensions) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("width", dimensions.getWidth());
            jo.put("height", dimensions.getHeight());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }



    // Bounds

    protected JSONObject boundsToJsonObject(Bounds bounds) {
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



    // Angle

    protected JSONObject angleToJsonObject(Angle angle) {
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


    // Route

    protected JSONObject routeToJsonObject(Route route) {
        JSONObject jo = new JSONObject();
        try {
            JSONArray edgesJsonArray = new JSONArray();
            for (RouteStep routeStep:route.getEdges()) {
                edgesJsonArray.put(routeStepToJsonObject(routeStep));
            }
            JSONArray stepsJsonArray = new JSONArray();
            for (RouteStep routeStep:route.getSteps()) {
                stepsJsonArray.put(routeStepToJsonObject(routeStep));
            }
            JSONArray indicationsJsonArray = new JSONArray();
            for (Indication indication:route.getIndications()) {
                indicationsJsonArray.put(indicationToJsonObject(indication));
            }
            JSONArray nodesJsonArray = new JSONArray();
            for (Point point:route.getNodes()) {
                nodesJsonArray.put(pointToJsonObject(point));
            }
            JSONArray pointsJsonArray = new JSONArray();
            for (Point point:route.getPoints()) {
                pointsJsonArray.put(pointToJsonObject(point));
            }

            jo.put("edges", edgesJsonArray);
            jo.put("firstStep", routeStepToJsonObject(route.getFirstStep()));
            jo.put("from", pointToJsonObject(route.getFrom()));
            jo.put("indications", indicationsJsonArray);
            jo.put("lastStep", routeStepToJsonObject(route.getLastStep()));
            jo.put("nodes", nodesJsonArray);
            jo.put("points", pointsJsonArray);
            jo.put("indications", indicationsJsonArray);
            jo.put("to", pointToJsonObject(route.getTo()));
            jo.put("steps", stepsJsonArray);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }



    //RouteStep

    protected JSONObject routeStepToJsonObject(RouteStep routeStep) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("distance", routeStep.getDistance());
            jo.put("distanceToGoal", routeStep.getDistanceToGoal());
            jo.put("from", pointToJsonObject(routeStep.getFrom()));
            jo.put("id", routeStep.getId());
            jo.put("to", pointToJsonObject(routeStep.getTo()));
            jo.put("isFirst", routeStep.isFirst());
            jo.put("isLast", routeStep.isLast());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    protected RouteStep routeStepJsonObjectToRouteStep(JSONObject jo) {
        RouteStep routeStep = null;
        try {
            routeStep = new RouteStep.Builder()
                    .distance(jo.getDouble("distance"))
                    .distanceToEnd(jo.getDouble("distanceToGoal"))
                    .from(pointJsonObjectToPoint(jo.getJSONObject("from")))
                    .to(pointJsonObjectToPoint(jo.getJSONObject("to")))
                    .id(jo.getInt("id"))
                    .isLast(jo.getBoolean("isLast"))
                    .build();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  routeStep;
    }


    // Indication

    protected  JSONObject indicationToJsonObject(Indication indication) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("distance", indication.getDistance());
            jo.put("distanceToNextLevel", indication.getDistanceToNextLevel());
            jo.put("indicationType", indication.getIndicationType().toString());
            jo.put("orientation", indication.getOrientation());
            jo.put("orientationType", indication.getOrientationType());
            jo.put("stepIdxDestination", indication.getStepIdxDestination());
            jo.put("stepIdxOrigin", indication.getStepIdxOrigin());
            jo.put("neededLevelChange", indication.isNeededLevelChange());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jo;
    }

    protected Indication indicationJsonObjectToIndication(JSONObject jo) {
        Indication indication = null;
        try {
            indication = new Indication.Builder()
                    .setDistance(jo.getDouble("distance"))
                    .setDistanceToNextLevel(jo.getInt("distanceToNextLevel"))
                    .setInstructionType(Indication.Action.valueOf(jo.getString("indicationType")))
                    .setOrientation(jo.getDouble("orientation"))
                    .setOrientationType(Indication.Orientation.valueOf(jo.getString("orientationType")))
                    .setStepIdxDestination(jo.getInt("stepIdxDestination"))
                    .setStepIdxOrigin(jo.getInt("stepIdxOrigin"))
                    .build();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  indication;
    }


    // NavigationProgress

  protected JSONObject navigationProgressToJsonObject(NavigationProgress navigationProgress) {
    JSONObject jo = new JSONObject();
    try {
      jo.put("closestPointInRoute", pointToJsonObject(navigationProgress.getClosestPointInRoute()));
      jo.put("currentIndication", indicationToJsonObject(navigationProgress.getCurrentIndication()));
      jo.put("nextIndication", indicationToJsonObject(navigationProgress.getNextIndication()));
      jo.put("distanceToClosestPointInRoute", navigationProgress.getDistanceToClosestPointInRoute());
      jo.put("distanceToEndStep", navigationProgress.getDistanceToEndStep());
      jo.put("distanceToGoal", navigationProgress.getDistanceToGoal());
      jo.put("routeStep", routeStepToJsonObject(navigationProgress.getRouteStep()));
      jo.put("timeToEndStep", navigationProgress.getTimeToEndStep());
      jo.put("timeToGoal", navigationProgress.getTimeToGoal());
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return  jo;
  }
}
