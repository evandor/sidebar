import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Frames2 } from './frames';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarsComponent } from './sidebars/sidebars.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { AboutComponent } from './about/about.component';

//import { NoContent } from './no-content';

//import { DataResolver } from './app.resolver';



const appRoutes: Routes = [
  { path: '',                   component: SidebarComponent },
  { path: 'manage',             component: SidebarsComponent },
  { path: 'about',              component: AboutComponent },
  { path: 'help',               component: SidebarsComponent },
  { path: 'faq',                component: SidebarsComponent },
  { path: 'addurl',             component: BookmarksComponent },
  { path: 'addurl/:category',   component: BookmarksComponent },
  { path: 'frames2',            component: Frames2 },
  { path: 'sidebar',            component: SidebarComponent },
  { path: 'sidebars/:sidebar',  component: Frames2 },
  { path: '**',                 component: SidebarComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
