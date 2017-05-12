import { Component , NgZone , ElementRef , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

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
 	location:any;
 	status = "Not available";
 	poisList:any = [];
 	loading;
 	selectedPOI:any = {};


 	constructor(private googleMaps: GoogleMaps, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams , private zone: NgZone) {
 		console.log("NAVA DATA "+JSON.stringify(navParams.get('building')));

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
 			ref.location = res; 			
 		};
 		var onStatusChanged = function(res) {
 			ref.zone.run(() => {
 				ref.status = res;
 			});
 			console.log("Status changed "+res);  
 		};

 		var onError = function(error) {
 			console.log("Error on location update "+error);
 		};
 		if(window.plugins && window.plugins.SitumIndoorNavigation) {
 			window.plugins.SitumIndoorNavigation.startLocationUpdate(this.selectedBuilding, onLocationChanged, onStatusChanged, onError);
 		}
 	}

 	startNavigation() {
 		if (this.selectedBuilding.identifier == this.location.buildingIdentifier) {
 			// this.getPOIs();
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

 		var error = function (error) {
 			ref.hideLoading;
 			ref.startLocationUpdate();
 			console.log("POI Fecth error "+error);
 		}
 		if(window.plugins && window.plugins.SitumIndoorNavigation) {
 			this.showLoading("Fetching Point of interests");

 			window.plugins.SitumIndoorNavigation.fetchIndoorPOIsFromBuilding(ref.selectedBuilding, success, error);
 		}
 	}

 	poiSelected(poi) {
 		this.selectedPOI = poi;
 	}

 	showMap() {

 		let element: HTMLElement = document.getElementById('map_canvas');

 		// var googleMaps =  new GoogleMaps();
 		let map: GoogleMap = this.googleMaps.create(element);

 		map.one(GoogleMapsEvent.MAP_READY).then(
 			() => {
 				console.log('Map is ready!');
 			},
 			(error) => {
 				console.log('Map error !'+error);
 			}
 			);

 		let ionic: LatLng = new LatLng(43.0741904,-89.3809802);

 		let position: CameraPosition = {
 			target: ionic,
 			zoom: 18,
 			tilt: 30
 		};

 		map.moveCamera(position);

 		let markerOptions: MarkerOptions = {
 			position: ionic,
 			title: 'Ionic'
 		};

 		map.addMarker(markerOptions).then((marker: Marker) => {
 			marker.showInfoWindow();
 		});


 	}
 }
