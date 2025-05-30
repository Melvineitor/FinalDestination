import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InmoService } from '../inmo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-landing',
  imports: [FormsModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  nombre_usuario = '';
  contrasena = '';
  error = '';
  errorMessage: string | undefined;
  adminData: any[] | undefined;

  constructor( private router: Router, private adminService: AdminService) {}
  login() {

    const credentials = {
      nombre_usuario: this.nombre_usuario,
      contrasena: this.contrasena
    };
    this.adminService.login(this.nombre_usuario, this.contrasena).subscribe(
      (admin) => {
        localStorage.setItem('admin', JSON.stringify(admin));
        this.router.navigate(['/dashboard']);  // ⬅️ redirección
      },
      (error) => {
        console.error('Login fallido:', error);
        alert('Credenciales incorrectas');
      }
    );
  }
  

}
