import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, IonSpinner } from '@ionic/angular';
import { promises } from 'dns';
import { Observable } from 'rxjs';
import { MetApiService } from 'src/services/metAPI/met-api.service';
import { OpenaiService } from 'src/services/openai/openai.service';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormComponent } from '../shared/components/form/form.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    ExploreContainerComponent,
    IonicModule,
    FormComponent,
    CommonModule,
  ],
})
export class Tab1Page {
  public img!: any;
  public explanation!: any;
  public isRevealed = false;
  public localStorageTab!: any[];

  constructor(
    private openAiService: OpenaiService,
    private metApiService: MetApiService
  ) {
    this.metApiService.refresh().subscribe((item) => {
      console.log(item);
      this.img = item;
    });
    // subscribe to explanation$
    this.metApiService.explanation$.subscribe((data) => {
      this.explanation = data;
    });

    // check if localStorage exists
    this.checkLocalStorageExists();
  }

  public checkLocalStorageExists() {
    if (localStorage.getItem('my-favorites-imgs')) {
      this.localStorageTab = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );
    } else {
      this.localStorageTab = [];
    }
  }

  public messages = [
    {
      role: 'system',
      content:
        'The response should start directly with the answer without you telling me anything else.',
    },
  ];

  ionViewWillEnter() {
    console.log('test depuis ionviewenter');
    this.img = '';
    this.explanation = '';
    this.isRevealed = false;
    console.log(this.img);
    this.metApiService.refresh().subscribe((item) => {
      console.log(item);
      this.img = item;
      this.checkLocalStorageExists();
    });
  }

  public onNext() {
    console.log('next');
    this.isRevealed = false;
    this.metApiService.refresh().subscribe((item) => {
      console.log(item);
      this.img = item;
    });
  }

  // onExplain(title: string, painter: string, period: string) {
  //   // const newMessage = `Can you explain to a total beginner in painting the painting ${title} from ${painter}, painted in ${period}. The response should start directly with the answer without you telling me anything else.`;
  //   // this.messages = [...this.messages, { role: 'user', content: newMessage }];
  //   // this.openAiService.getCollection(this.messages).subscribe((data) => {
  //   //   console.log(data);
  //   //   const { chatGPTMessage } = data;
  //   //   this.explanation = chatGPTMessage.content;
  //   //   //console.log(tempTab);
  //   // });

  // }
  onExplain() {
    // reveal
    this.isRevealed = true;
  }

  onLike() {
    console.log(this.img, 'thisimg');
    //console.log(this.explanation, 'explanation');
    const objSaved = {
      objDetail: this.img,
      explanation: this.explanation,
    };
    //console.log(objSaved);
    this.checkObjAlreadySaved(objSaved);
  }

  public checkObjAlreadySaved(objSaved: any) {
    console.log(this.localStorageTab);
    if (this.localStorageTab.length > 0) {
      const imgFound = this.localStorageTab.find(
        (item) => item.objDetail.objectID === objSaved.objDetail.objectID
      );
      console.log(imgFound, 'imgFound');
      if (imgFound) {
        console.log(imgFound, 'already exists');
        return;
      } else {
       console.log('new', objSaved.objDetail.objectID);
       this.localStorageTab.push(objSaved);
       localStorage.setItem(
         'my-favorites-imgs',
         JSON.stringify(this.localStorageTab)
       );
      }
    } else if (this.localStorageTab.length === 0) {
      console.log('new', objSaved.objDetail.objectID);
      this.localStorageTab.push(objSaved);
      localStorage.setItem(
        'my-favorites-imgs',
        JSON.stringify(this.localStorageTab)
      );
    }
  }
}
