import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
  	*/
  @Injectable()
  export class UtilProvider {

  	constructor(private toastCtrl: ToastController) {
  		console.log('Hello UtilProvider Provider');
  	}

  	midpoint(lat1, lat2, lng1, lng2) {
  		var degrees = function(rad) {
  			return rad * (180 / Math.PI);
  		}
  		var radians = function(deg) {
  			return deg * (Math.PI / 180);
  		}
  		lat1 = radians(lat1);
  		lng1 = radians(lng1);
  		lat2 = radians(lat2);
  		lng2 = radians(lng2);
  		var bx = Math.cos(lat2) * Math.cos(lng2 - lng1)
  		var by = Math.cos(lat2) * Math.sin(lng2 - lng1)
  		var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + Math.pow(by, 2)));
  		var lon3 = lng1 + Math.atan2(by, Math.cos(lat1) + bx);


  		return {latitude:degrees(lat3), longitude: degrees(lon3)};
  	}

  	presentToastTop(message) {
  		let toast = this.toastCtrl.create({
  			message: message,
  			duration: 2000,
  			position: 'top'
  		});

  		toast.onDidDismiss(() => {
  			console.log('Dismissed toast');
  		});

  		toast.present();
  	}

  	presentToast(message) {
  		let toast = this.toastCtrl.create({
  			message: message,
  			duration: 2000,
  			position: 'bottom'
  		});

  		toast.onDidDismiss(() => {
  			console.log('Dismissed toast');
  		});

  		toast.present();
  	}
  }
