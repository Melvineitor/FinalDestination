import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { AlquilerService } from './alquiler.service';
@Component({
  selector: 'app-registrar-alquiler',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro-alquiler.component.html',
  styleUrl: './registro-alquiler.component.css'
})
export class RegistroAlquilerComponent implements OnInit {
empleados: any[] = [];
clientes: any[] = [];
fiadores: any[] = [];
notarios: any[] = [];
propiedades: any[] = [];
selectedPropiedadId: number = 0;
pagoAlquiler: any[] = [];

  registroForm: FormGroup;
  propietarioInmueble: any;
  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router, private alquilerService: AlquilerService) {
    this.registroForm = this.fb.group({
      fecha_alquiler: ['', Validators.required],
      fecha_fin_alquiler: ['', Validators.required],
      pago_alquiler: ['', Validators.required],
      plazo_pago: ['', [Validators.required]],
      propiedad_alquiler: ['', Validators.required],
      empleado_alquiler: ['', Validators.required],
      inquilino_alquiler: ['', Validators.required],
      fiador_alquiler: ['', Validators.required],
      notario_alquiler: ['', Validators.required],
      contrato_alquiler: ['', Validators.required],
      estado_alquiler: ['', Validators.required],
      id_inmueble: ['', Validators.required],
    },
    {
      validators: [this.validarFechas]
    }
  );
  }
  ngOnInit(): void {
   this.cargarDatosRelacionados();
   console.log(this.pagoAlquiler);
  }
  validarFechas(formGroup: AbstractControl) {
    const inicio = formGroup.get('fecha_alquiler')?.value;
    const fin = formGroup.get('fecha_fin_alquiler')?.value;

    if (inicio && fin && new Date(inicio) > new Date(fin)) {
      return { fechaInvalida: true };
    }

    return null;
  }

    onSubmit(): void {
    console.log('Intentando guardar alquiler...');
    if (this.registroForm.invalid) {
      console.warn('Formulario inválido', this.registroForm.errors, this.registroForm.value);
      alert('Formulario Invalido.');
      this.registroForm.markAllAsTouched();
      return;
    }
    console.log('Datos enviados al backend:', this.registroForm.value);
    this.inmoService.crearAlquiler(this.registroForm.value).subscribe({
      next: (res) => {
        console.log('Alquiler guardado con éxito:', res);
        alert('Alquiler  guardado correctamente');
        this.registroForm.reset();
      },
      error: (err) => {
        console.error('Error al guardar alquiler:', err);
        alert('Error al guardar los datos');
      }
    });
  }
cargarDatosRelacionados(): void {
  this.alquilerService.getEmpleados().subscribe(data => this.empleados = data);
  this.alquilerService.getClientes().subscribe(data => this.clientes = data);
  this.alquilerService.getFiadores().subscribe(data => this.fiadores = data);
  this.alquilerService.getNotarios().subscribe(data => this.notarios = data);
  this.inmoService.getPropiedades().subscribe(data => {
    this.propiedades = data;
    console.log(this.propiedades);
  }); 
}

  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: true, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
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
