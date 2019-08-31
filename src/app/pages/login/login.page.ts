import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { UserDetails } from 'src/app/interfaces/user-details';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserDetailsService } from 'src/app/services/user-details.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public userLogin: User = {};
  public userRegister: User = {};
  public userDetailsRegister: UserDetails = {};
  public errorMessage = "";

  private loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router,
    private userDetails: UserDetailsService
  ) { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    if(event.detail.value==="login") {
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
  }

  async login () {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
      this.router.navigateByUrl("/home");
    } catch (error) {
      let msg = "";
      switch (error.code) {
        case "auth/wrong-password":
          msg= "Email ou senha inválido.";
          break;

        case "auth/user-not-found":
          msg= 'Usuário não encontrado';
          break;

        case "auth/invalid-email":
          msg= 'Email ou senha inválido.';
          break;
        }

      this.errorMessage = msg;
    } finally {
      this.loading.dismiss();
    }
  }

  async register () {
    await this.presentLoading();
    
    try {
      await this.authService.register(this.userRegister);
      this.userLogin = this.userRegister;
      await this.authService.login(this.userLogin);
      this.userDetailsRegister.user_id = this.authService.getAuth().currentUser.uid;
      await this.userDetails.addUser(this.userDetailsRegister);
      this.router.navigateByUrl("/home");
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading () {
    this.loading = await this.loadingCtrl.create({message: 'Aguarde!'});
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
