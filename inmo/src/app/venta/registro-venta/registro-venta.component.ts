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
  empleados: Persona[] = [];
  clientes: Persona[] = [];
  fiadores: Persona[] = [];
  notarios: Persona[] = [];
  propiedades: Inmueble[] = [];
  propietarios: Persona[] = [];
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
  pagoAlquiler: number | null = null;
  propietarioInmueble: { id_persona: number; nombre_persona: string; apellido_persona: string; } | null | undefined;
  propiedadesActivas: Inmueble[] = [];

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router, private alquilerService: AlquilerService) {
    this.registroForm = this.fb.group({
      fecha_venta: ['', Validators.required],
      pago_venta: ['', [Validators.required, Validators.min(0)]],
      propiedad_venta: ['', Validators.required],
      empleado_venta: ['', Validators.required],
      cliente_venta: ['', Validators.required],
      fiador_venta: ['', Validators.required],
      notario_venta: ['', Validators.required],
      contrato_venta: ['', Validators.required],
      inmueble_venta: ['', Validators.required],
      estado_venta: ['Completado', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar empleados
    this.alquilerService.getEmpleados().subscribe(data => this.empleados = data);
    this.alquilerService.getClientes().subscribe(data => this.clientes = data);
    this.alquilerService.getFiadores().subscribe(data => this.fiadores = data);
    this.alquilerService.getNotarios().subscribe(data => this.notarios = data);
    this.inmoService.getPropiedades().subscribe(data => {this.propietarios = data;
      console.log("Propietarios: " +this.propietarios);
      this.propiedadesActivas = this.propiedades.filter(p => p.estado_inmueble != 'Completado' && p.objetivo == 'Venta');
    });
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    try {
      const ventaData: VentaCrear = this.registroForm.value;
      this.inmoService.createVenta(ventaData).subscribe({
        next: (response: any) => {
          alert('Venta registrada correctamente');
          this.router.navigate(['/venta']);
        },
        error: (error: any) => {
          alert('Error al registrar la venta');
          console.error('Error:', error);
        }
      });
    } catch (err) {
      alert('Error al procesar la venta');
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
  onSelectPropiedad(event: any): void {
    const propiedadSeleccionada = this.propiedades.find(p => p.id_inmueble == event.target.value);
    if (propiedadSeleccionada) {
      this.registroForm.patchValue({
        pago_alquiler: propiedadSeleccionada.precio,
        propietario_inmueble: propiedadSeleccionada.propietario_inmueble?.id_persona,
        id_inmueble: propiedadSeleccionada.id_inmueble
      });
      this.pagoAlquiler = propiedadSeleccionada.precio;
      this.propietarioInmueble = propiedadSeleccionada.propietario_inmueble;
      console.log(this.pagoAlquiler);
    }
  }
}
