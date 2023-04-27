import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  private urlApi: string = environment.urlApi;

  constructor(private http: HttpClient) {}

  // get list of articles
  public getCollection(obj: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, obj);
  }
}
