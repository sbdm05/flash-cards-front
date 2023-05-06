import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, IonSpinner, ToastController } from '@ionic/angular';
import { promises } from 'dns';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/services/localStorage/local-storage.service';
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
  public isBtnInterestingVisible = false;
  public isMoreInfo = false;

  public localStorageTab!: any[];
  public localStorageSubscription!: Subscription;

  constructor(
    private openAiService: OpenaiService,
    private metApiService: MetApiService,
    private localStorageService: LocalStorageService,
    public toastController: ToastController
  ) {
    // this.metApiService.refresh().subscribe((item) => {
    //   // console.log(item);
    //   this.img = item;
    // });
    // subscribe to explanation$
    // this.metApiService.explanation$.subscribe((data) => {
    //   this.explanation = data;
    // });

    this.metApiService.getExplanation().subscribe((explanation) => {
      this.explanation += (this.explanation ? ' ' : '') + explanation;
    });

    // subscribe to localStorage observable
    this.localStorageSubscription =
      this.localStorageService.updatedStorage$.subscribe((data) => {
        console.log(data, 'updated localstorage');
      });
  }

  ngOnInit() {
    console.log('test depuis ionviewenter');
    this.img = '';
    this.explanation = '';
    this.isRevealed = false;
    //console.log(this.img);
    this.metApiService.refresh().subscribe((item) => {
      // console.log(item);

      this.img = item;
    });
  }

  ionViewDidEnter() {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Saved in your favorites',
      duration: 2000,
    });
    toast.present();
  }

  public onNext() {
    //console.log('next');
    this.explanation = '';
    this.isRevealed = false;
    this.isBtnInterestingVisible = false;
    this.isMoreInfo = false;
    this.metApiService.refresh().subscribe((item) => {
      //console.log(item);
      this.img = item;
      console.log(this.img);
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
    this.isBtnInterestingVisible = true;
  }

  onInteresting() {
    console.log(this.img, 'from on interesting');
    this.isBtnInterestingVisible = false;
    this.isMoreInfo = true;
    this.metApiService.askInterestOpenAI(this.img).subscribe((data) => {
      console.log(data);
    });
  }

  onMore() {
    this.isMoreInfo = false;
    this.metApiService.askSimilarArtistOpenAI(this.img).subscribe((data) => {
      console.log(data);
    });
  }

  onLike() {
    console.log(this.img.objectID, 'thisimg');
    //console.log(this.explanation, 'explanation');
    if (this.explanation !== '' && this.img.objectID) {
      const objSaved = {
        objDetail: this.img,
        explanation: this.explanation,
      };
      console.log(objSaved);
      this.localStorageService.onAdd(objSaved);
      this.presentToast();
    }
  }

  public onDestroy() {
    console.log('ondestroy');
    // TODO VERIFIER SI DECLENCHE, SINON PLACER DANS AUTRE METHODE
    this.localStorageSubscription.unsubscribe();
  }
}
