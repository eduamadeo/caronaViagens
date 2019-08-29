import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children:
      [
        {
          path: 'trips',
          children:
            [
              {
                path: '',
                loadChildren: '../trips/trips.module#TripsPageModule'
              }
            ]
        },
        {
          path: 'mytrips',
          children:
            [
              {
                path: '',
                loadChildren: '../mytrips/mytrips.module#MyTripsPageModule'
              }
            ]
        },
        {
          path: 'profile-menu',
          children:
            [
              {
                path: '',
                loadChildren: '../profile-menu/profile-menu.module#ProfileMenuPageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: '/home/trips',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/home/trips',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class HomePageRoutingModule {}