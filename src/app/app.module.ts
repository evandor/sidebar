import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Frames2 } from './frames';


import { routing, appRoutingProviders }  from './app.routing';
import { SidebarsComponent } from './sidebars/sidebars.component';

@NgModule({
  declarations: [
    AppComponent,
    Frames2,
    SidebarsComponent
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
