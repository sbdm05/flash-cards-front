import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  filter,
  map,
  Observable,
  retry,
  retryWhen,
  Subject,
  take,
  tap,
} from 'rxjs';
import { filteredId } from 'src/app/datas/filteredId/filtered-id';
import { environment } from 'src/environments/environment';
import { OpenaiService } from '../openai/openai.service';

@Injectable({
  providedIn: 'root',
})
export class MetApiService {
  private urlApi: string = environment.urlApi;

  public filteredTab = filteredId;
  // public randomId!: number;

  // public id$ = new Subject(
  // );
  public collection$ = new Subject();
  public id!: any;

  public messages = [
    {
      role: 'system',
      content:
        'The response should start directly with the answer without you telling me anything else.',
    },
  ];
  public explanation$ = new Subject();

  constructor(private http: HttpClient, private openAiService: OpenaiService) {}

  public refresh() {
    this.getRandomItem();
    return this.collection$;
  }

  public askOpenAI(data: any) {
    const newMessage = `Can you explain to a total beginner in painting the painting ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate}. The response should start directly with the answer without you telling me anything else.`;
    this.messages = [...this.messages, { role: 'user', content: newMessage }];
    this.openAiService.getCollection(this.messages).subscribe((data) => {
      console.log(data);
      const { chatGPTMessage } = data;
      this.explanation$.next(chatGPTMessage.content);
      //console.log(tempTab);
    });
  }

  public getRandomItem() {
    const id =
      this.filteredTab[Math.floor(Math.random() * this.filteredTab.length)];
    // get random id
    console.log('inside getrandomItem', id);

    this.http
      .get<any>(`${this.urlApi}/${id}`)
      .pipe(
        map((data) => {
          if (
            data.primaryImage !== '' &&
            data.department === 'European Paintings'
          ) {
            this.askOpenAI(data)
            return data;
          } else {
            console.log('problème');
            throw new Error();
          }
        })
      )
      .subscribe({
        next: (data) => this.collection$.next(data),
        error: (e) => this.getRandomItem(),
      });
  }
}
