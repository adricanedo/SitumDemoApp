function SitumIndoorNavigation(){
}

SitumIndoorNavigation.prototype.fetchBuildings = function(success, error) {
  cordova.exec(success, error, "SitumIndoorNavigation", "fetchBuildings", []);
};

SitumIndoorNavigation.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.SitumIndoorNavigation = new SitumIndoorNavigation();
  return window.plugins.SitumIndoorNavigation;
};

cordova.addConstructor(SitumIndoorNavigation.install);
