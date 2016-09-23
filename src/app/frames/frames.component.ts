import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'about',
  styleUrls: ['frames.style.css'],
  templateUrl: 'frames.template.html'
})
export class Frames  implements OnInit, OnDestroy   {
  localState;
  private sub: Subscription;
  private uuid: string = "d56cc24e-6326-4d11-90f6-44c5c997f5c3";
  private url: SafeResourceUrl;

  constructor(public route: ActivatedRoute, private domSanitizer : DomSanitizer) {
  }

  ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['sidebar'];
      console.log("params: " + this.uuid);
      this.url = this.domSanitizer.bypassSecurityTrustResourceUrl('/sidebar/' + this.uuid);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
