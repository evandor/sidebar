import { Component, NgZone, OnInit, OnDestroy, Input, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Bookmark } from '../domain/bookmark';
import { Category } from '../domain/category';

declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css']
})
export class BookmarksComponent implements OnInit {

  private sub: Subscription;

  private currentCategoryUuid: string = null;

  private bookmark: Bookmark = new Bookmark();

  googleLoginButtonId = "google-login-button";

  localBMsIdent = 'localBMs';
  localBMs = new Array<Category>();

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.currentCategoryUuid = params['category'];
    });
    var localBMsAsString = localStorage.getItem(this.localBMsIdent);
    if (localBMsAsString != null) {
      this.localBMs = JSON.parse(localBMsAsString);
    }
  }

  ngAfterViewInit() {
    gapi.signin2.render(
      this.googleLoginButtonId,
      {
        "onsuccess": this.onGoogleLoginSuccess,
        "scope": "profile",
        "theme": "dark",
        "onfailure": function (err) { console.log("error:" + err); }
      });
  }

  onGoogleLoginSuccess = (loggedInUser) => {
    /*this.authenticated = true;
    this._zone.run(() => {
      this.userAuthToken = loggedInUser.getAuthResponse().id_token;
      this.userDisplayName = loggedInUser.getBasicProfile().getName();
      this.userPic = loggedInUser.getBasicProfile().getImageUrl();
      AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: "us-east-1:88e07f6a-eb58-4b3a-aa93-a45a7a1d5edd",
          Logins: {
            'accounts.google.com': this.userAuthToken
          }
        })
      })
      //this.fetchBookmarks("d56cc24e-6326-4d11-90f6-44c5c997f5c3");
      //this.fetchSidebars("us-east-1:129ab219-08ca-4561-946f-938cb4027fb1"); // user

    });*/

  }


  onSubmit() {
    let result:Category = this.localBMs.filter(item => item.uuid == this.currentCategoryUuid)[0] as Category;
    if (result != null) {
      //this.localBMs.indexOf(result);
      if (result.bookmarks == null) {
        result.bookmarks = new Array<Bookmark>();
      }
      console.log("submitting...");
      result.bookmarks.push(this.bookmark);
      localStorage.setItem(this.localBMsIdent, JSON.stringify(this.localBMs));
    }
    this.bookmark = new Bookmark();
  }

}
