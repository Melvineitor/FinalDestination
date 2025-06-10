import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  getGananciasMensuales(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/dashboard/GananciasPorMes`);
  }
  getTotalComisiones(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/dashboard/TotalComisiones`);
  }
}
