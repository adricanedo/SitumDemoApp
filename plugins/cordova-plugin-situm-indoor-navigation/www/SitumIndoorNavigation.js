function SitumIndoorNavigation(){
}

SitumIndoorNavigation.prototype.fetchBuildings = function(success, error) {
  cordova.exec(success, error, "SitumIndoorNavigation", "fetchBuildings", []);
};

SitumIndoorNavigation.prototype.fetchIndoorPOIsFromBuilding = function(building, onLocationChanged, onStatusChanged, error) {
	var success =  = function(res) {
		if(res.type == 'location-changed') {
			onLocationChanged(res.value);
		} else if(res.type == 'status-changed') {
			onStatusChanged(res.value);
		}
	};
	cordova.exec(success, error, "SitumIndoorNavigation", "startLocationUpdate", [building]);
};

SitumIndoorNavigation.prototype.fetchIndoorPOIsFromBuilding = function(building, success, error) {
	cordova.exec(success, error, "SitumIndoorNavigation", "fetchIndoorPOIsFromBuilding", [building]);
};

SitumIndoorNavigation.prototype.fetchFloorsForBuilding = function(building, success, error) {
	cordova.exec(success, error, "SitumIndoorNavigation", "fetchFloorsForBuilding", [building]);
};


SitumIndoorNavigation.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.SitumIndoorNavigation = new SitumIndoorNavigation();
  return window.plugins.SitumIndoorNavigation;
};

cordova.addConstructor(SitumIndoorNavigation.install);