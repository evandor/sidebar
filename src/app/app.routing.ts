import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarsComponent } from './sidebars/sidebars.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';

//import { NoContent } from './no-content';

//import { DataResolver } from './app.resolver';



const appRoutes: Routes = [
  { path: '',                   component: SidebarComponent },
  { path: 'manage',             component: SidebarsComponent },
  { path: 'about',              component: AboutComponent },
  { path: 'help',               component: SidebarsComponent },
  { path: 'faq',                component: FaqComponent },
  { path: 'addurl',             component: BookmarksComponent },
  { path: 'sidebar',                                  component: SidebarComponent },
  { path: 'sidebars/:sidebar/categories/:category',   component: BookmarksComponent },
  { path: 'sidebars/:sidebar',                        component: SidebarComponent },
  { path: '**',                                       component: SidebarComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
