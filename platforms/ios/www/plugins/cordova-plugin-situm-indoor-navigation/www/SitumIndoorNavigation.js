cordova.define("cordova-plugin-situm-indoor-navigation.SitumIndoorNavigation", function(require, exports, module) {
function SitumIndoorNavigation(){
}

SitumIndoorNavigation.prototype.fetchBuildings = function(arg0, success, error) {
  cordova.exec(success, error, "SitumIndoorNavigation", "fetchBuildings", [arg0]);
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
