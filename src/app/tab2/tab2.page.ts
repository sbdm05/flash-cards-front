import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/services/localStorage/local-storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab2Page {
  public collection$!: Observable<any>;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.collection$ = this.localStorageService.updatedStorage$;
  }

  onOpen(img: any) {
    console.log(img.objDetail.objectID);

    this.router.navigate(['tabs', 'card-details', img.objDetail.objectID]);
  }
}
