import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeftMenuService {
  public toggleMenu$: Subject<void> = new Subject();
}
