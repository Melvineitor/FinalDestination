import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { Persona, Cita } from '../../inmobilaria.models';
import { AlquilerService } from '../../alquiler/registro-alquiler/alquiler.service';
@Component({
  selector: 'app-registro-cita',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-cita.component.html',
  styleUrl: './registro-cita.component.css'
})
export class RegistroCitaComponent implements OnInit {
  registroForm: FormGroup;
  empleados: any[] = [];
  clientes: any[] = [];
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

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router, private alquilerService: AlquilerService) {
    this.registroForm = this.fb.group({
      fecha_cita: ['', Validators.required],
      hora_cita: ['', Validators.required],
      motivo_cita: ['', Validators.required],
      empleado_cita: [0, Validators.required],
      cliente_cita: [0, Validators.required],
      estado_cita: ['Pendiente', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar empleados y clientes
    this.alquilerService.getEmpleados().subscribe(data => this.empleados = data);
    console.log(this.empleados);
    this.alquilerService.getClientes().subscribe(data => this.clientes = data);
    console.log(this.clientes);
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
