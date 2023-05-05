import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/services/localStorage/local-storage.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class CardDetailsPage implements OnInit {
  public obj!: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public localStorageService: LocalStorageService,
    private router: Router
  ) {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    console.log(id);
    this.obj = this.localStorageService.onFindById(id);
    console.log(this.obj);
  }

  ngOnInit() {}

  onClose() {
    this.router.navigate(['tabs', 'tab2']);
  }

  async onDelete(){
    // pass to localStorage Service
    // redirect
    await this.localStorageService.onRemove(this.obj);
    this.router.navigate(['tabs', 'tab2'])
  }
}
