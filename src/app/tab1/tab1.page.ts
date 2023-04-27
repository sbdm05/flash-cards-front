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

  constructor(
    private openAiService: OpenaiService,
    private metApiService: MetApiService
  ) {
     
  }

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
        "Chaque question/ réponse sera dans son propre objet dans un tableau au format array javascript. Pour chaque question/réponse tu fourniras la source où tu as trouvé l'information. Fournis uniquement le tableau entre crochets [], sans texte avant",
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
}
