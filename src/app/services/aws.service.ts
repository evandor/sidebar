import { Injectable, NgZone } from '@angular/core';
import { Sidebar } from '../domain/sidebar';


declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon

@Injectable()
export class AWSService {

  sidebars: Array<Sidebar> = [];

  constructor(private _zone: NgZone) { }

  init() {
   
  }

  handleCredentials(loggedInUser) {
      var userAuthToken = loggedInUser.getAuthResponse().id_token;
      var creds = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:88e07f6a-eb58-4b3a-aa93-a45a7a1d5edd",
        Logins: {
          'accounts.google.com': userAuthToken
        }
      })
      AWS.config.update({
        region: 'us-east-1',
        credentials: creds
      });
  }

}
