import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';

interface Tarjeta {
  id_tarjeta: number;
  num_tarjeta: string;
  tipo_tarjeta: string;
  titular_tarjeta: string;
  fecha_venc: string;
  cvv: string;
  compania_tarjeta: string;
}

@Component({
  selector: 'app-registrar-pago',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-pago.component.html',
  styleUrl: './registrar-pago.component.css'
})
export class RegistrarPagoComponent implements OnInit {
  registroForm: FormGroup;
  searchTarjetaControl = new FormControl('');
  mostrarCamposTarjeta = false;
  mostrarFormularioNuevaTarjeta = false;
  tarjetasEncontradas: Tarjeta[] = [];
  tarjetaSeleccionada: Tarjeta | null = null;

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
      num_tarjeta: [''],
      tipo_tarjeta: [''],
      titular_tarjeta: [''],
      fecha_venc: [''],
      cvv: [''],
      compania_tarjeta: [''],
      monto_pagado: ['', [Validators.required, Validators.min(0)]],
      estado_pago: ['', Validators.required],
      nombre_agente: ['', Validators.required],
      persona_pago: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Inicialización si es necesaria
  }

  onMetodoPagoChange(event: any) {
    const metodoPago = event.target.value;
    this.mostrarCamposTarjeta = metodoPago === 'Tarjeta';
    
    if (!this.mostrarCamposTarjeta) {
      // Si no es tarjeta, resetear los campos de tarjeta
      this.registroForm.patchValue({
        num_tarjeta: '',
        tipo_tarjeta: '',
        titular_tarjeta: '',
        fecha_venc: '',
        cvv: '',
        compania_tarjeta: ''
      });
      this.tarjetaSeleccionada = null;
      this.tarjetasEncontradas = [];
      this.mostrarFormularioNuevaTarjeta = false;
    }
  }

  buscarTarjeta() {
    const searchTerm = this.searchTarjetaControl.value;
    if (!searchTerm) {
      alert('Por favor ingrese un término de búsqueda');
      return;
    }

    this.inmoService.buscarTarjetas(searchTerm).subscribe({
      next: (tarjetas: Tarjeta[]) => {
        this.tarjetasEncontradas = tarjetas;
        if (tarjetas.length === 0) {
          alert('No se encontraron tarjetas con ese criterio');
        }
      },
      error: (error) => {
        console.error('Error al buscar tarjetas:', error);
        alert('Error al buscar tarjetas');
      }
    });
  }

  seleccionarTarjeta(event: any) {
    const tarjetaId = parseInt(event.target.value);
    if (!tarjetaId) return;

    this.inmoService.obtenerTarjeta(tarjetaId).subscribe({
      next: (tarjeta) => {
        this.tarjetaSeleccionada = tarjeta;
        this.mostrarFormularioNuevaTarjeta = false;
        
        // Actualizar el formulario con los datos de la tarjeta seleccionada
        this.registroForm.patchValue({
          num_tarjeta: tarjeta.num_tarjeta,
          tipo_tarjeta: tarjeta.tipo_tarjeta,
          titular_tarjeta: tarjeta.titular_tarjeta,
          fecha_venc: tarjeta.fecha_venc,
          cvv: tarjeta.cvv,
          compania_tarjeta: tarjeta.compania_tarjeta
        });
      },
      error: (error) => {
        console.error('Error al obtener los detalles de la tarjeta:', error);
        alert('Error al obtener los detalles de la tarjeta');
      }
    });
  }

  toggleNuevaTarjeta() {
    this.mostrarFormularioNuevaTarjeta = !this.mostrarFormularioNuevaTarjeta;
    if (!this.mostrarFormularioNuevaTarjeta) {
      // Limpiar campos de tarjeta si se cancela
      this.registroForm.patchValue({
        num_tarjeta: '',
        tipo_tarjeta: '',
        titular_tarjeta: '',
        fecha_venc: '',
        cvv: '',
        compania_tarjeta: ''
      });
    }
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    try {
      let tarjetaId: number | null = null;

      if (this.registroForm.get('metodo_pago')?.value === 'Tarjeta') {
        if (this.tarjetaSeleccionada) {
          // Usar tarjeta existente
          tarjetaId = this.tarjetaSeleccionada.id_tarjeta;
        } else if (this.mostrarFormularioNuevaTarjeta) {
          // Crear nueva tarjeta
          const tarjetaData = {
            num_tarjeta: this.registroForm.get('num_tarjeta')?.value,
            tipo_tarjeta: this.registroForm.get('tipo_tarjeta')?.value,
            titular_tarjeta: this.registroForm.get('titular_tarjeta')?.value,
            fecha_venc: this.registroForm.get('fecha_venc')?.value,
            cvv: this.registroForm.get('cvv')?.value,
            compania_tarjeta: this.registroForm.get('compania_tarjeta')?.value
          };

          const tarjetaResponse = await this.inmoService.crearTarjeta(tarjetaData).toPromise();
          tarjetaId = tarjetaResponse.id_tarjeta;
        }
      }

      // Preparar datos del pago
      const pagoData = {
        fecha_pago: this.registroForm.get('fecha_pago')?.value,
        metodo_pago: this.registroForm.get('metodo_pago')?.value,
        motivo_pago: this.registroForm.get('motivo_pago')?.value,
        desc_pago: this.registroForm.get('desc_pago')?.value,
        tipo_contrato: this.registroForm.get('tipo_contrato')?.value,
        descripcion_penalidad: this.registroForm.get('descripcion_penalidad')?.value,
        compania_tarjeta: tarjetaId, // Puede ser null si es efectivo
        monto_pagado: this.registroForm.get('monto_pagado')?.value,
        estado_pago: this.registroForm.get('estado_pago')?.value,
        nombre_agente: this.registroForm.get('nombre_agente')?.value,
        persona_pago: this.registroForm.get('persona_pago')?.value
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

  selectMenuItem(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
