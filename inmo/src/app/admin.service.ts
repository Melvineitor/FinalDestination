import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminData: any = null;
constructor(private http: HttpClient) { }
  
login(nombre_usuario: string, contrasena: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${environment.apiURL}/auth/login`, {
      nombre_usuario: nombre_usuario.trim(), contrasena: contrasena.trim()},
      { headers });
  }

setAdmin(data: any) {
    this.adminData = data;
  }

  getAdmin() {
    return this.adminData;
  }

  clearAdmin() {
    this.adminData = null;
  }
  updateAdmin(admin: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.patch(`${environment.apiURL}/auth/update`, admin, {headers}); // ajusta la URL a tu API
}
}
