import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inquilino } from './inmobilaria.models';
import { environment } from '../environments/environment';
interface LoginRequest {
  nombre_usuario: string;
  contrasena: string;
}
@Injectable({
  providedIn: `root`
})
export class InmoService {

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
  getPersonas(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/Inmobilaria/MostrarPersonas`);
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

  createPersona(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/forms/CrearPersona`, data, { headers });
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

  crearTarjeta(data: any): Observable<any> {
    return this.http.post(`${environment.apiURL}/forms/CrearTarjeta`, data);
  }

  buscarTarjetas(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/forms/BuscarTarjetas?search=${searchTerm}`);
  }
}
