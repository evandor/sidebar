import { Component, NgZone, OnInit, OnDestroy, Input, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { AppState } from '../domain/appstate';
import { Sidebar } from '../domain/sidebar';
import { Category } from '../domain/category';


import { DynamoDBService } from '../services/dynamodb.service';
import { BookmarksService } from '../services/bookmarks.service';
import { AWSService } from '../services/aws.service';
import { GoogleService } from '../services/google.service';

import { UUID } from 'angular2-uuid';

declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon

declare var jQuery: any;

@Component({
  selector: 'app-firefox',
  templateUrl: './firefox.component.html',
  styleUrls: ['./firefox.component.css'],
  providers: [GoogleService, AWSService]
})
export class FirefoxComponent implements OnInit {

  googleLoginButtonId = "google-login-button";

  authenticated: boolean = false;

  localBMsIdent = 'localBMs';
  localBMs = new Array<Category>();

  localCategoriesIdent = 'localCats';
  localCategories = new Array<string>();

  userDisplayName = "not logged in...";
  userPic = "";
  userAuthToken = null;

  private sub: Subscription;
  bookmarks: Array<any> = [];
  private url: SafeResourceUrl;
  sidebars: Array<Sidebar> = [];

  private currentSidebarUuid: string = "local";
  private currentCategoryUuid: string = null;

  private sidebarTitle = "the bookmark manager";

  constructor(public route: ActivatedRoute, private _zone: NgZone, private awsService: AWSService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['sidebar'] != null) {
        this.currentSidebarUuid = params['sidebar'];
        this.sidebarTitle = this.currentSidebarUuid;
      }
    });
    var localCatsAsString = localStorage.getItem(this.localCategoriesIdent);
    if (localCatsAsString != null) {
      this.localCategories = JSON.parse(localCatsAsString);
    }
    var localBMsAsString = localStorage.getItem(this.localBMsIdent);
    if (localBMsAsString != null) {
      this.localBMs = JSON.parse(localBMsAsString);
      //this.loadAccordion();
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
      heightStyle: "content",
      active: false
    });
    jQuery("#anonymousSidebar").accordion({
      collapsible: true,
      heightStyle: "content"
    });
  }

  fetchBookmarks(id) {
    console.log("fetching bookmarks for sidebar " + id);
    BookmarksService.getBookmarks(id, this.bookmarks);
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
      if (this.currentSidebarUuid != 'local') {
        var ctx = this;
        AWS.config.credentials.get(function (err) {
          if (!err) {
            var id = AWS.config.credentials.identityId;
            ctx.fetchBookmarks(ctx.currentSidebarUuid);
            //DynamoDBService.getSidebars(id, ctx.sidebars);
            DynamoDBService.getSidebars2(id, function onQuery(err, data) {
              if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
              } else {
                data.Items.forEach(function (logitem) {
                  ctx.sidebars.push({ sidebarName: logitem.sidebarName, uuid: logitem.uuid, userId: logitem.userId, selected: false });
                  if (logitem.uuid == ctx.currentSidebarUuid) {
                    ctx.sidebarTitle = logitem.sidebarName;
                  }
                });
                ctx.loadAccordion();
              }
            })
          }
        });
      }
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

  setCat(category: Category) {
    console.log(category.uuid);
    this.currentCategoryUuid = category.uuid;
  }


}


