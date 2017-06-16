import { Component , NgZone , ElementRef , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController , Events } from 'ionic-angular';
import { UtilProvider } from '../../providers/util/util';

declare var window: any;
declare var google: any;

/**
 * Generated class for the LocationInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-location-info',
 	templateUrl: 'location-info.html',
     providers: [UtilProvider]
 })
 export class LocationInfoPage {
     isTesting = false;

     selectedBuilding:any;
     currentLocation:any;
     slectedFloor:any;
     selectedPOI:any;

     locationErrorMsg = "";
     navigationIndicationsMessage = "";

     status = "Not available";
     poisList:any = [];
     loading;
     currentRoute:any;

     map;
     currentPosMarker;
     selectedPoiName = "";
     floorMap:any;
     poisMarker:any = [];

     routesPolylines = [];

     mapZoom = 18;

     isShowSearchList = false;

     searchBarMall:any = "";
     searchBarShop:any = "";

     searchType = "Building";

     buildingsArray = [];
     poisArray = [];
     buildingFilterList = [];
     poiFilterList = [];
     floorsArray = [];

     bottomInfoText:string = "Please search mall & shop"; 
     floorOverlay:any;
     isNavigationStart = false;
     isLocationUpdating = false;

     infowindow:any;


     constructor( public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams , private zone: NgZone , public events: Events , public util:UtilProvider) {
         // this.selectedBuilding = navParams.get('building');
         this.infowindow = new google.maps.InfoWindow({
             disableAutoPan: true,
             maxWidth: 200
         });


         events.subscribe('MenuItemChange', (userEventData) => {
             this.isShowSearchList = false;
             

             // if(userEventData.type == 'Building') {
             //     this.searchBarMall = "";
             //     this.searchType = userEventData.type;
             // } else if(userEventData.type == 'POI') {
             //     this.searchBarShop = "";
             //     if(this.selectedBuilding) {
             //         this.searchType = userEventData.type;
             //     } 				
             // } else if(userEventData.type == 'Start Navigate') {
             //     this.startNavigation();
             // } 
         });
     }

     ionViewDidLoad() {
         console.log('ionViewDidLoad LocationInfoPage');
         this.getBuildings();
     }

   
     ngAfterViewInit() {
         var ref = this;
         ref.zone.run(() => {
             ref.showMap();
         });
     }

     showLoading(msg) {
         this.loading = this.loadingCtrl.create({
             content: msg
         });
         this.loading.present();
     }

     hideLoading() {
         this.loading.dismiss();
     }


     getBuildings() {
         let ref = this;

         if(this.isTesting) {
             ref.buildingsArray = JSON.parse('[{"address":"","bounds":{"northEast":{"latitude":3.1574073523743467,"longitude":101.61013028728091},"northWest":{"latitude":3.1574073523743467,"longitude":101.60891630527264},"southEast":{"latitude":3.156614425892212,"longitude":101.61013028728091},"southWest":{"latitude":3.156614425892212,"longitude":101.60891630527264}},"boundsRotated":{"northEast":{"latitude":3.157480336631599,"longitude":101.60897022208923},"northWest":{"latitude":3.156312174954634,"longitude":101.60932123240065},"southEast":{"latitude":3.157709603104937,"longitude":101.60972536029018},"southWest":{"latitude":3.1565414414538453,"longitude":101.61007637067026}},"center":{"latitude":3.15701088914065,"longitude":101.609523296356},"dimensions":{"width":134.936103199873,"height":87.6799409001345},"infoHtml":"","name":"eCurve Damansara","pictureThumbUrl":"","pictureUrl":"","rotation":{"degrees":-106.80645929441549,"degreesClockwise":466.8064592944155,"radians":-1.86412437708485,"radiansMinusPiPi":-1.86412437708485},"userIdentifier":"-1","identifier":"1431"},{"address":"","bounds":{"northEast":{"latitude":22.72628960249395,"longitude":75.89448680074379},"northWest":{"latitude":22.72628960249395,"longitude":75.89371557431514},"southEast":{"latitude":22.725335693101915,"longitude":75.89448680074379},"southWest":{"latitude":22.725335693101915,"longitude":75.89371557431514}},"boundsRotated":{"northEast":{"latitude":22.725464014496872,"longitude":75.89462253878999},"northWest":{"latitude":22.726179316726352,"longitude":75.89460795730739},"southEast":{"latitude":22.7254459790073,"longitude":75.89359441792793},"southWest":{"latitude":22.72616128123678,"longitude":75.89357983641747}},"center":{"latitude":22.7258126477903,"longitude":75.8941011875868},"dimensions":{"width":79.2268628160681,"height":105.636099078708},"infoHtml":"","name":"Patidar sHouse","pictureThumbUrl":"","pictureUrl":"","rotation":{"degrees":-271.08332833894497,"degreesClockwise":631.083328338945,"radians":-4.73129662677944,"radiansMinusPiPi":-4.73129662677944},"userIdentifier":"-1","identifier":"1685"},{"address":"168, Jalan Bukit Bintang, Bukit Bintang, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia","bounds":{"northEast":{"latitude":3.1499039013645462,"longitude":101.71507820155018},"northWest":{"latitude":3.1499039013645462,"longitude":101.71164177560608},"southEast":{"latitude":3.1480975260401527,"longitude":101.71507820155018},"southWest":{"latitude":3.1480975260401527,"longitude":101.71164177560608}},"boundsRotated":{"northEast":{"latitude":3.1488384109553205,"longitude":101.71529221983101},"northWest":{"latitude":3.150688470021479,"longitude":101.71239021751384},"southEast":{"latitude":3.14731295821117,"longitude":101.71432975984834},"southWest":{"latitude":3.149163017277328,"longitude":101.71142775753117}},"center":{"latitude":3.14900071371087,"longitude":101.713359989226},"dimensions":{"width":381.967303904424,"height":199.744691825801},"infoHtml":"<p>Pavilion Kuala Lumpur contains over 450 retail shops that are spread across seven levels. There are a number of double-storey&nbsp;flagship&nbsp;stores, of which some are street-front fashion boutiques which constitute the shopping mall.</p>","name":"Pavilion Bukit Bintang KL","pictureThumbUrl":"","pictureUrl":"","rotation":{"degrees":-327.6165552681448,"degreesClockwise":687.6165552681448,"radians":-5.7179875734711,"radiansMinusPiPi":-5.7179875734711},"userIdentifier":"-1","identifier":"1413"}]');
         }

         if(window.plugins && window.plugins.SitumIndoorNavigation) {
             ref.showLoading("Fetching buildings");
             window.plugins.SitumIndoorNavigation.fetchBuildings(function(res){
                 console.log("RESPONSE "+JSON.stringify(res));
                 ref.hideLoading();
                 ref.zone.run(() => {
                     ref.buildingsArray = res;
                 });
             }, function(error) {
                 ref.hideLoading();
                 console.log("Error "+error);
             });  
         }
     }

     getFloorsForBuilding() {
         let ref = this;

         if(this.isTesting) {
             ref.floorsArray = [{level:1}, {level:2}, {level:3}, {level:4},{level:5},{level:6}];
             ref.floorsArray = JSON.parse('[{"altitude":1,"buildingIdentifier":"1685","level":1,"mapUrl":"https://dashboard.situm.es/uploads/situm/floor/map/2395/4d5e7118-053a-4979-aeee-cefebde9b52d.png","scale":6.77800408741024}]');
             ref.floorSelect(ref.floorsArray[0]);
             ref.getPOIs();
         }

         if(window.plugins && window.plugins.SitumIndoorNavigation) {
             ref.showLoading("Fetching Floors");
             window.plugins.SitumIndoorNavigation.fetchFloorsForBuilding(ref.selectedBuilding, function(res){
                 console.log("RESPONSE "+JSON.stringify(res));
                 ref.hideLoading();
                 ref.zone.run(() => {
                     if (res.length > 0) {
                         ref.floorSelect(res[0]);
                         ref.floorsArray = res;
                     }
                 });
                 ref.getPOIs();
             }, function(error) {
                 ref.hideLoading();
                 console.log("Error "+error);
             });  
         }
     }

     getPOIs() {
         var ref = this;
         if(this.isTesting) {
             ref.poisArray = JSON.parse('[{"buildingIdentifier":"1685","cartesianCoordinate":{"x":35.4698126398935,"y":78.5507469981981},"coordinate":{"latitude":22.7341725669465,"longitude":75.884183049202},"floorIdentifier":"2395","name":"Flat 1","position":{"buildingIdentifier":"1685","cartesianCoordinate":{"x":35.4698126398935,"y":78.5507469981981},"coordinate":{"latitude":22.7341725669465,"longitude":75.884183049202},"floorIdentifier":"2395","isIndoor":true,"isOutdoor":false},"isIndoor":true,"isOutdoor":false},{"buildingIdentifier":"1685","cartesianCoordinate":{"x":17.0300720309583,"y":59.4640739405727},"coordinate":{"latitude":22.7341329857857,"longitude":75.8839282393456},"floorIdentifier":"2395","name":"Badroom","position":{"buildingIdentifier":"1685","cartesianCoordinate":{"x":17.0300720309583,"y":59.4640739405727},"coordinate":{"latitude":22.7341329857857,"longitude":75.8839282393456},"floorIdentifier":"2395","isIndoor":true,"isOutdoor":false},"isIndoor":true,"isOutdoor":false}]');
             ref.setPoisOnMap();
         }

         var success = function (res) {
             ref.hideLoading();
             ref.zone.run(() => {
                 ref.poisArray = res;
                 ref.setPoisOnMap();
             });
             console.log("Response POIS "+JSON.stringify(res));
             ref.startLocationUpdate();
         };

         var onError = function (error) {
             ref.hideLoading;
             ref.startLocationUpdate();
             console.log("POI Fecth error "+error);
         };

         if(window.plugins && window.plugins.SitumIndoorNavigation) {
             this.showLoading("Fetching Point of interests");

             window.plugins.SitumIndoorNavigation.fetchIndoorPOIsFromBuilding(ref.selectedBuilding, success, onError);
         }
     }

     floorSelect(item) {
         this.slectedFloor = item;

         if (this.floorOverlay) {
             this.floorOverlay.setMap(null);
             this.floorOverlay = null;
         }
         var mapUrl = this.slectedFloor.mapUrl;
         this.setImageOnMap(mapUrl);
         this.setPoisOnMap();
     }


     setCustomOverlay(mapUrl) {
         var ref = this;

         USGSOverlay.prototype = new google.maps.OverlayView();

         let bounds = this.selectedBuilding.bounds;
         var north = this.util.midpoint(bounds.northWest.latitude, bounds.northEast.latitude, bounds.northWest.longitude, bounds.northEast.longitude);
         var south = this.util.midpoint(bounds.southWest.latitude, bounds.southEast.latitude, bounds.southWest.longitude, bounds.southEast.longitude);

         var boundsObj = new google.maps.LatLngBounds(
             new google.maps.LatLng(north.latitude, north.longitude),
             new google.maps.LatLng(south.latitude, south.longitude));

         function USGSOverlay(bounds, image, map) {
             this.bounds_ = bounds;
             this.image_ = image;
             this.map_ = map;
             this.div_ = null;
             this.setMap(map);
         }
         this.floorOverlay = new USGSOverlay(bounds, mapUrl, this.map);

         USGSOverlay.prototype.onAdd = function() {

             var div = document.createElement('div');
             div.style.borderStyle = 'none';
             div.style.borderWidth = '0px';
             div.style.position = 'absolute';

             var img = document.createElement('img');
             img.src = this.image_;
             img.style.width = '100%';
             img.style.height = '100%';
             img.style.position = 'absolute';
             div.appendChild(img);

             this.div_ = div;

             var panes = this.getPanes();
             panes.overlayLayer.appendChild(div);
         };

         USGSOverlay.prototype.draw = function() {

             var overlayProjection = this.getProjection();

             let boundsData = ref.selectedBuilding.bounds;
             let rotation = ref.selectedBuilding.rotation.degrees;

             var swLatLng = new google.maps.LatLng(boundsData.southWest.latitude, boundsData.southWest.longitude);
             var neLatLng = new google.maps.LatLng(boundsData.northEast.latitude, boundsData.northEast.longitude);

             var sw = overlayProjection.fromLatLngToDivPixel(swLatLng);
             var ne = overlayProjection.fromLatLngToDivPixel(neLatLng);

             var div = this.div_;
             div.style.left = sw.x + 'px';
             div.style.top = ne.y + 'px';
             div.style.width = (ne.x - sw.x) + 'px';
             div.style.height = (sw.y - ne.y) + 'px';
             div.style.transform = 'rotate('+rotation+'deg)';
         };

         USGSOverlay.prototype.onRemove = function() {
             this.div_.parentNode.removeChild(this.div_);
             this.div_ = null;
         };


     }

     setImageOnMap(mapUrl) {        
         this.setCustomOverlay(mapUrl);
     }

     setPoisOnMap() {
         let ref = this;

         for (var i = 0; i < this.poisMarker.length; ++i) {
             var marker = this.poisMarker[i];
             marker.setMap(null);
         }
         ref.poisMarker = [];
         setTimeout(function() {
             for (var i = 0; i < ref.poisArray.length; ++i) {
                 var poi = ref.poisArray[i];

                 if(poi.floorIdentifier != ref.slectedFloor.identifier) {
                     return;
                 }
                 var lat = poi.coordinate.latitude;
                 var lng = poi.coordinate.longitude;            
                 let position = new google.maps.LatLng(lat, lng);
                 var markerImage = new google.maps.MarkerImage('./assets/shop-marker.png',
                     new google.maps.Size(35, 35),
                     new google.maps.Point(0, 0),
                     new google.maps.Point(17.5, 17.5));

                 var marker = new google.maps.Marker({
                     position: position,
                     map: ref.map,
                     title: poi.name,
                     icon:markerImage,
                     poi: poi
                 });

                 google.maps.event.addListener(marker, 'click', function() {
                     ref.setInfoWindowContent(this, this.poi, ref.map, ref);                     
                 });

                 ref.poisMarker.push(marker);
             }
         }, 500);
     }

     /*************************************************************************************/
     /****************************  Search Bar Handle  ***********************************/
     /*************************************************************************************/

     onInput(event) {
         let ref = this;
         if(this.searchType == 'Building') {

             var filteredArray = this.buildingsArray.filter(function(item) {
                 return item.name.toLowerCase().indexOf(ref.searchBarMall.toLowerCase()) !== -1;
             });
             this.buildingFilterList = filteredArray;
         } else if(this.searchType  == 'POI') {
             var filteredArray = this.poisArray.filter(function(item) {
                 return item.name.toLowerCase().indexOf(ref.searchBarShop.toLowerCase()) !== -1;
             });
             this.poiFilterList = filteredArray;
         }
         this.isShowSearchList = true;
     }

     onClear(event) {
         if(this.searchType == 'Building') {
             this.buildingFilterList  = [];
         } else if(this.searchType  == 'POI') {
             this.poiFilterList  = [];
         } 
         this.isShowSearchList = false;
     }

     onCancel(event) {
         if(this.searchType == 'Building') {
             this.buildingFilterList  = [];
         } else if(this.searchType  == 'POI') {
             this.poiFilterList  = [];
         } 
     }

     searchBarOnFocus(type) {
         this.searchType = type;

         this.onInput("");
         console.log("On Focus");
     }

     buildingSelect(item) {
         this.searchBarMall = item.name;
         this.selectedBuilding = item;

         this.buildingFilterList = [];
         this.poiFilterList = [];
         this.poisArray = [];
         this.floorsArray = [];

         this.isShowSearchList = false;

         let center = item.center;

         let ionic = new google.maps.LatLng(center.latitude, center.longitude);
         this.map.setCenter(ionic);

         if (this.floorOverlay) {
             this.floorOverlay.setMap(null);
             this.floorOverlay = null;
         }

         this.getFloorsForBuilding();
     }
     poiSelect(item) {
         this.searchBarShop = item.name;

         this.selectedPOI = item;

         this.poiFilterList = [];
         this.isShowSearchList = false;
     }

     startLocationUpdate() {
         if(this.isLocationUpdating) {
             return;
         }
         this.isLocationUpdating = true;

         var isMapCenterSet = false;
         var ref = this;
         var onLocationChanged = function(res) {
             console.log("Location changed "+JSON.stringify(res));

             ref.zone.run(() => {
                 ref.currentLocation = res;
                 ref.locationErrorMsg = "";

                 var position = ref.currentLocation.position;
                 ref.updateMarkerPosition(position.coordinate.latitude, position.coordinate.longitude);

                 if (!isMapCenterSet) {
                     let ionic = new google.maps.LatLng(position.coordinate.latitude, position.coordinate.longitude);
                     isMapCenterSet = true;
                     ref.map.setCenter(ionic);
                 }

             });
         };


         var onStatusChanged = function(res) {
             ref.zone.run(() => {
                 ref.status = res;
             });
             console.log("Status changed "+res);  
             ref.util.presentToastTop(res);
         };


         var onError = function(error) {
             ref.zone.run(() => {
                 ref.locationErrorMsg = error;
             });
             console.log("Error on location update "+error);
         };


         if(window.plugins && window.plugins.SitumIndoorNavigation) {
             window.plugins.SitumIndoorNavigation.startLocationUpdate(this.selectedBuilding, onLocationChanged, onStatusChanged, onError);
         }
     }

     showMap() { 		

         let ref = this;

         let element = document.getElementById('map_canvas');
         var mapOptions = {
             center:new google.maps.LatLng(0, 0),
             zoom: 18,
             panControl:false,
             zoomControl:false,
             draggable:true,
             scrollwheel:true,
             mapTypeControl:false,
             disableDoubleClickZoom:false,
             streetViewControl:false,
             fullscreenControl:false,
             mapTypeId: google.maps.MapTypeId.ROADMAP
         };
         this.map =  new google.maps.Map(element, mapOptions)

         google.maps.event.addListener(this.map, 'center_changed', function() {
             ref.infowindow.close();            
         });
     }

     updateMarkerPosition(lat, lng) {
         if (!this.map) {
             console.log("Map is not initialized");
             return;
         }
         let ionic = new google.maps.LatLng(lat, lng);
         if (this.currentPosMarker == null) {
             var markerImage = new google.maps.MarkerImage('./assets/curr_pos.png',
                 new google.maps.Size(57, 57),
                 new google.maps.Point(0, 0),
                 new google.maps.Point(28.5, 28.5));

             this.currentPosMarker = new google.maps.Marker({
                 position: ionic,
                 map: this.map,
                 title: "",
                 icon: markerImage
             });
         }

         this.currentPosMarker.setPosition(ionic);
     }


     drawRouteOnMap() {

         let points = this.currentRoute.points;

         var coordinates = [];
         for (var i = 0; i < points.length; ++i) {
             let point = points[i];
             let coordinate = point.coordinate; 		
             let latLng = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
             coordinates.push(latLng);
         }
         this.addPolyline(coordinates);
     }

     addPolyline(coordinates) {
         // Define a symbol using SVG path notation, with an opacity of 1.
         var lineSymbol = {
             path: 'M 0,-1 0,1',
             strokeOpacity: 1,
             scale: 4
         };

         var polyline = new google.maps.Polyline({
             path: coordinates,
             strokeColor: "#0B5EA7",
             strokeOpacity: 0,
             icons: [{
                 icon: lineSymbol,
                 offset: '0',
                 repeat: '20px'
             }],
             map: this.map
         });
         this.routesPolylines.push(polyline);
     }

     showRoute() {
         if(!this.selectedBuilding) {
             this.util.presentToastTop("Please select mall first.");
         } else if (!this.selectedPOI){
             this.util.presentToastTop("Please select shop first.");
         } else {
             if (this.currentPosMarker) {
                 this.currentPosMarker.setMap(null);
                 for (var i = 0; i < this.routesPolylines.length; ++i) {
                     var polyline = this.routesPolylines[i];
                     polyline.setMap(null);
                 }
                 this.routesPolylines = [];
                 this.currentPosMarker = null;
             }

             var ref = this;
             for (var i = 0; i <this.poisList.length; ++i) {
                 let poi = this.poisList[i];
                 if (poi.name == this.selectedPoiName) {
                     this.selectedPOI = poi;
                 }
             }
             if (window.plugins && window.plugins.SitumIndoorNavigation) {

                 ref.showLoading("");
                 var success = function (route) {
                     ref.hideLoading();
                     ref.zone.run(() => {
                         ref.currentRoute = route;
                         ref.drawRouteOnMap();
                         console.log("Route response "+JSON.stringify(route)); 
                     });
                 };
                 var onError = function (error) {
                     ref.hideLoading();
                     console.log("Error in getting route "+error);
                 };
                 window.plugins.SitumIndoorNavigation.getRoute(this.currentLocation, this.selectedPOI, success, onError);
             }
         }
         
     }

     startNavigation() {
         var ref = this;
         if (window.plugins && window.plugins.SitumIndoorNavigation) {
             var onDestinationReached = function () {
                 console.log("Destination Reached");
                 ref.isNavigationStart = false;
                 ref.zone.run(() => {
                     ref.navigationIndicationsMessage = "Destination Reached";

                     ref.util.presentToast(ref.navigationIndicationsMessage);
                 }); 
             };
             var onProgress = function (navigationProgress) {
                 ref.isNavigationStart = true;
                 console.log("Navigation Progress  "+JSON.stringify(navigationProgress));
                 ref.zone.run(() => {
                     ref.navigationIndicationsMessage = navigationProgress.currentIndication.indicationType+" Distance : "+ navigationProgress.currentIndication.distanceToNextLevel+" Total  Distance : "+ navigationProgress.currentIndication.distance;

                     ref.util.presentToast(ref.navigationIndicationsMessage);
                 }); 
             };
             var onUserOutsideRoute = function() {
                 console.log("User Outside Route");
                 ref.zone.run(() => {
                     ref.navigationIndicationsMessage = "User outside route";

                     ref.util.presentToast(ref.navigationIndicationsMessage);
                 }); 				
             };
             var onError = function(error) {
                 console.log("Navigation Error "+error);
                 ref.isNavigationStart = false;
                 ref.zone.run(() => {
                     ref.navigationIndicationsMessage = error;

                     ref.util.presentToast("You are not in building");
                 }); 				
             };
             window.plugins.SitumIndoorNavigation.startNaviagtion(ref.currentRoute, onDestinationReached, onProgress, onUserOutsideRoute, onError);
         }
     }        

     stopNavigation() {
         this.isNavigationStart = false;
         if (this.currentPosMarker) {
             this.currentPosMarker.setMap(null);
             for (var i = 0; i < this.routesPolylines.length; ++i) {
                 var polyline = this.routesPolylines[i];
                 polyline.setMap(null);
             }
             this.routesPolylines = [];
             this.currentPosMarker = null;
         }
     }

     setInfoWindowContent(marker, poi, map_obj, ref) {
         var contentString = '<div class="info_window"> ' +
         '<h3>' + poi.name + '</h3>' +
         '<p><a id="processInfoWindowId"  href="javascript:void(0);">Show Route</a></p>' +
         '</div>';
         ref.infowindow.setContent(contentString);
         ref.infowindow.open(map_obj, marker);

         document.getElementById("processInfoWindowId").addEventListener("click", function(){
             ref.processInfoWindowClick(ref, poi);
         });
     }     


     processInfoWindowClick (ref, poi) {
         this.searchBarShop = poi.name;

         ref.selectedPOI = poi;         
         ref.infowindow.close();  
     }        
 }
