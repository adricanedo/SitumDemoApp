cordova.define("cordova-plugin-situm-indoor-navigation.SitumIndoorNavigation", function(require, exports, module) {
function SitumIndoorNavigation(){
}

SitumIndoorNavigation.prototype.fetchBuildings = function(success, error) {
  cordova.exec(success, error, "SitumIndoorNavigation", "fetchBuildings", []);
};

SitumIndoorNavigation.prototype.fetchIndoorPOIsFromBuilding = function(building, onLocationChanged, onStatusChanged, error) {
	var success =  = function(res) {
		if(res.type == 'locationChanged') {
			onLocationChanged(res.value);
		} else if(res.type == 'statusChanged') {
			onStatusChanged(res.value);
		}
	};
	cordova.exec(success, error, "SitumIndoorNavigation", "fetchIndoorPOIsFromBuilding", [building]);
};

SitumIndoorNavigation.prototype.fetchFloorsForBuilding = function(building, success, error) {
	cordova.exec(success, error, "SitumIndoorNavigation", "fetchFloorsForBuilding", [building]);
};

SitumIndoorNavigation.prototype.startLocationUpdate = function(building, success, error) {
	cordova.exec(success, error, "SitumIndoorNavigation", "startLocationUpdate", [building]);
};

SitumIndoorNavigation.prototype.getRoute = function(fromLocation, toPOI, success, error) {
	cordova.exec(success, error, "SitumIndoorNavigation", "getRoute", [fromLocation, toPOI]);
};


SitumIndoorNavigation.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.SitumIndoorNavigation = new SitumIndoorNavigation();
  return window.plugins.SitumIndoorNavigation;
};

cordova.addConstructor(SitumIndoorNavigation.install);
});
