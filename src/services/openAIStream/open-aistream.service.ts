import {
  HttpClient,
  HttpHeaders,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAIStreamService {
  private urlTest: string = environment.urlTest;
  private urlApi: string = environment.urlApiOpenAi;

  constructor(private http: HttpClient) {}

  // get list of articles
  public getCollection(obj: any): Observable<any> {
    // (typeof obj, 'obj');
    return this.http
      .post(`${this.urlTest}`, obj, {
        observe: 'events',
        responseType: 'text',
      })
      .pipe(
        map((event: HttpEvent<any>) => {
          // Handle the response stream from the backend API
          if (event.type === HttpEventType.Response) {
            const response = event.body;
            // console.log(response);
          } else if (event.type === HttpEventType.DownloadProgress) {
            const response = event;
            // console.log(response, 'test');
            // Handle progress notifications
          } else if (event.type === HttpEventType.UploadProgress) {
            // Handle progress notifications
          } else if (event.type === HttpEventType.Sent) {
            // Handle progress notifications
          }
          return event;
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }
}
