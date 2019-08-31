import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/services/trip.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { UserDetails } from 'src/app/interfaces/user-details';
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
  private userDetailsId: string = null;
  public userDetails: UserDetails = {};
  private userDetailsSubscription: Subscription;


  constructor(
    private tripService: TripService,
    private userDetailsService: UserDetailsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.tripId = this.activatedRoute.snapshot.params['id'];


    if (this.tripId) this.loadTrip();

    let users = this.userDetailsService.getUsers();
    users.forEach(user => {
      user.forEach(u => {
        if (u.user_id == this.authService.getAuth().currentUser.uid) {
          this.userDetails.name = u.name;
          this.userDetails.phone = u.phone;
          this.userDetails.user_id = u.user_id;
          this.userDetailsId = u.id;
        }
      });
    });

    if (this.userDetailsId) this.loadUserDetails();
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

  loadUserDetails() {
    this.userDetailsSubscription = this.userDetailsService.getUser(this.userDetailsId).subscribe(data => {
      this.userDetails = data;
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
