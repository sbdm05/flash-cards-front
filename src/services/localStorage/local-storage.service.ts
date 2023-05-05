import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public updatedStorage$: BehaviorSubject<any> = new BehaviorSubject<any>([]);


  constructor() {
    if (localStorage.getItem('my-favorites-imgs')) {
      const localStorageTab = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );
      this.updatedStorage$.next(localStorageTab);

    }
  }

  public onCheck() {
    console.log('depuis onCheck');

    if (localStorage.getItem('my-favorites-imgs')) {
      const localStorageTab = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );
      this.updatedStorage$.next(localStorageTab);
     
    }
  }

  // on add
  public onAdd(objSaved: any) {
    // store the value as a []
    console.log(objSaved.objDetail.objectID)
    if (localStorage.getItem('my-favorites-imgs')) {
      const updatedStorageValue = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );

      if (updatedStorageValue.length > 0) {
        const imgFound = updatedStorageValue.find(
          (item: any) => item.objDetail.objectID === objSaved.objDetail.objectID
        );
        console.log(imgFound, 'imgFound');
        if (imgFound) {
          console.log(imgFound, 'already exists');
          return;
        } else {
          // console.log('new', objSaved.objDetail.objectID);
          updatedStorageValue.unshift(objSaved);
          // updated observable
          this.updatedStorage$.next(updatedStorageValue);

          // updated localStorage
          localStorage.setItem(
            'my-favorites-imgs',
            JSON.stringify(updatedStorageValue)
          );
        }
      } else if (updatedStorageValue.length === 0) {
        // console.log('new', objSaved.objDetail.objectID);
        updatedStorageValue.unshift(objSaved);
        // updated observable
        this.updatedStorage$.next(updatedStorageValue);
        localStorage.setItem(
          'my-favorites-imgs',
          JSON.stringify(updatedStorageValue)
        );
      }
    }else{
      const newArray = [];
      newArray.unshift(objSaved);
      // updated observable
      this.updatedStorage$.next(newArray);
      localStorage.setItem(
        'my-favorites-imgs',
        JSON.stringify(newArray)
      );
    }
  }

  // on remove
  public onRemove(img: any) {
    console.log(img.objDetail.objectID, 'remove');
    if (localStorage.getItem('my-favorites-imgs')) {
      const localStorageTab = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );

      // filter out the img

      if (localStorageTab.length > 0) {
        const filteredTab = localStorageTab.filter(
          (item: any) => item.objDetail.objectID !== img.objDetail.objectID
        );

        // update the localStorage
        localStorage.setItem(
          'my-favorites-imgs',
          JSON.stringify(filteredTab)
        );

        // update the observable
        this.updatedStorage$.next(filteredTab);
      }
    }
  }

  // on View
  public onFindById(id: number) {
    if (localStorage.getItem('my-favorites-imgs')) {
      const updatedStorageValue = JSON.parse(
        localStorage.getItem('my-favorites-imgs') ?? ''
      );
      const imgFound = updatedStorageValue.find(
        (item: any) => item.objDetail.objectID === id
      );
      console.log(imgFound, 'imgFound');
      if (imgFound) {
        console.log(imgFound, 'img found in the localstorage');
        return imgFound;
      }
    }
  }
}
