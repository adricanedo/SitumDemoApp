import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  	setTimeout(function() {
  		console.log("Plugin Call");
  		window.plugins.SitumIndoorNavigation.fetchBuildings("test", function(res){
  			console.log("RESPONSE "+res);
  		}, function(error){
  			console.log("Error "+error);
  		});
  	}, 5000);
  }

}
