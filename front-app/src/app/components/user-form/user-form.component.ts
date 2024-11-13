import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { RaffleService } from '../../services/raffle.service';
import { StateService } from '../../services/state.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Número seleccionado: {{ selectedNumber }}</h2>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="nombres">Nombres</label>
          <input id="nombres" type="text" formControlName="nombres">
          <div *ngIf="userForm.get('nombres')?.errors?.['required'] && userForm.get('nombres')?.touched" class="error">
            Este campo es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="apellidos">Apellidos</label>
          <input id="apellidos" type="text" formControlName="apellidos">
          <div *ngIf="userForm.get('apellidos')?.errors?.['required'] && userForm.get('apellidos')?.touched" class="error">
            Este campo es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="correo">Correo</label>
          <input id="correo" type="email" formControlName="correo">
          <div *ngIf="userForm.get('correo')?.errors?.['required'] && userForm.get('correo')?.touched" class="error">
            Este campo es requerido
          </div>
          <div *ngIf="userForm.get('correo')?.errors?.['email'] && userForm.get('correo')?.touched" class="error">
            Ingrese un correo válido
          </div>
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input id="telefono" type="tel" formControlName="telefono">
          <div *ngIf="userForm.get('telefono')?.errors?.['required'] && userForm.get('telefono')?.touched" class="error">
            Este campo es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="tipoIdentificacion">Tipo de Identificación</label>
          <select id="tipoIdentificacion" formControlName="tipoIdentificacion">
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="PASAPORTE">Pasaporte</option>
          </select>
        </div>

        <div class="form-group">
          <label for="identificacion">Número de Identificación</label>
          <input id="identificacion" type="text" formControlName="identificacion">
          <div *ngIf="userForm.get('identificacion')?.errors?.['required'] && userForm.get('identificacion')?.touched" class="error">
            Este campo es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="fechaNacimiento">Fecha de Nacimiento</label>
          <input id="fechaNacimiento" type="date" formControlName="fechaNacimiento">
          <div *ngIf="userForm.get('fechaNacimiento')?.errors?.['required'] && userForm.get('fechaNacimiento')?.touched" class="error">
            Este campo es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="ubicacion">Ubicación</label>
          <input id="ubicacion" type="text" formControlName="ubicacion">
          <div *ngIf="userForm.get('ubicacion')?.errors?.['required'] && userForm.get('ubicacion')?.touched" class="error">
            Este campo es requerido
          </div>
        </div>

        <div class="buttons">
          <button type="button" class="secondary" (click)="onCancel()">Cancelar</button>
          <button type="submit" [disabled]="!userForm.valid">Simular Pago</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error {
      color: #d32f2f;
      font-size: 0.8em;
      margin-top: 5px;
    }
    .buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button[type="submit"] {
      background: #4CAF50;
      color: white;
    }
    button.secondary {
      background: #9e9e9e;
      color: white;
    }
    button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class UserFormComponent implements OnInit {
  showForm = false;
  userForm: FormGroup;
  selectedNumber: number | null = null;

  constructor(
    private fb: FormBuilder,
    private raffleService: RaffleService,
    private stateService: StateService,
    private eventService: EventService
  ) {
    this.userForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      tipoIdentificacion: ['CC', Validators.required],
      identificacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      ubicacion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.stateService.selectedTicket$.subscribe(ticket => {
      if (ticket) {
        this.selectedNumber = ticket.numero;
        this.showForm = true;
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid && this.selectedNumber) {
      const userData: User = this.userForm.value;
      this.raffleService.confirmTicket(this.selectedNumber, userData).subscribe({
        next: (ticket) => {
          this.eventService.emit({
            type: 'SHOW_GRID',
            message: 'Pago simulado exitosamente'
          });
        }
      });
    }
  }

  onCancel() {
    this.stateService.clearSelectedTicket();
    this.eventService.emit({ type: 'SHOW_GRID' });
    this.showForm = false;
  }
}
