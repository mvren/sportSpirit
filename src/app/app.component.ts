import {Component, QueryList, ViewChildren} from '@angular/core';

import {
    AlertController,
    IonRouterOutlet,
    NavController,
    Platform,
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TimerService} from './services/timer/timer.service';
import {Storage} from '@ionic/storage';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'History',
            url: '/history',
            icon: 'list'
        }
    ];

    @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private navCtrl: NavController,
        private alertController: AlertController,
        private timer: TimerService,
        private storage: Storage,
        private afAuth: AngularFireAuth
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleBlackTranslucent();
            this.splashScreen.hide();

            this.backButtonEvent();

            this.platform.resume.subscribe(() => {

                if(this.timer.getVariables().timerStarted)
                    this.timer.recalculateTimer();

            });
        });
    }

    backButtonEvent() {
        this.platform.backButton.subscribe(async () => {

            this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
                if (outlet && outlet.canGoBack()) {
                    outlet.pop();

                } else {
                    if(!this.timer.getVariables().workoutStarted)
                        navigator['app'].exitApp();
                }
            });
        });
    }

    logOut(){
        this.presentLogOutConfirm();
    }

    async presentLogOutConfirm() {
        const alert = await this.alertController.create({
            header: 'Log out',
            message: 'Are you sure that you want to log out?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Yes',
                    handler: () => {

                        this.afAuth.auth.signOut();

                        this.storage.set('sportSpirit.userId', '');
                        this.timer.stop(false);
                        this.navCtrl.navigateRoot('/login');

                    }
                }
            ]
        });

        await alert.present();
    }
}
