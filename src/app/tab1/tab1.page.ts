import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, IonSpinner } from '@ionic/angular';
import { promises } from 'dns';
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
  public explanation !: string;

  constructor(
    private openAiService: OpenaiService,
    private metApiService: MetApiService
  ) {}

  // getItem() {
  //   this.img = '';
  //    this.metApiService.getRandomItem().subscribe((item) => {
  //      console.log(item);
  //      this.img = item;
  //    });
  // }

  public messages = [
    {
      role: 'system',
      content:
        'The response should start directly with the answer without you telling me anything else.',
    },
  ];

  ionViewWillEnter() {
    this.img = '';
    console.log(this.img);
    this.metApiService.refresh().subscribe((item) => {
      console.log(item);
      this.img = item;
    });
  }

  // onSubmit(obj: any) {
  //   console.log(obj);
  //   const { category, quizzlength } = obj;
  //   const newMessage = `Peux tu me fournir un tableau au format array javascript sur ${category} de ${quizzlength} questions`;
  //   this.messages = [...this.messages, { role: 'user', content: newMessage }];

  //   this.openAiService.getCollection(this.messages).subscribe(data=>{
  //     console.log(data);
  //     const {chatGPTMessage} = data;
  //     const tempTab = chatGPTMessage.content.split('javascript')
  //     console.log(tempTab)

  //   });
  // }

  onExplain(title: string, painter: string, period: string) {
    const newMessage = `Can you explain to a total beginner in painting the painting ${title} from ${painter}, painted in ${period}. The response should start directly with the answer without you telling me anything else.`;
    this.messages = [...this.messages, { role: 'user', content: newMessage }];
    this.openAiService.getCollection(this.messages).subscribe((data) => {
      console.log(data);
      const { chatGPTMessage } = data;
      this.explanation = chatGPTMessage.content;
      //console.log(tempTab);
    });
  }
}
