import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //ionic plugin add https://github.com/sdev99/SitumIndoorNavigation.git --variable API_USER_EMAIL="qaiyumohamed@gmail.com" --variable API_KEY="9ebe6ce727fad5052f1402b513d48be50c2c7936b562754306285fb99ec84816"


  constructor(public navCtrl: NavController) {
  	setTimeout(function() {
  		console.log("Plugin Call");
  		window.plugins.SitumIndoorNavigation.fetchBuildings(function(res){
  			console.log("RESPONSE "+res);
  		}, function(error){
  			console.log("Error "+error);
  		});
  	}, 5000);
  }

}
