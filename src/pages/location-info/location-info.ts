import { Component , NgZone , ElementRef , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController } from 'ionic-angular';

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

 	constructor( public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams , private zone: NgZone) {
 		this.selectedBuilding = navParams.get('building');
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad LocationInfoPage');
 		this.getPOIs();
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

 	startLocationUpdate() {
 		var ref = this;
 		var onLocationChanged = function(res) {
 			console.log("Location changed "+JSON.stringify(res));

 			ref.zone.run(() => {
 				ref.currentLocation = res;
 				ref.locationErrorMsg = "";

 				var position = ref.currentLocation.position;
 				ref.updateMarkerPosition(position.coordinate.latitude, position.coordinate.longitude);

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

 	

 	getPOIs() {
 		var ref = this;

 		var success = function (res) {
 			ref.hideLoading();
 			ref.zone.run(() => {
 				ref.poisList = res;
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
 		this.map.setCenter(ionic);
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
 		this.showMap();


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
 					ref.locationErrorMsg = "Destination Reached";
 				}); 
 			};
 			var onProgress = function (navigationProgress) {
 				console.log("Navigation Progress  "+JSON.stringify(navigationProgress));
 				ref.zone.run(() => {
 					ref.navigationIndicationsMessage = navigationProgress.currentIndication.indicationType+" Distance : "+ navigationProgress.currentIndication.distance+" Total  Distance : "+ navigationProgress.currentIndication.distanceToNextLevel;
 				}); 
 			};
 			var onUserOutsideRoute = function() {
 				console.log("User Outside Route");
 				ref.zone.run(() => {
 					ref.locationErrorMsg = "User outside route";
 				}); 				
 			};
 			var onError = function(error) {
 				console.log("Navigation Error "+error);
 				ref.zone.run(() => {
 					ref.locationErrorMsg = error;
 				}); 				
 			};
 			window.plugins.SitumIndoorNavigation.startNaviagtion(ref.currentRoute, onDestinationReached, onProgress, onUserOutsideRoute, onError);
 		}
 	}
 }
