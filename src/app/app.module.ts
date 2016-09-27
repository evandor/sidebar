import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Frames2 } from './frames';

import { routing, appRoutingProviders }  from './app.routing';
import { SidebarsComponent } from './sidebars/sidebars.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { AboutComponent } from './about/about.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FaqComponent } from './faq/faq.component';

@NgModule({
  declarations: [
    AppComponent,
    Frames2,
    SidebarsComponent, 
    BookmarksComponent, AboutComponent, SidebarComponent, FaqComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
