import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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



  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/alquiler/empleados`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/alquiler/inquilinos`);
  }

  getFiadores(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/alquiler/fiadores`);
  }

  getNotarios(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/alquiler/notarios`);
  }
  getPropiedades(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/alquiler/inmuebles`);
  }
}
