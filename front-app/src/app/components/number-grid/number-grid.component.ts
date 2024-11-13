import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleService } from '../../services/raffle.service';
import { StateService } from '../../services/state.service';
import { EventService } from '../../services/event.service';
import { RaffleTicket } from '../../models/user.model';

@Component({
  selector: 'app-number-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid-container">
      <div class="numbers-grid">
        <button
          *ngFor="let number of numbers"
          [class.selected]="isSelected(number)"
          [class.available]="isAvailable(number)"
          [disabled]="!isAvailable(number)"
          (click)="selectNumber(number)"
        >
          {{ number }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .grid-container {
      padding: 20px;
    }
    .numbers-grid {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 10px;
      max-width: 800px;
      margin: 0 auto;
    }
    button {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background: white;
      cursor: pointer;
    }
    button.selected {
      background: #ff4444;
      color: white;
    }
    button.available:hover {
      background: #e0e0e0;
    }
    button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class NumberGridComponent implements OnInit {
  numbers: number[] = Array.from({length: 100}, (_, i) => i + 1);
  tickets: RaffleTicket[] = [];

  constructor(
    private raffleService: RaffleService,
    private stateService: StateService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.raffleService.getAvailableNumbers().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
      },
      error: () => {
        this.eventService.emit({
          type: 'SHOW_ERROR',
          message: 'Error al cargar los números disponibles'
        });
      }
    });
  }

  isSelected(number: number): boolean {
    return this.tickets.some(t => t.numero === number && t.estado !== 'disponible');
  }

  isAvailable(number: number): boolean {
    return !this.isSelected(number);
  }

  selectNumber(number: number) {
    this.raffleService.selectNumber(number).subscribe({
      next: (ticket) => {
        let state = this.stateService.setSelectedTicket(ticket);
        let emit = this.eventService.emit({ type: 'SHOW_USER_FORM' });
        console.log(ticket, this.stateService.selectedTicket$, emit)
      },
      error: (err) => {
        console.error('Error selecting number:', err);
        // Manejo de errores adicional si es necesario
      }
    });
  }
}
