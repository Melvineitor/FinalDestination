import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registrar-pago',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-pago.component.html',
  styleUrl: './registrar-pago.component.css'
})
export class RegistrarPagoComponent {

  registroForm: FormGroup;
  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      fecha_pago: ['', Validators.required],
      metodo_pago: ['', Validators.required],
      motivo_pago: ['', Validators.required],
      desc_pago: ['', [Validators.required]],
      tipo_contrato: ['', Validators.required],
      descripcion_penalidad: ['', Validators.required],
      compania_tarjeta: ['', Validators.required],
      monto_pagado: ['', Validators.required],
      estado_pago: ['', Validators.required],
      nombre_agente: ['', Validators.required],
    });
  }

    onSubmit(): void {
    console.log('Intentando guardar pago...');
    if (this.registroForm.invalid) {
      console.warn('Formulario inválido', this.registroForm.errors, this.registroForm.value);
      this.registroForm.markAllAsTouched();
      return;
    }

    this.inmoService.crearPago(this.registroForm.value).subscribe({
      next: (res) => {
        console.log('Pago guardado con éxito:', res);
        alert('Pago guardado correctamente');
        this.registroForm.reset();
      },
      error: (err) => {
        console.error('Error al guardar pago:', err);
        alert('Error al guardar los datos');
      }
    });
  }


  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: true, link: '/pago' },
    { name: 'Cita', icon: '📅', active: false, link: '/cita' },
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
