import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'details', loadChildren: './pages/details/details.module#DetailsPageModule' },
  { path: 'details/:id', loadChildren: './pages/details/details.module#DetailsPageModule' },
  // { path: 'trips', loadChildren: './trips/trips.module#TripsPageModule' },
  // { path: 'mytrips', loadChildren: './mytrips/mytrips.module#MyTripsPageModule' },
  // { path: 'profile-menu', loadChildren: './profile-menu/profile-menu.module#ProfileMenuPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
