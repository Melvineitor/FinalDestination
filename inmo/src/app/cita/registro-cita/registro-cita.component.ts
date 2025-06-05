import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { Persona, Cita } from '../../inmobilaria.models';

@Component({
  selector: 'app-registro-cita',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-cita.component.html',
  styleUrl: './registro-cita.component.css'
})
export class RegistroCitaComponent implements OnInit {
  registroForm: FormGroup;
  empleados: Persona[] = [];
  clientes: Persona[] = [];
  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/dashboard' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
    { name: 'Cita', icon: '📅', active: true, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: false, link: '/perfil' },
  ];

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      fecha_cita: ['', Validators.required],
      hora_cita: ['', Validators.required],
      motivo_cita: ['', Validators.required],
      nombre_empleado: ['', Validators.required],
      nombre_cliente: ['', Validators.required],
      estado_cita: ['Pendiente', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar empleados y clientes
    this.inmoService.getPersonas().subscribe(
      (personas: Persona[]) => {
        this.empleados = personas.filter(p => p.rol_persona === 'Empleado');
        this.clientes = personas.filter(p => p.rol_persona === 'Inquilino');
      },
      (error) => {
        console.error('Error al cargar personas:', error);
      }
    );
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    try {
      const citaData = this.registroForm.value;
      this.inmoService.createCita(citaData).subscribe({
        next: (response: any) => {
          alert('Cita registrada correctamente');
          this.router.navigate(['/cita']);
        },
        error: (error: any) => {
          alert('Error al registrar la cita');
          console.error('Error:', error);
        }
      });
    } catch (err) {
      alert('Error al procesar la cita');
      console.error('Error:', err);
    }
  }

  selectMenuItem(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
