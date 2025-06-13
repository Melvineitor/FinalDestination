import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { Persona, VentaCrear, Inmueble } from '../../inmobilaria.models';
import { AlquilerService } from '../../alquiler/registro-alquiler/alquiler.service';

@Component({
  selector: 'app-registro-venta',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-venta.component.html',
  styleUrl: './registro-venta.component.css'
})
export class RegistroVentaComponent implements OnInit {
  registroForm: FormGroup;
  empleados: any[] = [];
  clientes: any[] = [];
  notarios: any[] = [];
  propiedades: any[] = [];
  propietarios: any[] = [];
  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/dashboard' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: true, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
    { name: 'Cita', icon: '📅', active: false, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: false, link: '/perfil' },
  ];
  pagoVenta: number | null = null;
  propietarioInmueble: { id_persona: number; nombre_persona: string; apellido_persona: string; } | null | undefined;
  propiedadesActivas: any[] = [];

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router, private alquilerService: AlquilerService) {
    this.registroForm = this.fb.group({
      fecha_venta: ['', Validators.required],
      pago_venta: ['', [Validators.required, Validators.min(0)]],
      propiedad_venta: [0, Validators.required],
      empleado_venta: ['', Validators.required],
      inquilino_venta: ['', Validators.required],
      notario_venta: ['', Validators.required],
      contrato_venta: ['', Validators.required],
      estado_venta: ['Completado', Validators.required],
      id_inmueble: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatosRelacionados();
    console.log(this.pagoVenta);
  }

  // Método para obtener los campos faltantes
  obtenerCamposFaltantes(): string[] {
    const camposFaltantes: string[] = [];
    const camposConNombres: { [key: string]: string } = {
      'fecha_venta': 'Fecha de Venta',
      'pago_venta': 'Pago de Venta',
      'propiedad_venta': 'Propiedad',
      'empleado_venta': 'Empleado',
      'inquilino_venta': 'Inquilino',
      'notario_venta': 'Notario',
      'contrato_venta': 'Contrato de Venta',
      'estado_venta': 'Estado de Venta',
      'id_inmueble': 'ID Inmueble',
      'propietario_inmueble': 'Propietario del Inmueble'
    };

    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      if (control && control.invalid) {
        // Verificar si tiene error 'required'
        if (control.errors?.['required']) {
          const nombreCampo = camposConNombres[key];
          if (nombreCampo) {
            camposFaltantes.push(nombreCampo);
          } else {
            // Si no está en el mapeo, usar el key original pero formateado
            const nombreFormateado = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            camposFaltantes.push(nombreFormateado);
          }
        }
        // Verificar si tiene error 'min' (para pago_venta)
        else if (control.errors?.['min']) {
          const nombreCampo = camposConNombres[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          camposFaltantes.push(`${nombreCampo} (debe ser mayor a 0)`);
        }
      }
    });

    return camposFaltantes;
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      const camposFaltantes = this.obtenerCamposFaltantes();
      
      let mensajeError = 'Formulario Inválido.';
      
      if (camposFaltantes.length > 0) {
        mensajeError += `\n\nCampos faltantes o inválidos:\n• ${camposFaltantes.join('\n• ')}`;
      }
      
      console.warn('Formulario inválido:', this.registroForm.errors, this.registroForm.value);
      console.warn('Campos faltantes:', camposFaltantes);
      
      alert(mensajeError);
      this.registroForm.markAllAsTouched();
      return;
    }

    try {
      const ventaData: VentaCrear = this.registroForm.value;
      console.log('Datos enviados al backend:', ventaData);
      
      this.inmoService.createVenta(ventaData).subscribe({
        next: (response: any) => {
          console.log('Venta guardada con éxito:', response);
          alert('Venta registrada correctamente');
          this.registroForm.reset();
          // Opcional: redirigir a la lista de ventas
          // this.router.navigate(['/venta']);
        },
        error: (error: any) => {
          console.error('Error al guardar venta:', error);
          alert('Error al registrar la venta');
        }
      });
    } catch (err) {
      console.error('Error al procesar la venta:', err);
      alert('Error al procesar la venta');
    }
  }

  cargarDatosRelacionados(): void {
    this.alquilerService.getEmpleados().subscribe(data => this.empleados = data);
    this.alquilerService.getClientes().subscribe(data => this.clientes = data);
    console.log(this.clientes);
    this.alquilerService.getNotarios().subscribe(data => this.notarios = data);
    this.inmoService.getPropiedades().subscribe(data => {
      this.propiedades = data;
      this.propiedadesActivas = this.propiedades.filter(p => p.estado_inmueble != 'Completado' && p.objetivo == 'Venta');
    });
  }

  selectMenuItem(item: any): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
  }

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onSelectPropiedad(event: any): void {
    const propiedadSeleccionada = this.propiedades.find(p => p.id_inmueble == event.target.value);
    if (propiedadSeleccionada) {
      console.log(propiedadSeleccionada.id_inmueble);
      this.registroForm.patchValue({
        pago_venta: propiedadSeleccionada.precio,
        propietario_inmueble: propiedadSeleccionada.propietario_inmueble?.id_persona,
        id_inmueble: propiedadSeleccionada.id_inmueble
      });
      this.pagoVenta = propiedadSeleccionada.precio;
      this.propietarioInmueble = propiedadSeleccionada.propietario_inmueble;
      console.log(this.pagoVenta);
    }
  }
}