import { Component, NgZone, OnInit, OnDestroy, Input, trigger, state, style, transition, animate } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Bookmark } from '../domain/bookmark';
import { Category } from '../domain/category';

import { DynamoDBService } from '../services/dynamodb.service';
import { AWSService } from '../services/aws.service';
import { GoogleService } from '../services/google.service';

declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon

declare var jQuery: any;

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.css'],
  providers: [GoogleService, AWSService]
})
export class BookmarksComponent implements OnInit {

  private sub: Subscription;
  private currentCategoryUuid: string = null;
  private currentSidebarUuid: string = null;
  private bookmark: Bookmark = new Bookmark();
  private message: string = "";

  googleLoginButtonId = "google-login-button";

  localBMsIdent = 'localBMs';
  localBMs = new Array<Category>();

  categories: Array<Category> = [];

  constructor(public route: ActivatedRoute, private _zone: NgZone, private awsService: AWSService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.currentCategoryUuid = params['category'];
      this.currentSidebarUuid = params['sidebar'];
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
    jQuery("#tags").textext({
      plugins: 'tags'
    });
  }

  onGoogleLoginSuccess = (loggedInUser) => {
    //this.authenticated = true;
    this._zone.run(() => {
      this.awsService.handleCredentials(loggedInUser);
      var ctx = this;
      AWS.config.credentials.get(function (err) {
        if (!err) {
          //DynamoDBService.getSidebars(AWS.config.credentials.identityId, ctx.sidebars);
        }
      });
    });
  }


  onSubmit() {
    if (this.currentSidebarUuid == 'local') {
      this.handleLocalSidebar();
    } else if (this.currentSidebarUuid == null) {
      this.message = "sidebar uuid is null!";
      return;
    } else {
      this.handleRemoteSidebar();
    }
    /*this._zone.runOutsideAngular(() => {
      location.reload();
    });*/
  }

  handleLocalSidebar() {
    let result: Category = this.localBMs.filter(item => item.uuid == this.currentCategoryUuid)[0] as Category;
    if (result != null) {
      //this.localBMs.indexOf(result);
      if (result.bookmarks == null) {
        result.bookmarks = new Array<Bookmark>();
      }
      console.log("submitting...");
      result.bookmarks.push(this.bookmark);
      localStorage.setItem(this.localBMsIdent, JSON.stringify(this.localBMs));
      this.bookmark = new Bookmark();
    } else {
      this.message = "could not find local bookmark category for uuid " + this.currentCategoryUuid;
    }
  }

  handleRemoteSidebar() {
    var ctx = this;
    AWS.config.credentials.get(function (err) {
      if (!err) {
        DynamoDBService.getCategories2(ctx.currentSidebarUuid, function onQuery(err, data) {
          if (err) {
            console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            data.Items.forEach(function (category) {
              if (category.uuid == ctx.currentCategoryUuid) {
                console.log(category);
                if (category.bookmarks == null) {
                  console.log("new array of bookmarks");
                  category.bookmarks = new Array<Bookmark>();
                } else {
                  category.bookmarks = JSON.parse(category.bookmarks);
                }
                console.log("submitting...");
                console.log(category.bookmarks);
                console.log(ctx.bookmark);
                console.log("go...");
                category.bookmarks.push(ctx.bookmark);
                DynamoDBService.updateCategory(ctx.currentSidebarUuid, category);
              }
              //mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid, bookmarks: logitem.bookmarks });
            });
          }
        });
      }
    });
  }
}
