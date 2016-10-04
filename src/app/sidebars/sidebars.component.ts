import { Component, OnInit, NgZone } from '@angular/core';
import { Sidebar } from '../domain/sidebar';
import { Category } from '../domain/category';
import { Bookmark } from '../domain/bookmark';
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
 
  authenticated = false;
  sidebars: Array<Sidebar> = [];
  categories: Array<Category> = [];
  bookmarks: Array<Bookmark> = [];
  googleLoginButtonId = "google-login-button";
  
  private newSidebar: Sidebar = new Sidebar();
  
  constructor(private _zone: NgZone, private googleService: GoogleService, private awsService: AWSService) { }

  ngAfterViewInit() {
    this.googleService.init(this.onGoogleLoginSuccess);
  }

  onGoogleLoginSuccess = (loggedInUser) => {
    this.authenticated = true;
    this._zone.run(() => {
      this.awsService.handleCredentials(loggedInUser);
      var ctx = this;
      AWS.config.credentials.get(function (err) {
        if (!err) {
          DynamoDBService.getSidebars(AWS.config.credentials.identityId, ctx.sidebars);
        }
      });
    });
  }

  setSidebar(sidebar: string) {
    this.categories = new Array<Category>();
    var ctx = this;
    AWS.config.credentials.get(function (err) {
        if (!err) {
          DynamoDBService.getCategories(sidebar, ctx.categories);
        }
      });
  }

  setCategory(category: string) {
    this.bookmarks = new Array<Bookmark>();
    var ctx = this;
    AWS.config.credentials.get(function (err) {
        if (!err) {
         DynamoDBService.getBookmarks(category, ctx.bookmarks);
        }
      });
  }

  onSubmit() {
    var ctx = this;
    AWS.config.credentials.get(function (err) {
        if (!err) {
         //DynamoDBService.getBookmarks(category, ctx.bookmarks);
         DynamoDBService.createSidebar(AWS.config.credentials.identityId, ctx.newSidebar);
        }
      });
  }

}
