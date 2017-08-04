import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { NgForm } from '@angular/forms';
import 'rxjs/Rx';

import { WeatherService } from '../weather.service';
import { CurrentWeather } from '../current-weather';
import { Forecast } from '../forecast';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.css']
})
export class CurrentComponent implements OnInit {
  myweather:CurrentWeather;
  forecast:Forecast[]=[];
  chartsData:Array<number[]> = [];
  chartsLabel:Array<any[]> = [];
  constructor(private ws:WeatherService, private route:ActivatedRoute) { }


  ngOnInit() {
    this.route.data.subscribe(
      (data:{myweather:CurrentWeather}) => {
        if (localStorage.getItem("defaultLocation") != ""){
          this.myweather = JSON.parse(localStorage.getItem("defaultLocation"));
        }else{
          this.myweather = data.myweather;
          localStorage.setItem("defaultLocation", JSON.stringify(this.myweather));
        }
        this.setFiveDayForecast(data.myweather.cityName);
      }
    )
  }

  onSubmit(weatherForm:NgForm){
    this.ws.anotherCityWeather(weatherForm.value.city).subscribe(
      (data) => {
        this.myweather = new CurrentWeather(data.name, data.main.temp, data.weather[0].icon, data.weather[0].description, data.main.temp_max, data.main.temp_min);
        this.setFiveDayForecast(weatherForm.value.city);
      }
    )
  }

  setFiveDayForecast(city){
    console.log(city);
    this.forecast.splice(0, this.forecast.length);
    this.ws.fiveDayForecast(city).subscribe(
      (data) =>{
        console.log(data);
        for(let i=0; i<data.list.length;i= i+8){
          const forecastWeather = new Forecast(data.city.name,
                                                data.list[i].weather[0].description,
                                                data.list[i].main.temp,
                                                data.list[i].dt_txt,
                                                data.list[i].weather[0].icon);
          this.forecast.push(forecastWeather);
          this.chartsData.push(data.list[i].main.temp);
          this.chartsLabel.push(data.list[i].dt_txt);
        }
        return this.forecast;
      }
    )
  }

  setDefaultLocation(){
    localStorage.setItem("defaultLocation", JSON.stringify(this.myweather));
  }

  public lineChartData:Array<any> = [
    {data: this.chartsData, label: 'Variação da temperatura (5 dias)'}
  ];
  public lineChartLabels:Array<any> = ['Amanhã', '2 dias', '3 dias', '4 dias', '5 dias'];
  public lineChartOptions:any = {
     responsive: true
  };
  public lineChartColors:Array<any> = [
    {
      backgroundColor: 'rgba(52, 127, 255, 0.67)',
      borderColor: 'rgba(52, 127, 255, 0.95)',
      pointBackgroundColor: 'rgba(52, 127, 255, 0.95)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

}
