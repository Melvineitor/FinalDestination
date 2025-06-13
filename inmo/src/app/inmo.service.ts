import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inquilino, VentaCrear, Cita } from './inmobilaria.models';
import { environment } from '../environments/environment';
import { Persona } from './inmobilaria.models';

interface LoginRequest {
  nombre_usuario: string;
  contrasena: string;
}



export interface Empleado {
  id_empleado?: number;
  persona_empleado: number;
  sueldo_empleado: number;
  puesto_empleado: string;
}

export interface Notario {
  id_notario?: number;
  persona_notario: number;
  matricula_colegio: string;
}

export interface Fiador {
  id_fiador_solidario?: number;
  persona_fiador: number;
}

@Injectable({
  providedIn: `root`
})
export class InmoService {
 // Ajusta según tu configuración

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${environment.apiURL}/Inmobilaria/Clientes`);
  }
  getPagos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/Pagos`);
  }
  getPagosEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/PagosEstado`);
  }

  getBarras(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/PagosMes`);
  }
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${environment.apiURL}/Inmobilaria/MostrarPersonas`);
  }
  getPropiedades(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/MostrarPropiedades`);
  }
  getAlquileres(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/MostrarAlquileres`);
  }
  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/MostrarCitas`);
  }
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/MostrarVentas`);
  }
  getPagosAlquiler(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/MostrarPagos`);
  }

  //Formularios

  createPersona(persona: Omit<Persona, 'id_persona'>): Observable<Persona> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Persona>(`${environment.apiURL}/forms/CrearPersona`, persona, { headers });
  }

  createPropiedad(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearPropiedad`, data, { headers });
  }
  crearPago(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearPago`, data, { headers });
  }
  crearAlquiler(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearAlquiler`, data, { headers });
  }
  crearDireccion(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearDireccion`, data, { headers });
  }

  createVenta(data: VentaCrear): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearVenta`, data, { headers });
  }

  createCita(data: Cita): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearCita`, data, { headers });
  }

  crearTarjeta(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiURL}/forms/CrearTarjeta`, data, { headers } );
  }

  buscarTarjetas(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/forms/BuscarTarjetas?search=${searchTerm}`);
  }

  obtenerTarjeta(id: number): Observable<any> {
    return this.http.get(`${environment.apiURL}/forms/ObtenerTarjeta/${id}`);
  }

  createEmpleado(empleado: Empleado): Observable<Empleado> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Empleado>(`${environment.apiURL}/forms/CrearEmpleado`, empleado, { headers });
  }

  createNotario(notario: Notario): Observable<Notario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Notario>(`${environment.apiURL}/forms/CrearNotario`, notario, { headers });
  }

  createFiador(fiador: Fiador): Observable<Fiador> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Fiador>(`${environment.apiURL}/forms/CrearFiador`, fiador, { headers });
  }
}
