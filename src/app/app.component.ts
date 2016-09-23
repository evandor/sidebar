import { Component } from '@angular/core';
import { AppState } from './app.service';

//import { AwsUtil } from "./services/aws.service";
//import { UserRegistrationService, UserLoginService } from "./services/cognito.service";


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  template: `<router-outlet></router-outlet>`
  
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor() {
  }

  ngOnInit() {
  }
}



/*@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.style.css'],
  template: `<router-outlet></router-outlet>`
})
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor() {
  }

  ngOnInit() {
  }

}*/
