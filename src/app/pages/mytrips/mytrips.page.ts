import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/interfaces/trip';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mytrips',
  templateUrl: './mytrips.page.html',
  styleUrls: ['./mytrips.page.scss'],
})
export class MyTripsPage implements OnInit {
  private loading: any;
  public mytrips = new Array<Trip>();
  private tripsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private tripService: TripService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.tripsSubscription = this.tripService.getTrips().subscribe(data => {
      this.mytrips = data;
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.tripsSubscription.unsubscribe();
  }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
      this.router.navigateByUrl("/login");
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }

  async deleteTrip(id: string) {
    try {
      await this.tripService.deleteTrip(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
