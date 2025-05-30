import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inquilino } from './inmobilaria.models';
interface LoginRequest {
  nombre_usuario: string;
  contrasena: string;
}
@Injectable({
  providedIn: 'root'
})
export class InmoService {

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>('http://localhost:5095/api/Inmobilaria/Clientes');
  }
  getPagos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/Pagos');
  }
  getPagosEstados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/PagosEstado');
  }

  getBarras(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/PagosMes');
  }
  getPersonas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/MostrarPersonas');
  }
  getPropiedades(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/MostrarPropiedades');
  }
  getAlquileres(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/MostrarAlquileres');
  }
  getCitas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/MostrarCitas');
  }
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/MostrarVentas');
  }
  getPagosAlquiler(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5095/api/Inmobilaria/MostrarPagos');
  }

  //Formularios

  createPersona(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:5095/api/forms/CrearPersona', data, { headers });
  }
  createPropiedad(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:5095/api/forms/CrearPropiedad', data, { headers });
  }
  crearPago(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:5095/api/forms/CrearPago', data, { headers });
  }
  crearAlquiler(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:5095/api/forms/CrearAlquiler', data, { headers });
  }
}
