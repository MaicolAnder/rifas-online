import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RaffleTicket } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedTicketSubject = new BehaviorSubject<RaffleTicket | null>(null);
  selectedTicket$ = this.selectedTicketSubject.asObservable();

  setSelectedTicket(ticket: RaffleTicket) {
    this.selectedTicketSubject.next(ticket);
  }

  clearSelectedTicket() {
    this.selectedTicketSubject.next(null);
  }
}