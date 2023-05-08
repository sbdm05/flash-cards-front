import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.page.html',
  styleUrls: ['./loader.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ExploreContainerComponent]
})
export class LoaderPage implements OnInit {

  constructor(private router: Router) {
    setTimeout(()=>{
      this.router.navigate(['tabs', 'tab1']);
    }, 2000)
  }

  ngOnInit() {
  }

}
