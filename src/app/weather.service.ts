import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

import { CurrentWeather } from './current-weather';
import { Forecast } from './forecast';

@Injectable()
export class WeatherService {

  myweather:CurrentWeather;
  location
  constructor(private http:Http) { }

  localWeather() {
    return new Promise ((res, rej) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.location = pos.coords;
        const lat = this.location.latitude;
        const lon = this.location.longitude;
        return this.http.get(`http://api.openweathermap.org/data/2.5/weather?appid=0f3fb9fa31ad3d41f1bb2bd0841c3f2f&lat=${lat}&lon=${lon}&units=metric&lang=pt`).map((response:Response) =>
        response.json()).toPromise().then(
          (data) => {
            this.myweather = new CurrentWeather(data.name, data.main.temp, data.weather[0].icon, data.weather[0].description, data.main.temp_max, data.main.temp_min)
            res(this.myweather);
          }
        )
      })
    })
  }

  anotherCityWeather(city:string){
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?appid=0f3fb9fa31ad3d41f1bb2bd0841c3f2f&q=${city}&units=metric&cnt=10&lang=pt`).map((response:Response) => response.json());
  }

  fiveDayForecast(city:string){
    return this.http.get(`http://api.openweathermap.org/data/2.5/forecast?q=${city},us&appid=0f3fb9fa31ad3d41f1bb2bd0841c3f2f&units=metric&lang=pt`).map((response:Response) => response.json())
  }

}
