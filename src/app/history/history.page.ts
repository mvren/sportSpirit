import { Component, OnInit } from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

    activities: any = [];

    constructor(
        private storage: Storage
    ) {

    }

    ngOnInit() {
        this.storage.get('sportSpirit.activities').then(data => {

            data.forEach((value: any) => {
                value.totalTime = '';
                if(value.timer.hours > 0){
                    value.totalTime += value.timer.hours + 'h ';
                }

                if(value.timer.minutes > 0)
                    value.totalTime += value.timer.minutes + 'm ';

                if(value.timer.hours < 1){
                    value.totalTime += value.timer.seconds + 's ';
                }

                value.img = value.type == 1 ? 'assets/img/running.png' : 'assets/img/cycling.png'
            });

            this.activities = data;

        })
    }

}