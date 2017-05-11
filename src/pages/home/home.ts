import { Component } from '@angular/core';
import { NavController , Platform} from 'ionic-angular';
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //ionic plugin add https://github.com/sdev99/SitumIndoorNavigation.git --variable API_USER_EMAIL="qaiyumohamed@gmail.com" --variable API_KEY="9ebe6ce727fad5052f1402b513d48be50c2c7936b562754306285fb99ec84816"

  buildings:any = [];
  location:any = {};
  status:any = "";
  selectedBuilding:any = {};
  poisList:any = [];

  constructor(public navCtrl: NavController, public plt:Platform) {
  	
  }


  ionViewDidLoad() {
    var ref = this;
    this.plt.ready().then((readySource) => {
      console.log("Plugin Call");
      window.plugins.SitumIndoorNavigation.fetchBuildings(function(res){
        console.log("RESPONSE "+JSON.stringify(res));
        ref.buildings = res;
        ref.selectedBuilding = res[0];
        ref.startLocationUpdate();
      }, function(error){
        console.log("Error "+error);
      });      
    });
  }

  startLocationUpdate() {
    var ref = this;
    var onLocationChanged = function(res) {
      console.log("Location changed "+JSON.stringify(res));
      this.location = res;

      setTimeout(function() {
        ref.startNavigation();
      }, 3000);
    };
    var onStatusChanged = function(res) {
      this.status = res;
      console.log("Status changed "+res);  
    };

    var onError = function(error) {
      console.log("Error on location update "+error);
    };

    window.plugins.SitumIndoorNavigation.startLocationUpdate(this.selectedBuilding, onLocationChanged, onStatusChanged, onError);
  }

  startNavigation() {
    if (this.selectedBuilding.identifier == this.location.buildingIdentifier) {
      // this.getPOIs();
    }

     this.getPOIs();
  }

  getPOIs() {
    var success = function (res) {
      console.log("Response POIS "+JSON.stringify(res));
      this.poisList = res;
    };
    var error = function (error) {
      console.log("POI Fecth error "+error);
    }
    window.plugins.SitumIndoorNavigation.fetchIndoorPOIsFromBuilding(this.selectedBuilding, success, error);
  }



}
