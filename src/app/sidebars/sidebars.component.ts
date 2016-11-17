import { Component, OnInit, NgZone } from '@angular/core';
import { Sidebar } from '../domain/sidebar';
import { Category } from '../domain/category';
import { Bookmark } from '../domain/bookmark';
import { DynamoDBService } from '../services/dynamodb.service';
import { GoogleService } from '../services/google.service';
import { AWSService } from '../services/aws.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

declare var gapi: any; // Google's login API namespace
declare var AWS: any;  // Amazon´

@Component({
  selector: 'app-sidebars',
  templateUrl: './sidebars.component.html',
  styleUrls: ['./sidebars.component.css'],
  providers: [GoogleService, AWSService]
})
export class SidebarsComponent implements OnInit {
 
  authenticated = false;
  sidebars: Array<Sidebar> = [];
  categories: Array<Category> = [];
  bookmarks: Array<Bookmark> = [];
  googleLoginButtonId = "google-login-button";
  sub: Subscription;
  currentSidebarUuid: string;
  
  private newSidebar: Sidebar = new Sidebar();
  
  constructor(public route: ActivatedRoute, private _zone: NgZone, private googleService: GoogleService, private awsService: AWSService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['sidebar'] != null) {
        this.currentSidebarUuid = params['sidebar'];
      }
    });
  }

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
          ctx.sidebars.forEach(sb => {
            console.log(sb.uuid + "/" + ctx.currentSidebarUuid);
            if (sb.uuid == ctx.currentSidebarUuid) {
              sb.selected = true;
            }
          })
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
