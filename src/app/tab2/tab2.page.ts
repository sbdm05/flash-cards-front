import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/services/localStorage/local-storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab2Page {
  public localStorageSubscription!: Subscription;
  public collection!: any[];
  isModalOpen = false;
  public currentObj$ = new BehaviorSubject('');
  public currentObj: any;

  constructor(private localStorageService: LocalStorageService) {
    // subscribe to localStorage
    // subscribe to localStorage observable
    this.localStorageSubscription =
      this.localStorageService.updatedStorage$.subscribe((data) => {
        // console.log(data, 'updated localstorage');

        this.collection = data;
      });
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }

  onOpen(img: any) {
    // console.log(img);
    this.currentObj$.next(img);
    this.currentObj = this.currentObj$.value;
    this.isModalOpen = true;
  }
}
