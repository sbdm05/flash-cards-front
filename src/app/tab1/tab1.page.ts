import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, IonSpinner, ToastController } from '@ionic/angular';
import { promises } from 'dns';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/services/localStorage/local-storage.service';
import { MetApiService } from 'src/services/metAPI/met-api.service';
import { OpenaiService } from 'src/services/openai/openai.service';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormComponent } from '../shared/components/form/form.component';
import { SanitizerPipe } from '../utils/sanitizer.pipe';

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
    SanitizerPipe,
  ],
})
export class Tab1Page {
  public img!: any;
  public explanation!: any;
  public isRevealed = false;
  public isBtnInterestingVisible = false;
  public linksSuggested = new BehaviorSubject<any[]>([]);
  public isMoreInfo = false;
  public getExplanation!: Subscription;

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
      this.getExplanation = this.metApiService
        .getExplanation()
        .subscribe((explanation) => {
          this.explanation += (this.explanation ? ' ' : '') + explanation;
          console.log(this.explanation)
        });
    });
  }

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
    this.getExplanation.unsubscribe();
    this.isRevealed = false;
    this.isBtnInterestingVisible = false;
    this.isMoreInfo = false;
    this.img = '';
    this.metApiService.refresh().subscribe((item) => {
      //console.log(item);
      this.img = item;
      console.log(this.img);
      this.getExplanation = this.metApiService
        .getExplanation()
        .subscribe((explanation) => {
          this.explanation += (this.explanation ? ' ' : '') + explanation;
        });
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
      console.log(data.body);
    });
  }

  // onMore() {
  //   this.isMoreInfo = false;
  //   this.metApiService.askSimilarArtistOpenAI(this.img).subscribe((data) => {
  //     console.log(data.body, 'data depuis onMore');
  //     this.linksSuggested.next([data.body]);
  //     console.log(this.linksSuggested)
  //   });
  // }

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
    this.localStorageSubscription.unsubscribe();
    this.getExplanation.unsubscribe();
  }
}
