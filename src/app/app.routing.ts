import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Frames2 } from './frames';
import { SidebarsComponent } from './sidebars/sidebars.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
//import { NoContent } from './no-content';

//import { DataResolver } from './app.resolver';



const appRoutes: Routes = [
  { path: '',                   component: Frames2 },
  { path: 'manage',             component: SidebarsComponent },
  { path: 'addurl',             component: BookmarksComponent },
  { path: 'addurl/:category',   component: BookmarksComponent },
  { path: 'frames2',            component: Frames2 },
  { path: 'sidebars/:sidebar',  component: Frames2 },
  { path: '**',                 component: Frames2 }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


/*export const ROUTES: Routes = [
  { path: '',                  component: Frames2 },
  { path: ':sidebar',          component: Frames2 },
  { path: 'frames',            component: Frames },
  { path: 'frames/:sidebar',   component: Frames },
  { path: 'frames2',           component: Frames2 },
  { path: 'frames2/:sidebar',  component: Frames2 },
  //{ path: 'sidebar',           component: Sidebar },
  { path: 'sidebars/:sidebar', component: Frames2 },
  //{ path: 'sidebars',          component: Sidebars },
  { path: '**',                component: Frames2 },
];*/
