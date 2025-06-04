import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class RegistrarPagoComponent implements OnInit {

  registroForm: FormGroup;
  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/dashboard' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: true, link: '/pago' },
    { name: 'Cita', icon: '📅', active: false, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: false, link: '/perfil' },
  ];

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      fecha_pago: ['', Validators.required],
      metodo_pago: ['', Validators.required],
      motivo_pago: ['', Validators.required],
      desc_pago: ['', Validators.required],
      tipo_contrato: ['', Validators.required],
      descripcion_penalidad: [null],
      // Campos de tarjeta
      num_tarjeta: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      tipo_tarjeta: ['', Validators.required],
      titular_tarjeta: ['', Validators.required],
      fecha_venc: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
      compania_tarjeta: ['', Validators.required],
      monto_pagado: ['', [Validators.required, Validators.min(0)]],
      estado_pago: ['', Validators.required],
      nombre_agente: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Cualquier inicialización necesaria
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    try {
      // Primero crear la tarjeta
      const tarjetaData = {
        num_tarjeta: this.registroForm.get('num_tarjeta')?.value,
        tipo_tarjeta: this.registroForm.get('tipo_tarjeta')?.value,
        titular_tarjeta: this.registroForm.get('titular_tarjeta')?.value,
        fecha_venc: this.registroForm.get('fecha_venc')?.value,
        cvv: this.registroForm.get('cvv')?.value,
        compania_tarjeta: this.registroForm.get('compania_tarjeta')?.value
      };

      // Crear la tarjeta y obtener su ID
      const tarjetaResponse = await this.inmoService.crearTarjeta(tarjetaData).toPromise();
      const tarjetaId = tarjetaResponse.id_tarjeta;

      // Preparar datos del pago
      const pagoData = {
        fecha_pago: this.registroForm.get('fecha_pago')?.value,
        metodo_pago: this.registroForm.get('metodo_pago')?.value,
        motivo_pago: this.registroForm.get('motivo_pago')?.value,
        desc_pago: this.registroForm.get('desc_pago')?.value,
        tipo_contrato: this.registroForm.get('tipo_contrato')?.value,
        descripcion_penalidad: this.registroForm.get('descripcion_penalidad')?.value,
        compania_tarjeta: tarjetaId, // Usar el ID de la tarjeta creada
        monto_pagado: this.registroForm.get('monto_pagado')?.value,
        estado_pago: this.registroForm.get('estado_pago')?.value,
        nombre_agente: this.registroForm.get('nombre_agente')?.value
      };

      // Crear el pago
      await this.inmoService.crearPago(pagoData).toPromise();
      alert('Pago registrado exitosamente');
      this.router.navigate(['/pago']);
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      alert('Error al registrar el pago');
    }
  }

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  selectMenuItem(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }
}
