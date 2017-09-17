import { Component , NgZone , ElementRef , ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams , LoadingController , Events } from 'ionic-angular';
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

     floorOverlay:any;
     isNavigationStart = false;
     isLocationUpdating = false;

     infowindow:any;

     icon:any;

     constructor( public plt: Platform, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams , private zone: NgZone , public events: Events , public util:UtilProvider) {
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
         this.plt.ready().then((readySource) => {
             this.getBuildings();
         });

         var user = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
         this.icon = {
             path: user,
             scale: .7,
             strokeColor: 'white',
             strokeWeight: .10,
             fillOpacity: 1,
             fillColor: '#404040',
             offset: '5%'
         };
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
             ref.buildingsArray = JSON.parse('[{"center":{"longitude":101.6095199584961,"latitude":3.157010793685913},"bounds":{"northEast":{"longitude":101.6101269495479,"latitude":3.157407256926981},"southWest":{"longitude":101.6089129674443,"latitude":3.156614330444845},"northWest":{"longitude":101.6089129674443,"latitude":3.157407256926981},"southEast":{"longitude":101.6101269495479,"latitude":3.156614330444845}},"address":"","rotation":-1.864124,"boundsRotated":{"northEast":{"longitude":101.6093178945607,"latitude":3.1563120795846},"southWest":{"longitude":101.609722022336,"latitude":3.157709507787226},"northWest":{"longitude":101.6089668840968,"latitude":3.157480241216119},"southEast":{"longitude":101.6100730328,"latitude":3.156541346155707}},"userIdentifier":0,"identifier":"1431","pictureUrl":"","name":"eCurve Damansara","pictureThumbUrl":""},{"center":{"longitude":75.95023345947266,"latitude":22.73187637329102},"bounds":{"northEast":{"longitude":75.95189463925158,"latitude":22.73391262608451},"southWest":{"longitude":75.94857227969374,"latitude":22.72984012049752},"northWest":{"longitude":75.94857227969374,"latitude":22.73391262608451},"southEast":{"longitude":75.95189463925158,"latitude":22.72984012049752}},"address":"","rotation":0,"boundsRotated":{"northEast":{"longitude":75.94857227969374,"latitude":22.73391262608451},"southWest":{"longitude":75.95189463236379,"latitude":22.72984012049752},"northWest":{"longitude":75.95189463236379,"latitude":22.73391262608451},"southEast":{"longitude":75.94857227969374,"latitude":22.72984012049752}},"userIdentifier":0,"identifier":"1846","pictureUrl":"","name":"Karuna Sagar","pictureThumbUrl":""},{"center":{"longitude":101.7133636474609,"latitude":3.149000644683838},"bounds":{"northEast":{"longitude":101.7150818611337,"latitude":3.149903832346036},"southWest":{"longitude":101.7116454337882,"latitude":3.14809745702164},"northWest":{"longitude":101.7116454337882,"latitude":3.149903832346036},"southEast":{"longitude":101.7150818611337,"latitude":3.14809745702164}},"address":"168, Jalan Bukit Bintang, Bukit Bintang, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia","rotation":-5.717988,"boundsRotated":{"northEast":{"longitude":101.7123938756322,"latitude":3.150688400591823},"southWest":{"longitude":101.714333417888,"latitude":3.147312888775853},"northWest":{"longitude":101.7152958778739,"latitude":3.148838341477675},"southEast":{"longitude":101.7114314156464,"latitude":3.149162947890002}},"userIdentifier":0,"identifier":"1413","pictureUrl":"","name":"Pavilion Bukit Bintang KL","pictureThumbUrl":""}]');
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
             ref.floorsArray = JSON.parse('[{"mapUrl":"https://dashboard.situm.es/uploads/situm/floor/map/2084/b9d03a9d-e9cc-4a54-bed5-267024667d26.png","buildingIdentifier":"1431","level":-1,"identifier":"2084","scale":21.72139205516021},{"mapUrl":"https://dashboard.situm.es/uploads/situm/floor/map/2083/ed4d58ec-b808-4398-a8d2-c0036a821c81.png","buildingIdentifier":"1431","level":0,"identifier":"2083","scale":21.72139205516021},{"mapUrl":"https://dashboard.situm.es/uploads/situm/floor/map/2085/7b28f75f-39e6-48da-b91d-43ccffa26a09.png","buildingIdentifier":"1431","level":1,"identifier":"2085","scale":22.12158146866368},{"mapUrl":"https://dashboard.situm.es/uploads/situm/floor/map/2086/52741fb8-967f-4954-892e-f8a9028e0143.png","buildingIdentifier":"1431","level":2,"identifier":"2086","scale":21.72139205516021},{"mapUrl":"https://dashboard.situm.es/uploads/situm/floor/map/2087/9161e83c-5e52-4602-8503-1278a3208939.png","buildingIdentifier":"1431","level":3,"identifier":"2087","scale":21.72139205516021}]');
             ref.floorSelect(ref.floorsArray[0]);
             ref.getPOIs();

             ref.updateMarkerPosition(ref.selectedBuilding.center.latitude, ref.selectedBuilding.center.longitude, ref);

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
             ref.poisArray = JSON.parse('[{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609300673008,"latitude":3.15749161487239},"floorIdentifier":"2083","cartesianCoordinate":{"x":125.509799643208,"y":52.1580543958946},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":125.509799643208,"y":52.1580543958946},"isOutdoor":false,"buildingIdentifier":"1431","name":"TM Point","coordinate":{"longitude":101.609300673008,"latitude":3.15749161487239}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609165221453,"latitude":3.15745077327981},"floorIdentifier":"2083","cartesianCoordinate":{"x":125.539720411659,"y":67.8764402983404},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":125.539720411659,"y":67.8764402983404},"isOutdoor":false,"buildingIdentifier":"1431","name":"Maxis Centre","coordinate":{"longitude":101.609165221453,"latitude":3.15745077327981}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609560847282,"latitude":3.15739988867045},"floorIdentifier":"2083","cartesianCoordinate":{"x":107.438594294184,"y":27.4071784714596},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":107.438594294184,"y":27.4071784714596},"isOutdoor":false,"buildingIdentifier":"1431","name":"Subway","coordinate":{"longitude":101.609560847282,"latitude":3.15739988867045}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609387174249,"latitude":3.15744943421118},"floorIdentifier":"2083","cartesianCoordinate":{"x":118.264778616255,"y":44.3025933883632},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":118.264778616255,"y":44.3025933883632},"isOutdoor":false,"buildingIdentifier":"1431","name":"Celcom Centre","coordinate":{"longitude":101.609387174249,"latitude":3.15744943421118}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609673500061,"latitude":3.15718630719079},"floorIdentifier":"2083","cartesianCoordinate":{"x":81.2095503175635,"y":22.2491726048139},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":81.2095503175635,"y":22.2491726048139},"isOutdoor":false,"buildingIdentifier":"1431","name":"Information Centre","coordinate":{"longitude":101.609673500061,"latitude":3.15718630719079}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609484404325,"latitude":3.15723786134507},"floorIdentifier":"2083","cartesianCoordinate":{"x":92.7440164300492,"y":40.7214069885507},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":92.7440164300492,"y":40.7214069885507},"isOutdoor":false,"buildingIdentifier":"1431","name":"Solomons","coordinate":{"longitude":101.609484404325,"latitude":3.15723786134507}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609416007996,"latitude":3.1572679903951},"floorIdentifier":"2083","cartesianCoordinate":{"x":98.13145820277,"y":47.0357529420445},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":98.13145820277,"y":47.0357529420445},"isOutdoor":false,"buildingIdentifier":"1431","name":"Pro Eye Studio Spectacle","coordinate":{"longitude":101.609416007996,"latitude":3.1572679903951}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609184667468,"latitude":3.15724522622405},"floorIdentifier":"2083","cartesianCoordinate":{"x":103.156669972585,"y":72.3791328252271},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":103.156669972585,"y":72.3791328252271},"isOutdoor":false,"buildingIdentifier":"1431","name":"U Mobile","coordinate":{"longitude":101.609184667468,"latitude":3.15724522622405}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609363034368,"latitude":3.15734096964597},"floorIdentifier":"2083","cartesianCoordinate":{"x":107.559127934436,"y":50.3390398585234},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":107.559127934436,"y":50.3390398585234},"isOutdoor":false,"buildingIdentifier":"1431","name":"Escalator","coordinate":{"longitude":101.609363034368,"latitude":3.15734096964597}},{"floorIdentifier":"2085","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609161198139,"latitude":3.1574460865396},"floorIdentifier":"2085","cartesianCoordinate":{"x":125.172910344866,"y":68.4543830298306},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":125.172910344866,"y":68.4543830298306},"isOutdoor":false,"buildingIdentifier":"1431","name":"Serenity","coordinate":{"longitude":101.609161198139,"latitude":3.1574460865396}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609585657716,"latitude":3.15727937248044},"floorIdentifier":"2083","cartesianCoordinate":{"x":93.8840418235334,"y":28.6204337398328},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":93.8840418235334,"y":28.6204337398328},"isOutdoor":false,"buildingIdentifier":"1431","name":"ATM Machine","coordinate":{"longitude":101.609585657716,"latitude":3.15727937248044}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609293967485,"latitude":3.15717090789746},"floorIdentifier":"2083","cartesianCoordinate":{"x":91.7770160292524,"y":63.1253071901902},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":91.7770160292524,"y":63.1253071901902},"isOutdoor":false,"buildingIdentifier":"1431","name":"Sky World Mobile","coordinate":{"longitude":101.609293967485,"latitude":3.15717090789746}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609591692686,"latitude":3.15716019534544},"floorIdentifier":"2083","cartesianCoordinate":{"x":81.0746470011453,"y":31.7886612223997},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":81.0746470011453,"y":31.7886612223997},"isOutdoor":false,"buildingIdentifier":"1431","name":"Columbia Concept Store","coordinate":{"longitude":101.609591692686,"latitude":3.15716019534544}},{"floorIdentifier":"2085","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609154492617,"latitude":3.15729008503123},"floorIdentifier":"2085","cartesianCoordinate":{"x":108.87494792216,"y":74.1556150490149},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":108.87494792216,"y":74.1556150490149},"isOutdoor":false,"buildingIdentifier":"1431","name":"Colour Feng Shui","coordinate":{"longitude":101.609154492617,"latitude":3.15729008503123}},{"floorIdentifier":"2085","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.60912565887,"latitude":3.15737511589919},"floorIdentifier":"2085","cartesianCoordinate":{"x":118.802519648737,"y":74.5050022175215},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":118.802519648737,"y":74.5050022175215},"isOutdoor":false,"buildingIdentifier":"1431","name":"S Pro Saloon","coordinate":{"longitude":101.60912565887,"latitude":3.15737511589919}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609133034945,"latitude":3.15734833452421},"floorIdentifier":"2084","cartesianCoordinate":{"x":115.730534878866,"y":74.5764225290539},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":115.730534878866,"y":74.5764225290539},"isOutdoor":false,"buildingIdentifier":"1431","name":"Flight Simulator","coordinate":{"longitude":101.609133034945,"latitude":3.15734833452421}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609480381012,"latitude":3.15747822418647},"floorIdentifier":"2083","cartesianCoordinate":{"x":118.31681726015,"y":33.4645403403885},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":118.31681726015,"y":33.4645403403885},"isOutdoor":false,"buildingIdentifier":"1431","name":"Toilet (G)","coordinate":{"longitude":101.609480381012,"latitude":3.15747822418647}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609454900026,"latitude":3.15654288434872},"floorIdentifier":"2084","cartesianCoordinate":{"x":20.125771197311,"y":66.0808453283599},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":20.125771197311,"y":66.0808453283599},"isOutdoor":false,"buildingIdentifier":"1431","name":"ATM Bank Islam","coordinate":{"longitude":101.609454900026,"latitude":3.15654288434872}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609220206738,"latitude":3.15698276868655},"floorIdentifier":"2084","cartesianCoordinate":{"x":74.2321767068156,"y":76.9890026149913},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":74.2321767068156,"y":76.9890026149913},"isOutdoor":false,"buildingIdentifier":"1431","name":"Ah Cheng Laksa","coordinate":{"longitude":101.609220206738,"latitude":3.15698276868655}},{"floorIdentifier":"2083","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609859913588,"latitude":3.15712337094703},"floorIdentifier":"2083","cartesianCoordinate":{"x":68.5564398062486,"y":4.42624700670993},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":68.5564398062486,"y":4.42624700670993},"isOutdoor":false,"buildingIdentifier":"1431","name":"eCurve Main Entrance","coordinate":{"longitude":101.609859913588,"latitude":3.15712337094703}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609302684665,"latitude":3.15747688511787},"floorIdentifier":"2084","cartesianCoordinate":{"x":123.885936969668,"y":52.4149510224852},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":123.885936969668,"y":52.4149510224852},"isOutdoor":false,"buildingIdentifier":"1431","name":"Seven Eleven (LG)","coordinate":{"longitude":101.609302684665,"latitude":3.15747688511787}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609561517835,"latitude":3.15648061760093},"floorIdentifier":"2084","cartesianCoordinate":{"x":10.1080331938322,"y":56.7270996731985},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":10.1080331938322,"y":56.7270996731985},"isOutdoor":false,"buildingIdentifier":"1431","name":"Pak John Steamboat","coordinate":{"longitude":101.609561517835,"latitude":3.15648061760093}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609289944172,"latitude":3.15731887501092},"floorIdentifier":"2084","cartesianCoordinate":{"x":107.569308647555,"y":58.8225455959279},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":107.569308647555,"y":58.8225455959279},"isOutdoor":false,"buildingIdentifier":"1431","name":"Car Autopay Machine","coordinate":{"longitude":101.609289944172,"latitude":3.15731887501092}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609454900026,"latitude":3.15690108545983},"floorIdentifier":"2084","cartesianCoordinate":{"x":58.0429811293416,"y":54.6283026759177},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":58.0429811293416,"y":54.6283026759177},"isOutdoor":false,"buildingIdentifier":"1431","name":"Mr. D.I.Y","coordinate":{"longitude":101.609454900026,"latitude":3.15690108545983}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609492450953,"latitude":3.15666005295006},"floorIdentifier":"2084","cartesianCoordinate":{"x":31.3217730666633,"y":58.3391160120303},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":31.3217730666633,"y":58.3391160120303},"isOutdoor":false,"buildingIdentifier":"1431","name":"Car Autopay Machine","coordinate":{"longitude":101.609492450953,"latitude":3.15666005295006}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609416678548,"latitude":3.15697942101345},"floorIdentifier":"2084","cartesianCoordinate":{"x":67.5635299338149,"y":56.1906478794958},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":67.5635299338149,"y":56.1906478794958},"isOutdoor":false,"buildingIdentifier":"1431","name":"Footcourt","coordinate":{"longitude":101.609416678548,"latitude":3.15697942101345}},{"floorIdentifier":"2084","position":{"isIndoor":1,"buildingIdentifier":"1431","coordinate":{"longitude":101.609269827604,"latitude":3.15681404594887},"floorIdentifier":"2084","cartesianCoordinate":{"x":54.7773776001083,"y":77.1036105967135},"isOutdoor":0},"isIndoor":true,"cartesianCoordinate":{"x":54.7773776001083,"y":77.1036105967135},"isOutdoor":false,"buildingIdentifier":"1431","name":"Ayam Penyet AP","coordinate":{"longitude":101.609269827604,"latitude":3.15681404594887}}]');
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
             let rotation = ref.selectedBuilding.rotation;

             var swLatLng = new google.maps.LatLng(boundsData.southWest.latitude, boundsData.southWest.longitude);
             var neLatLng = new google.maps.LatLng(boundsData.northEast.latitude, boundsData.northEast.longitude);

             var sw = overlayProjection.fromLatLngToDivPixel(swLatLng);
             var ne = overlayProjection.fromLatLngToDivPixel(neLatLng);

             var div = this.div_;
             div.style.left = sw.x + 'px';
             div.style.top = ne.y + 'px';
             div.style.width = (ne.x - sw.x) + 'px';
             div.style.height = (sw.y - ne.y) + 'px';
             div.style.transform = 'rotate('+rotation+'rad)';
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
                     continue;
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

         this.focusOnSelectedPOI();
     }

     focusOnSelectedPOI() {
         let coordinate = this.selectedPOI.coordinate;
         let ionic = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
         this.map.setCenter(ionic);

         for (var i = 0; i < this.floorsArray.length; ++i) {
             var floor = this.floorsArray[i];
             if (floor.identifier == this.selectedPOI.floorIdentifier) {
                 this.floorSelect(floor);
                 break;
             }
         }
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
                 ref.updateMarkerPosition(position.coordinate.latitude, position.coordinate.longitude, ref);

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
                 ref.currentLocation = null;
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
             mapTypeId: google.maps.MapTypeId.ROADMAP,
             styles: [{
                 featureType: "poi",
                 stylers: [{
                     visibility: "off"
                 }]
             }]
         };
         this.map =  new google.maps.Map(element, mapOptions)

         google.maps.event.addListener(this.map, 'center_changed', function() {
             ref.infowindow.close();            
         });
     }

     updateMarkerPosition1(lat, lng, ref) {

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

     updateMarkerPosition(lat, lng, ref) {
         let currentCoords = new google.maps.LatLng(lat, lng);

         if (!ref.currentPosMarker) {
             ref.currentPosMarker = new google.maps.Marker({
                 position: currentCoords,
                 map: ref.map,
                 title: 'Your Position!',
                 icon: ref.icon   
             });
         } else {
             var prevPos = new google.maps.LatLng({"lat": ref.currentPosMarker.getPosition().lat(), "lng": ref.currentPosMarker.getPosition().lng()});
             var lastPosn = new google.maps.LatLng(currentCoords);
             var dist = ref.calcDistance(prevPos, lastPosn);
             ref.currentPosMarker.setPosition(lastPosn);
             var heading = google.maps.geometry.spherical.computeHeading(lastPosn, prevPos);
             ref.icon.rotation = heading;
             ref.currentPosMarker.setIcon(ref.icon);
             ref.map.setCenter(currentCoords);
         }
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
             if (!this.currentLocation || (this.currentLocation && this.currentLocation.buildingIdentifier != this.selectedBuilding.identifier)) {
                 this.util.showAlert("Alert!", "You are not in building.");
                 return;
             }

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
         let ref = this;
         window.plugins.SitumIndoorNavigation.stopNavigation(function(res) {
             ref.isNavigationStart = false;
             if (ref.currentPosMarker) {
                 ref.currentPosMarker.setMap(null);
                 for (var i = 0; i < ref.routesPolylines.length; ++i) {
                     var polyline = ref.routesPolylines[i];
                     polyline.setMap(null);
                 }
                 ref.routesPolylines = [];
                 ref.currentPosMarker = null;
             }
         }, function(err) {
             
         });
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
