import { Component, NgZone, OnInit, OnDestroy, Input, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DynamoDBService } from '../services/dynamodb.service';
import { AppState } from '../domain/appstate';
import { Sidebar } from '../domain/sidebar';
import { Category } from '../domain/category';

import { UUID } from 'angular2-uuid';

declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon

declare var jQuery: any;

@Component({
  selector: 'sidebar',
  styleUrls: ['sidebar.component.css'],
  templateUrl: 'sidebar.component.html',
  animations: [
    trigger('heroState', [
      state('inactive', style({
        backgroundColor: 'white',
        width: '200px'
      })),
      state('active', style({
        backgroundColor: 'gray',
        width: '800px'
      })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  localState;
  googleLoginButtonId = "google-login-button";
  userDisplayName = "not logged in...";
  userPic = "";
  userAuthToken = null;
  appstate: AppState;
  authenticated: boolean = false;

  localBMsIdent = 'localBMs';
  localBMs = new Array<Category>();

  localCategoriesIdent = 'localCats';
  localCategories = new Array<string>();


  private sub: Subscription;
  bookmarks: Array<any> = [];
  private url: SafeResourceUrl;
  sidebars: Array<Sidebar> = [];

  private currentSidebarUuid: string = "local";
  private currentCategoryUuid: string = null;

  constructor(public route: ActivatedRoute, private domSanitizer: DomSanitizer, private _zone: NgZone) {
    this.appstate = new AppState();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['sidebar'] != null) {
        this.currentSidebarUuid = params['sidebar'];
      }
    });
    var localCatsAsString = localStorage.getItem(this.localCategoriesIdent);
    if (localCatsAsString != null) {
      this.localCategories = JSON.parse(localCatsAsString);
    }
    var localBMsAsString = localStorage.getItem(this.localBMsIdent);
    if (localBMsAsString != null) {
      this.localBMs = JSON.parse(localBMsAsString);
      this.loadAccordion();
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
    jQuery("#accordion").accordion({
      collapsible: true,
      heightStyle: "content"
    });
    jQuery("#anonymousSidebar").accordion({
      collapsible: true,
      heightStyle: "content"
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchBookmarks(id) {
    console.log("fetching bookmarks for sidebar " + id);
    DynamoDBService.getBookmarks(id, this.bookmarks);
  }

  onGoogleLoginSuccess = (loggedInUser) => {
    this.authenticated = true;
    this._zone.run(() => {
      this.userAuthToken = loggedInUser.getAuthResponse().id_token;
      this.userDisplayName = loggedInUser.getBasicProfile().getName();
      this.userPic = loggedInUser.getBasicProfile().getImageUrl();

      var creds = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:88e07f6a-eb58-4b3a-aa93-a45a7a1d5edd",
        Logins: {
          'accounts.google.com': this.userAuthToken
        }
      })
      AWS.config.update({
        region: 'us-east-1',
        credentials: creds
      });
      var ctx = this;
      AWS.config.credentials.get(function (err) {
        if (!err) {
          var id = AWS.config.credentials.identityId;
          ctx.fetchBookmarks("d56cc24e-6326-4d11-90f6-44c5c997f5c3");
          DynamoDBService.getSidebars(id, ctx.sidebars);
        }
      });

    });

  }

  loadAccordion() {
    jQuery("#accordion3").accordion({
      collapsible: true,
      heightStyle: "content"
    });
    jQuery("#accordion4").accordion({
      collapsible: true,
      heightStyle: "content"
    });
  }

  getCategoryCode(cat: Category) {
    return "<h3>" + cat.bucketname + "</h3><div><div><a href='/assets/static/index.html' target='content'>sidebar home</a></div></div>";
  }

  signOut() {
    console.log("signing out...");
    var auth2 = gapi.auth2.getAuthInstance();
    var context = this;
    auth2.signOut().then(function () {
      console.log('User signed out.');
      context._zone.run(() => {
        context.userDisplayName = "logged out";
        context.authenticated = false;
      });
    });
  }

  createCategory(id: string, value: string) {
    if (this.localCategories.indexOf(value) > -1) {
      console.log("local Category " + value + " already exists");
      return;
    }
    var cat = new Category();
    cat.bucketname = value;
    cat.uuid = UUID.UUID();
    this.localBMs.push(cat);
    localStorage.setItem(this.localBMsIdent, JSON.stringify(this.localBMs));
    this.currentCategoryUuid = cat.uuid;
  }

  setCat(category: Category) {
    console.log(category.uuid);
    this.currentCategoryUuid = category.uuid;
  }
}
