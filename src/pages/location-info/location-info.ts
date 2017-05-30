import { Component , NgZone , ElementRef , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController , Events } from 'ionic-angular';

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
 })
 export class LocationInfoPage {
 	selectedBuilding:any;
 	currentLocation:any;
 	
 	locationErrorMsg = "";
 	navigationIndicationsMessage = "";

 	status = "Not available";
 	poisList:any = [];
 	loading;
 	selectedPOI:any;
 	currentRoute:any;

 	map;
 	currentPosMarker;
 	selectedPoiName = "";

 	routesPolylines = [];

 	mapZoom = 18;

 	isShowSearchList = false;

 	searchBar:any;

 	searchPlaceHolderText = "Search Building";
 	searchType = "Building";

 	buildingsArray = [];
 	poisArray = [];
 	buildingFilterList = [];
 	poiFilterList = [];

 	constructor( public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams , private zone: NgZone , public events: Events ) {
 		this.selectedBuilding = navParams.get('building');

 		events.subscribe('MenuItemChange', (userEventData) => {
 			this.isShowSearchList = false;
 			this.searchBar = "";

 			if(userEventData.type == 'Building') {
 				this.searchPlaceHolderText = "Search Building";
 				this.searchType = userEventData.type;
 			} else if(userEventData.type == 'POI') {
 				if(this.selectedBuilding) {
 					this.searchType = userEventData.type;
 					this.searchPlaceHolderText = "Search POI";
 				} 				
 			} else if(userEventData.type == 'Start Navigate') {

 			} 
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

 		ref.buildingsArray = JSON.parse('[{"dimensions":{"width":134.936103199873,"height":87.6799409001345},"rotation":{"degrees":-106.8064651489258,"radians":-1.864124417304993},"pictureUrl":"","boundsRotated":{"northEast":{"longitude":101.6093212324227,"latitude":3.156312175006871},"southWest":{"longitude":101.6097253601939,"latitude":3.15770960327443},"northWest":{"longitude":101.6089702219405,"latitude":3.157480336699061},"southEast":{"longitude":101.6100763706761,"latitude":3.15654144158224}},"identifier":"1431","address":"","infoHtml":"","userIdentifier":"","center":{"longitude":101.609523296356,"latitude":3.15701088914065},"pictureThumbUrl":"","bounds":{"northEast":{"longitude":101.6101302874394,"latitude":3.157407352389088},"southWest":{"longitude":101.6089163052726,"latitude":3.156614425892212},"northWest":{"longitude":101.6089163052726,"latitude":3.157407352389088},"southEast":{"longitude":101.6101302874394,"latitude":3.156614425892212}},"name":"eCurve Damansara"},{"dimensions":{"width":79.9909904989713,"height":105.702841045857},"rotation":{"degrees":-323.5189208984375,"radians":-5.646470546722412},"pictureUrl":"","boundsRotated":{"northEast":{"longitude":75.8840625674759,"latitude":22.7345601454708},"southWest":{"longitude":75.88407688417763,"latitude":22.7333632014136},"northWest":{"longitude":75.88468869260144,"latitude":22.73413067926199},"southEast":{"longitude":75.88345075905208,"latitude":22.7337926676224}},"identifier":"1685","address":"","infoHtml":"","userIdentifier":"","center":{"longitude":75.8840697258711,"latitude":22.7339616734422},"pictureThumbUrl":"","bounds":{"northEast":{"longitude":75.88445908137355,"latitude":22.73443892898915},"southWest":{"longitude":75.88368037036865,"latitude":22.73348441789525},"northWest":{"longitude":75.88368037036865,"latitude":22.73443892898915},"southEast":{"longitude":75.88445908137355,"latitude":22.73348441789525}},"name":"Patidar\'sHouse"},{"dimensions":{"width":381.967303904424,"height":199.744691825801},"rotation":{"degrees":-327.6165466308594,"radians":-5.717987537384033},"pictureUrl":"","boundsRotated":{"northEast":{"longitude":101.7123902174465,"latitude":3.150688469597545},"southWest":{"longitude":101.7143297596039,"latitude":3.147312957824195},"northWest":{"longitude":101.7152922195989,"latitude":3.148838410540405},"southEast":{"longitude":101.7114277574515,"latitude":3.149163016881335}},"identifier":"1413","address":"168, Jalan Bukit Bintang, Bukit Bintang, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia","infoHtml":"<p>Pavilion Kuala Lumpur contains over 450 retail shops that are spread across seven levels. There are a number of double-storey&nbsp;flagship&nbsp;stores, of which some are street-front fashion boutiques which constitute the shopping mall.</p>","userIdentifier":"","center":{"longitude":101.713359989226,"latitude":3.14900071371087},"pictureThumbUrl":"","bounds":{"northEast":{"longitude":101.7150782028459,"latitude":3.149903901381587},"southWest":{"longitude":101.7116417756061,"latitude":3.148097526040153},"northWest":{"longitude":101.7116417756061,"latitude":3.149903901381587},"southEast":{"longitude":101.7150782028459,"latitude":3.148097526040153}},"name":"Pavilion Bukit Bintang KL"}]');
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

 	getPOIs() {
 		var ref = this;

 		ref.poisArray = JSON.parse(' [{"floorIdentifier":"2395","position":{"isIndoor":1,"buildingIdentifier":"1685","coordinate":{"longitude":75.884183049202,"latitude":22.7341725669465},"floorIdentifier":"2395","cartesianCoordinate":{"x":35.4698126398935,"y":78.5507469981981},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":35.4698126398935,"y":78.5507469981981},"isOutdoor":false,"buildingIdentifier":"1685","name":"Flat 1","coordinate":{"longitude":75.884183049202,"latitude":22.7341725669465}},{"floorIdentifier":"2395","position":{"isIndoor":1,"buildingIdentifier":"1685","coordinate":{"longitude":75.8839282393456,"latitude":22.7341329857857},"floorIdentifier":"2395","cartesianCoordinate":{"x":17.0300720309583,"y":59.4640739405727},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":17.0300720309583,"y":59.4640739405727},"isOutdoor":false,"buildingIdentifier":"1685","name":"Badroom","coordinate":{"longitude":75.8839282393456,"latitude":22.7341329857857}}]');
 		
 		var success = function (res) {
 			ref.hideLoading();
 			ref.zone.run(() => {
 				ref.poisArray = res;
 			});
 			console.log("Response POIS "+JSON.stringify(res));
 			ref.startLocationUpdate();
 		};

 		var onError = function (error) {
 			ref.hideLoading;
 			ref.startLocationUpdate();
 			console.log("POI Fecth error "+error);
 		}
 		if(window.plugins && window.plugins.SitumIndoorNavigation) {
 			this.showLoading("Fetching Point of interests");

 			window.plugins.SitumIndoorNavigation.fetchIndoorPOIsFromBuilding(ref.selectedBuilding, success, onError);
 		}
 	}


 	/*************************************************************************************/
 	/****************************  Search Bar Handle  ***********************************/
 	/*************************************************************************************/
 	
 	onInput(event) {
 		if(this.searchBar.length > 0) {
 			if(this.searchType == 'Building') {
 				this.buildingFilterList = this.buildingsArray;
 			} else if(this.searchType  == 'POI') {
 				this.poiFilterList = this.poisArray;
 			}
 			this.isShowSearchList = true;
 		} else {
 			this.buildingFilterList = [];
 			this.poiFilterList = [];
 			this.isShowSearchList = false;
 		}
 	}

 	onClear(event) {
 		this.buildingFilterList  = [];
 		this.isShowSearchList = false;
 	}

 	onCancel(event) {
 		this.buildingFilterList  = [];
 	}
 	
 	buildingSelect(item) {
 		this.selectedBuilding = item;

 		this.buildingFilterList = [];
 		this.isShowSearchList = false;

 		this.getPOIs();
 	}
 	poiSelect(item) {
 		this.selectedPOI = item;

 		this.poiFilterList = [];
 		this.isShowSearchList = false;
 	}

 	startLocationUpdate() {
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

 		
 		let element = document.getElementById('map_canvas');
 		var mapOptions = {
 			center:new google.maps.LatLng(0, 0),
 			zoom: 18,
 			panControl:false,
 			zoomControl:false,
 			draggable:true,
 			scrollwheel:true,
 			disableDoubleClickZoom:false,
 			mapTypeId: google.maps.MapTypeId.ROADMAP
 		};

 		this.map =  new google.maps.Map(element, mapOptions)
 	}


 	updateMarkerPosition(lat, lng) {
 		if (!this.map) {
 			console.log("Map is not initialized");
 			return;
 		}
 		let ionic = new google.maps.LatLng(lat, lng);
 		if (this.currentPosMarker == null) {
 			var markerImage = new google.maps.MarkerImage('img/point-icon.png',
 				new google.maps.Size(25, 25),
 				new google.maps.Point(0, 0),
 				new google.maps.Point(12.5, 12.5));

 			this.currentPosMarker = new google.maps.Marker({
 				position: ionic,
 				map: this.map,
 				title: ""
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
 		var polyline = new google.maps.Polyline({
 			path: coordinates,
 			strokeColor: "#0B5EA7",
 			strokeOpacity: 1.0,
 			strokeWeight: 2,
 			map: this.map
 		});
 		this.routesPolylines.push(polyline);
 	}

 	showRoute() {
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
 			var success = function (route) {
 				ref.zone.run(() => {
 					ref.currentRoute = route;
 					ref.drawRouteOnMap();
 					console.log("Route response "+JSON.stringify(route)); 
 				});
 			};
 			var onError = function (error) {
 				console.log("Error in getting route "+error);
 			};
 			window.plugins.SitumIndoorNavigation.getRoute(this.currentLocation, this.selectedPOI, success, onError);
 		}
 	}

 	startNavigation() {
 		var ref = this;
 		if (window.plugins && window.plugins.SitumIndoorNavigation) {
 			var onDestinationReached = function () {
 				console.log("Destination Reached");
 				ref.zone.run(() => {
 					ref.navigationIndicationsMessage = "Destination Reached";
 				}); 
 			};
 			var onProgress = function (navigationProgress) {
 				console.log("Navigation Progress  "+JSON.stringify(navigationProgress));
 				ref.zone.run(() => {
 					ref.navigationIndicationsMessage = navigationProgress.currentIndication.indicationType+" Distance : "+ navigationProgress.currentIndication.distanceToNextLevel+" Total  Distance : "+ navigationProgress.currentIndication.distance;
 				}); 
 			};
 			var onUserOutsideRoute = function() {
 				console.log("User Outside Route");
 				ref.zone.run(() => {
 					ref.navigationIndicationsMessage = "User outside route";
 				}); 				
 			};
 			var onError = function(error) {
 				console.log("Navigation Error "+error);
 				ref.zone.run(() => {
 					ref.navigationIndicationsMessage = error;
 				}); 				
 			};
 			window.plugins.SitumIndoorNavigation.startNaviagtion(ref.currentRoute, onDestinationReached, onProgress, onUserOutsideRoute, onError);
 		}
 	}
 }
