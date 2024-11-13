import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NumberGridComponent } from './components/number-grid/number-grid.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { EventService } from './services/event.service';
import { StateChangeEvent } from './types/events';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  NumberGridComponent, UserFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-app';
  type: StateChangeEvent  = {type: 'SHOW_GRID'};

  constructor(
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.stateChange$.subscribe(event => {
      console.log('Event received:', event);
      this.type = event;
    });
  }
}
