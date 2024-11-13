export interface User {
  id?: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  identificacion: string;
  tipoIdentificacion: 'CC' | 'CE' | 'PASAPORTE';
  fechaNacimiento: Date;
  ubicacion: string;
}

export interface RaffleTicket {
  numero: number;
  estado: 'disponible' | 'seleccionado' | 'pagado';
  usuario?: User;
  fechaSeleccion?: Date;
  fechaPago?: Date;
}