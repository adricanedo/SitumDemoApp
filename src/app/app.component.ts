import { Component , ViewChild } from '@angular/core';
import { Platform , Nav , Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LocationInfoPage } from '../pages/location-info/location-info';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LocationInfoPage;

  pages: Object;
  selectedMenuItem;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.pages = [
      { title: 'Building', icon: 'ios-home-outline' },
      { title: 'POI', icon: 'ios-map-outline'},
      { title: 'Start Navigate', icon: 'navigate'}         
      ];
    });
  }

  openPage(page) {
    this.selectedMenuItem = page.title;

    this.events.publish('MenuItemChange', {'type':page.title});
  }  
}

