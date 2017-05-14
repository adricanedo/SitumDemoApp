import { Component , NgZone } from '@angular/core';
import { NavController , Platform , LoadingController } from 'ionic-angular';

import { LocationInfoPage } from '../location-info/location-info';


declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //ionic plugin add https://github.com/sdev99/SitumIndoorNavigation.git --variable API_USER_EMAIL="qaiyumohamed@gmail.com" --variable API_KEY="9ebe6ce727fad5052f1402b513d48be50c2c7936b562754306285fb99ec84816"
  locationInfoPage = LocationInfoPage;

  buildings:any ;
  location:any = {};
  status:any = "";
  poisList:any = [];

  loading;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public plt:Platform, private zone: NgZone) {
  	
  }


  ionViewDidLoad() {
    var ref = this;
    this.plt.ready().then((readySource) => {
      console.log("Plugin Call");
      if(window.plugins && window.plugins.SitumIndoorNavigation) {

        ref.showLoading("Fetching buildings");
        window.plugins.SitumIndoorNavigation.fetchBuildings(function(res){
          console.log("RESPONSE "+JSON.stringify(res));
          ref.hideLoading();
          ref.zone.run(() => {
            ref.buildings = res;
          });
        }, function(error) {
          ref.hideLoading();
          console.log("Error "+error);
        });  
      }    
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
}
