import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EventService } from '../services/event.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const eventService = inject(EventService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else if (error.status) {
        switch (error.status) {
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 409:
            errorMessage = 'El número ya ha sido seleccionado';
            break;
          case 500:
            errorMessage = 'Error en el servidor';
            break;
        }
      }

      eventService.emit({
        type: 'SHOW_ERROR',
        message: errorMessage,
      });

      return throwError(() => error);
    })
  );
};
