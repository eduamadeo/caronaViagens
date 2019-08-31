import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { ActivatedRoute } from '@angular/router';
import { Trip } from 'src/app/interfaces/trip';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-edit-trip',
  templateUrl: './edit-trip.page.html',
  styleUrls: ['./edit-trip.page.scss'],
})
export class EditTripPage implements OnInit {
  private tripId: string = null;
  public trip: Trip = {};
  private loading: any;
  private tripSubscription: Subscription;
  public date;
  public time;

  constructor(
    private tripService: TripService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private datePicker: DatePicker
  ) {
    this.tripId = this.activatedRoute.snapshot.params['id'];


    if (this.tripId) this.loadTrip();
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.tripSubscription) this.tripSubscription.unsubscribe();
  }

  loadTrip() {
    this.tripSubscription = this.tripService.getTrip(this.tripId).subscribe(data => {
      this.trip = data;
    });
  }
 
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => this.date = date,
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  showTimePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => this.time = date,
      err => console.log('Error occurred while getting date: ', err)
    );
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
