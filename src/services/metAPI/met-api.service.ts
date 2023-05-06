import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
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
  Subscription,
  take,
  tap,
} from 'rxjs';
import { filteredId } from 'src/app/datas/filteredId/filtered-id';
import { environment } from 'src/environments/environment';
import { OpenaiService } from '../openai/openai.service';
import { OpenAIStreamService } from '../openAIStream/open-aistream.service';

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
  private explanation$ = new BehaviorSubject<string>('');

  private subscription!: Subscription;

  constructor(
    private http: HttpClient,
    private openAiService: OpenaiService,
    private openAIStream: OpenAIStreamService
  ) {}

  public refresh() {
    this.getRandomItem();
    return this.collection$;
  }

  public askOpenAI(data: any) {
    // console.log(data)
    //const newMessage = `Can you explain to a total beginner in painting the painting ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate}. The response should start directly with the answer without you telling me anything else.`;
    //console.log(typeof newMessage)
    // this.messages = [...this.messages, { role: 'user', content: newMessage }];
    const newMessage = {
      message: `Can you explain to a total beginner in painting the painting ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate}. The response should start directly with the answer without you telling me anything else.`,
    };

    this.openAIStream.getCollection(newMessage).subscribe({
      next: (event: HttpEvent<any>) => {
        // console.log(event)
        if (event.type === HttpEventType.Response) {
          const response = event.body;
          this.explanation$.next(response);
          // console.log(response);
        } else if (event.type === HttpEventType.DownloadProgress) {
          const response = event;
          // console.log(response);
          // Handle progress notifications
        } else if (event.type === HttpEventType.UploadProgress) {
          // Handle progress notifications
        } else if (event.type === HttpEventType.Sent) {
          // Handle progress notifications
        }
        return event;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public askInterestOpenAI(data: any): Observable<any> {
    console.log(data);
    //const newMessage = `Can you explain to a total beginner in painting the painting ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate}. The response should start directly with the answer without you telling me anything else.`;
    //console.log(typeof newMessage)
    // this.messages = [...this.messages, { role: 'user', content: newMessage }];
    const newMessage = {
      message: `Can you explain to a total beginner why the painting ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate} is remarkable. The response should start directly with the answer without you telling me anything else.`,
    };

    return this.openAIStream.getCollection(newMessage).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event.body;
          this.explanation$.next(response);
        } else if (event.type === HttpEventType.DownloadProgress) {
          // Handle progress notifications
        } else if (event.type === HttpEventType.UploadProgress) {
          // Handle progress notifications
        } else if (event.type === HttpEventType.Sent) {
          // Handle progress notifications
        }
      })
    );
  }

  public askSimilarArtistOpenAI(data: any): Observable<any> {
    console.log(data);
    //const newMessage = `Can you explain to a total beginner in painting the painting ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate}. The response should start directly with the answer without you telling me anything else.`;
    //console.log(typeof newMessage)
    // this.messages = [...this.messages, { role: 'user', content: newMessage }];
    const newMessage = {
      message: `What are the other paintings by other artists similar to ${data.title} from ${data.artistDisplayName}, painted in ${data.objectEndDate} ? The response should start directly with the answer without you telling me anything else.`,
    };

    return this.openAIStream.getCollection(newMessage).pipe(
      tap((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event.body;
          this.explanation$.next(response);
        } else if (event.type === HttpEventType.DownloadProgress) {
          // Handle progress notifications
        } else if (event.type === HttpEventType.UploadProgress) {
          // Handle progress notifications
        } else if (event.type === HttpEventType.Sent) {
          // Handle progress notifications
        }
      })
    );
  }

  public getExplanation() {
    return this.explanation$.asObservable();
  }

  public getRandomItem() {
    const id =
      this.filteredTab[Math.floor(Math.random() * this.filteredTab.length)];
    // get random id
    // console.log('inside getrandomItem', id);

    this.http
      .get<any>(`${this.urlApi}/${id}`)
      .pipe(
        map((data) => {
          if (
            data.primaryImageSmall !== '' &&
            data.department === 'European Paintings'
          ) {
            this.askOpenAI(data);
            return data;
          } else {
            // console.log('problème');
            throw new Error();
          }
        })
      )
      .subscribe({
        next: (data) => this.collection$.next(data),
        error: (e) => this.getRandomItem(),
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
