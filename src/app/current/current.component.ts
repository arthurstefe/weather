import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { NgForm } from '@angular/forms';
import 'rxjs/Rx';

import { WeatherService } from '../weather.service';
import { CurrentWeather } from '../current-weather';
@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  myweather:CurrentWeather;
  constructor(private ws:WeatherService, private route:ActivatedRoute) { }


  ngOnInit() {
    this.route.data.subscribe(
      (data:{myweather:CurrentWeather}) => {
        this.myweather = data.myweather;
      }
    )
  }

  onSubmit(weatherForm:NgForm){
    this.ws.anotherCityWeather(weatherForm.value.city).subscribe(
      (data) => {
      this.myweather = new CurrentWeather(data.name, data.main.temp, data.weather[0].icon, data.weather[0].description, data.main.temp_max, data.main.temp_min);
      }
    )
  }

}
