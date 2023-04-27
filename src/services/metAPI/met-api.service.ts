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

@Injectable({
  providedIn: 'root',
})
export class MetApiService {
  private urlApi: string = environment.urlApi;

  public filteredTab = filteredId;
  public randomId!: number;

  public id$ = new Subject(

  );
  public collection$ = new Subject();
  public id!: any;

  constructor(private http: HttpClient) {
  }

  public refresh() {

    this.getRandomItem();
    return this.collection$;
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
            return data;
          } else {
            console.log('problème');
            throw new Error();
          }
        })
      )
      .subscribe({
        next:(data) =>this.collection$.next(data),
        error: (e)=> this.getRandomItem()
      });
  }
}
