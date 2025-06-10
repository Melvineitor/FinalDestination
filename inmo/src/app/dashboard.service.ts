import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GananciaMensual } from './inmobilaria.models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  getGananciasMensuales(): Observable<GananciaMensual[]> {
    return this.http.get<GananciaMensual[]>(`${environment.apiURL}api/dashboard/GananciasPorMes`);
  }
  getTotalComisiones(): Observable<number> {
    return this.http.get<number>(`${environment.apiURL}api/dashboard/TotalComisiones`);
  }
}
