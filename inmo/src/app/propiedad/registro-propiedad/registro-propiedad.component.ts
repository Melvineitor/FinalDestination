import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { Persona } from '../../inmobilaria.models';

@Component({
  selector: 'app-registro-persona',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-propiedad.component.html',
  styleUrl: './registro-propiedad.component.css'
})
export class RegistroPropiedadComponent implements OnInit {
  registroForm: FormGroup;
  propietarios: Persona[] = [];
  selectedTipoInmueble: string = '';
  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/dashboard' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: true, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
    { name: 'Cita', icon: '📅', active: false, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: false, link: '/perfil' },
  ];

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      propietario_inmueble: ['', Validators.required],
      tipo_inmueble: ['', Validators.required],
      cant_niveles: [null],
      cant_habitaciones: [null],
      cant_banos: [null],
      cant_parqueos: [null],
      cuarto_servicio: [null],
      modulo_local: [null],
      plaza_local: [null],
      nivel_apt: [null],
      uso_espacio: [null],
      objetivo: ['', Validators.required],
      precio: [null],
      metros_ancho: [null, Validators.required],
      metros_largo: [null, Validators.required],
      estado_inmueble: ['', Validators.required],
      descripcion_detallada: [''],
      ciudad_direccion: ['', Validators.required],
      zona: ['', Validators.required],
      calle: ['', Validators.required],
      especificaciones_direccion: [''],
      provincia: ['', Validators.required]
    });

    // Calcula el precio automáticamente cuando cambian ancho o largo
    this.registroForm.get('metros_ancho')?.valueChanges.subscribe(() => this.calcularPrecio());
    this.registroForm.get('metros_largo')?.valueChanges.subscribe(() => this.calcularPrecio());

    this.inmoService.getPersonas().subscribe((personas: Persona[]) => {
      this.propietarios = personas.filter(p => p.rol_persona && p.rol_persona.toLowerCase() === 'propietario');
    });
  }

  ngOnInit() {
    this.inmoService.getPersonas().subscribe(
      (data: any) => {
        this.propietarios = data;
      },
      (error: Error) => {
        console.error('Error al cargar propietarios:', error);
      }
    );
  }

  onTipoInmuebleChange(event: any) {
    this.selectedTipoInmueble = event.target.value;
    this.resetCamposEspecificos();
  }

  resetCamposEspecificos() {
    // Resetear todos los campos específicos
    this.registroForm.patchValue({
      cant_niveles: null,
      cant_habitaciones: null,
      cant_banos: null,
      cant_parqueos: null,
      cuarto_servicio: null,
      modulo_local: null,
      plaza_local: null,
      nivel_apt: null,
      uso_espacio: null
    });
  }

  mostrarCampos(tipo: string): boolean {
    return this.selectedTipoInmueble === tipo;
  }

  calcularPrecio(): void {
    const ancho = parseFloat(this.registroForm.get('metros_ancho')?.value) || 0;
    const largo = parseFloat(this.registroForm.get('metros_largo')?.value) || 0;
    const precioMetro = 650;
    const metrosCuadrados = ancho * largo;
    const precio = metrosCuadrados * precioMetro;
    this.registroForm.get('precio')?.setValue(precio, { emitEvent: false });
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      return;
    }
    this.calcularPrecio();
    // 1. Crear dirección primero
    const direccionData = {
      ciudad_direccion: this.registroForm.get('ciudad_direccion')?.value,
      zona: this.registroForm.get('zona')?.value,
      calle: this.registroForm.get('calle')?.value,
      especificaciones_direccion: this.registroForm.get('especificaciones_direccion')?.value,
      provincia: this.registroForm.get('provincia')?.value, // Asumiendo que la ciudad es la provincia
    };
    console.log('Datos enviados a crearDireccion:', direccionData);
    try {
      const direccionResp = await this.inmoService.crearDireccion(direccionData).toPromise();
      const direccionId = direccionResp.id_direccion;
      // 2. Preparar datos de inmueble
      const formData = { ...this.registroForm.getRawValue() };
      formData.direccion_inmueble = direccionId;
      // Elimina los campos de dirección del objeto a enviar
      delete formData.ciudad_direccion;
      delete formData.zona;
      delete formData.calle;
      delete formData.especificaciones_direccion;
      delete formData.provincia; 
      // 3. Crear inmueble
      console.log('Datos enviados al backend:', formData);
      this.inmoService.createPropiedad(formData).subscribe({
        next: (res) => {
          alert('Inmueble guardado correctamente');
          this.registroForm.reset();
        },
        error: (err) => {
          alert('Error al guardar el inmueble');
        }
      });
    } catch (err) {
      alert('Error al guardar la dirección');
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
