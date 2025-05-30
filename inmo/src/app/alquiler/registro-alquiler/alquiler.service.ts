import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface AlquilerCrear {
  empleado_alquiler: any;
  id_alquiler: number;
  fecha_alquiler: Date;
  fecha_fin_alquiler: Date;
  pago_alquiler: number;
  plazo_pago: string;
  id_propiedad: number;
  nombre_empleado: number;
  nombre_cliente: number;
  nombre_fiador: number;
  nombre_notario: number;
  id_contrato: number;
  estado_alquiler: string;
}
@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  private apiUrl = 'http://localhost:5095/api/alquiler'; 

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inquilinos`);
  }

  getFiadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fiadores`);
  }

  getNotarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notarios`);
  }
  getPropiedades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/propiedades`);
  }
}
