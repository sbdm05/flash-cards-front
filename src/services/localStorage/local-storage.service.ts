import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public updatedStorage$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  constructor() {
    if (localStorage.getItem('my-favorites-imgs')) {
      const localStorageTab = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );
      this.updatedStorage$.next(localStorageTab);
    }
  }

  ionViewDidEnter(){
    if (localStorage.getItem('my-favorites-imgs')) {
      const localStorageTab = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );
      this.updatedStorage$.next(localStorageTab);
    }
  }



  // on add
  public onAdd(objSaved: any){
    // store the value as a []
    let updatedStorageValue = this.updatedStorage$.value;

    if (updatedStorageValue.length > 0) {
      const imgFound = updatedStorageValue.find(
        (item) => item.objDetail.objectID === objSaved.objDetail.objectID
      );
      console.log(imgFound, 'imgFound');
      if (imgFound) {
        console.log(imgFound, 'already exists');
        return;
      } else {
        console.log('new', objSaved.objDetail.objectID);
        updatedStorageValue.unshift(objSaved);
        // updated observable
        this.updatedStorage$.next(updatedStorageValue)

        // updated localStorage
        localStorage.setItem(
          'my-favorites-imgs',
          JSON.stringify(updatedStorageValue)
        );
      }
    } else if (updatedStorageValue.length === 0) {
      console.log('new', objSaved.objDetail.objectID);
      updatedStorageValue.unshift(objSaved);
      // updated observable
      this.updatedStorage$.next(updatedStorageValue);
      localStorage.setItem(
        'my-favorites-imgs',
        JSON.stringify(updatedStorageValue)
      );
    }
  }

  // on remove



}
