import { Component, Input, NgZone, OnInit, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule, MapsAPILoader, GoogleMapsAPIWrapper, AgmDataLayer } from '@agm/core';

import { GMapsService } from './service/gmaps.service';

import { Marker } from './class/marker';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GMapsService, Marker]
})
export class AppComponent implements OnInit {
  title: string = 'GEO Converter';
  lat: number = 23.4791187;
  lng: number = 120.44113820000007;
  radius: number = 50000;
  color: string = '#FECE00';
  addr: string = "̨嘉義火車站";
  geoJsonObject: Object;

  addrText: string = '嘉義火車站\n台中火車站\n台北火車站\n高雄火車站';
  addrArr: any[] = [];
  addrArrResult: any[] = [];

  constructor(
    private gmapService: GMapsService,
    private zone: NgZone,
    private marker: Marker
  ) { }

  ngOnInit() {
  }


  getAddr() {

    this.addrArrResult = []; // reset;

    this.addrArr = this.addrText.split('\n');
    this.addrArr.forEach(element => {
      this.gmap(element);
    });
  }

  async gmap(addr: string) {
    await this.gmapService.getLatLan(addr)
      .subscribe(
      result => {
        //必須使用zone 觀察整個 view 否則會導致延遲
        this.zone.run(() => {

          this.marker = new Marker;
          this.marker.addr = addr;
          this.marker.lat = result.lat();
          this.marker.lng = result.lng();
          this.addrArrResult.push(this.marker);
        });
      },
      error => console.log(error),
      () => console.log('Geocoding completed!')
      );
  }


}
