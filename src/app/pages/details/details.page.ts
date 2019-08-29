import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { ActivatedRoute } from '@angular/router';
import { Trip } from 'src/app/interfaces/trip';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';


@Component({
 selector: 'app-details',
 templateUrl: './details.page.html',
 styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
 private tripId: string = null;
 public trip: Trip = {};
 private loading: any;
 private tripSubscription: Subscription;


 constructor(
   private tripService: TripService,
   private activatedRoute: ActivatedRoute,
   private navCtrl: NavController,
   private loadingCtrl: LoadingController,
   private authService: AuthService,
   private toastCtrl: ToastController
 ) {
   this.tripId = this.activatedRoute.snapshot.params['id'];


   if (this.tripId) this.loadTrip();
 }


 ngOnInit() { }


 ngOnDestroy() {
   if (this.tripSubscription) this.tripSubscription.unsubscribe();
 }


 loadTrip() {
   this.tripSubscription = this.tripService.getTrip(this.tripId).subscribe(data => {
     this.trip = data;
   });
 }


 async saveTrip() {
   await this.presentLoading();


   this.trip.userId = this.authService.getAuth().currentUser.uid;


   if (this.tripId) {
     try {
       await this.tripService.updateTrip(this.tripId, this.trip);
       await this.loading.dismiss();


       this.navCtrl.navigateBack('/home');
     } catch (error) {
       this.presentToast('Erro ao tentar salvar');
       this.loading.dismiss();
     }
   } else {
     this.trip.createdAt = new Date().getTime();


     try {
       await this.tripService.addTrip(this.trip);
       await this.loading.dismiss();


       this.navCtrl.navigateBack('/home');
     } catch (error) {
       this.presentToast('Erro ao tentar salvar');
       this.loading.dismiss();
     }
   }
 }


 async presentLoading() {
   this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
   return this.loading.present();
 }


 async presentToast(message: string) {
   const toast = await this.toastCtrl.create({ message, duration: 2000 });
   toast.present();
 }
}
