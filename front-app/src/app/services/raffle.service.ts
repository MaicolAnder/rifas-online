import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RaffleTicket, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RaffleService {
  // Mock data for demonstration
  private tickets: RaffleTicket[] = Array.from({length: 100}, (_, i) => ({
    numero: i + 1,
    estado: 'disponible'
  }));

  getAvailableNumbers(): Observable<RaffleTicket[]> {
    return of(this.tickets);
  }

  selectNumber(numero: number): Observable<RaffleTicket> {
    const ticket = this.tickets.find(t => t.numero === numero);
    if (ticket && ticket.estado === 'disponible') {
      ticket.estado = 'seleccionado';
      return of(ticket);
    }
    throw new Error('Número no disponible');
  }

  confirmTicket(numero: number, userData: User): Observable<RaffleTicket> {
    const ticket = this.tickets.find(t => t.numero === numero);
    if (ticket && ticket.estado === 'seleccionado') {
      ticket.estado = 'pagado';
      ticket.usuario = userData;
      ticket.fechaPago = new Date();
      return of(ticket);
    }
    throw new Error('Ticket no válido');
  }

  processPayment(numero: number, paymentData: any): Observable<any> {
    return of({ success: true, message: 'Pago procesado exitosamente' });
  }
}