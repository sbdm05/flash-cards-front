import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/services/localStorage/local-storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class Tab2Page {
  public localStorageSubscription!: Subscription;

  constructor(private localStorageService: LocalStorageService) {
    // subscribe to localStorage
    // subscribe to localStorage observable
    this.localStorageSubscription =
      this.localStorageService.updatedStorage$.subscribe((data) => {
        console.log(data, 'updated localstorage');
      });
  }
}
