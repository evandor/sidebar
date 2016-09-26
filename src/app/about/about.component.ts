import { Component, OnInit } from '@angular/core';
import { Http, HttpModule } from '@angular/http';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private http: Http) { }

  ngOnInit() {
    var yql = "https://query.yahooapis.com/v1/public/yql?q=select wind from weather.forecast where woeid in (select woeid from geo.places(1) where text='chicago, il')&format=json&callback=yqlCallback";

    return this.http.get(yql,{
       // headers : headers
    }).subscribe(res => {
      console.log("Response came!!!");
      console.log(res);
    })
  }

}
