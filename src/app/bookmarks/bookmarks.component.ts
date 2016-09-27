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
