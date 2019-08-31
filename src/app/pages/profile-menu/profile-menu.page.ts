import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { ActivatedRoute } from '@angular/router';
import { UserDetails } from 'src/app/interfaces/user-details';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.page.html',
  styleUrls: ['./profile-menu.page.scss'],
})
export class ProfileMenuPage implements OnInit {
  private userDetailsId: string = null;
  public userDetails: UserDetails = {};
  private loading: any;
  private userDetailsSubscription: Subscription;

  constructor(
    private userDetailsService: UserDetailsService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    let users = this.userDetailsService.getUsers();
    users.forEach(user => {
      user.forEach(u => {
        if(u.user_id == this.authService.getAuth().currentUser.uid) {
          this.userDetails.name = u.name;
          this.userDetails.phone = u.phone;
          this.userDetails.user_id = u.user_id;
          this.userDetailsId = u.id;
        }
      });
    });

    if (this.userDetailsId) this.loadUserDetails();
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.userDetailsSubscription) this.userDetailsSubscription.unsubscribe();
  }

  loadUserDetails() {
    this.userDetailsSubscription = this.userDetailsService.getUser(this.userDetailsId).subscribe(data => {
      this.userDetails = data;
    });
  }
 
 
  async saveUser() {
    await this.presentLoading();
 
 
    this.userDetails.user_id = this.authService.getAuth().currentUser.uid;
 
 
    if (this.userDetailsId) {
      try {
        await this.userDetailsService.updateUser(this.userDetailsId, this.userDetails);
        await this.loading.dismiss();
 
 
        this.navCtrl.navigateBack('/home/profile-menu');
        this.presentToast('Dados salvos');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    } else {
      try {
        await this.userDetailsService.addUser(this.userDetails);
        await this.loading.dismiss();
 
 
        this.navCtrl.navigateBack('/home');
      } catch (error) {
        this.presentToast('Erro ao tentar salvar');
        this.loading.dismiss();
      }
    }
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
 
 
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
