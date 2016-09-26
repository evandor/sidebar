import { Component, OnInit, NgZone } from '@angular/core';
import { Sidebar } from '../domain/sidebar';
import { DynamoDBService } from '../services/dynamodb.service';
import { GoogleService } from '../services/google.service';
import { AWSService } from '../services/aws.service';

declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon´

@Component({
  selector: 'app-sidebars',
  templateUrl: './sidebars.component.html',
  styleUrls: ['./sidebars.component.css'],
  providers: [GoogleService, AWSService]
})
export class SidebarsComponent {

  sidebars: Array<Sidebar> = [];
  googleLoginButtonId = "google-login-button";
  
  constructor(private _zone: NgZone, private googleService: GoogleService, private awsService: AWSService) { }

  ngAfterViewInit() {
    this.googleService.init(this.onGoogleLoginSuccess);
  }

  onGoogleLoginSuccess = (loggedInUser) => {
    //this.authenticated = true;
    this._zone.run(() => {
      this.awsService.handleCredentials(loggedInUser);
      var ctx = this;
      AWS.config.credentials.get(function (err) {
        if (!err) {
          var id = AWS.config.credentials.identityId;
          console.log("###Cognito Identity Id:", id);
          DynamoDBService.getSidebars(id, ctx.sidebars);
        }
      });
    });
  }

}
