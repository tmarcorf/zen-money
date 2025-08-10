import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();
  private requests = 0;

  show() {
    this.requests++;
    this._loading.next(true);
  }

  hide() {
    this.requests--;
    
    if (this.requests <= 0){
        this._loading.next(false);
        this.requests = 0;
    }
  }
}