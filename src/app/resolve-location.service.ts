import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { WeatherService } from './weather.service';

@Injectable()
export class ResolveLocationService implements Resolve<any> {

  constructor(private ws:WeatherService) { }

  resolve(){
    return this.ws.localWeather();
  }

}
