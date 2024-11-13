import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StateChangeEvent } from '../types/events';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private stateChangeSubject = new Subject<StateChangeEvent>();
  stateChange$ = this.stateChangeSubject.asObservable();

  emit(event: StateChangeEvent): void {
    this.stateChangeSubject.next(event);
  }
}
