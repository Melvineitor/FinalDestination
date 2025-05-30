import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-persona',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-propiedad.component.html',
  styleUrl: './registro-propiedad.component.css'
})
export class RegistroPropiedadComponent {
registroForm: FormGroup;
  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      titulo: ['', Validators.required],
      m_ancho: ['', Validators.required],
      m_largo: ['', Validators.required],
      metros_cuadrados: ['', [Validators.required]],
      descripcion: ['', Validators.required],
      precio_venta: [''],
      precio_alquiler: [''],
      direccion_propiedad: ['', Validators.required],
      estado_propiedad: ['', Validators.required],
    });
  }

    onSubmit(): void {
    if (this.registroForm.invalid) {
      return;
    }

    this.inmoService.createPropiedad(this.registroForm.value).subscribe({
      next: (res) => {
        console.log('Persona guardada con éxito:', res);
        alert('Persona guardada correctamente');
        this.registroForm.reset();
      },
      error: (err) => {
        console.error('Error al guardar persona:', err);
        alert('Error al guardar los datos');
      }
    });
  }
  


menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/' },
    { name: 'Persona', icon: '👤', active: true, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
    { name: 'Cita', icon: '📅', active: true, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: false, link: '/perfil' },
  ];

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  selectMenuItem(selectedItem: any): void {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
  }
}
