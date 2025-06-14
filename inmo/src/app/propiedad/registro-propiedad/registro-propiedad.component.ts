import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { Persona } from '../../inmobilaria.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registro-persona',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-propiedad.component.html',
  styleUrl: './registro-propiedad.component.css'
})
export class RegistroPropiedadComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  propietarios?: Persona[];
  selectedTipoInmueble: string = '';
  areaTotalSubscription: Subscription | undefined;
  precioMetros: number = 0;
  areaTotal: number = 0;
  precioMetrosSubscription: Subscription | undefined;
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
      propietario_inmueble: 0,
      tipo_inmueble: ['', Validators.required],
      cant_niveles: [0],
      cant_habitaciones: [0],
      cant_banos: [0],
      cant_parqueos: [0],
      cuarto_servicio: [''],
      modulo_local: [''],
      plaza_local: [''],
      nivel_apt: [0],
      objetivo: ['', Validators.required],
      precio: [0],
      metros_ancho: [0],
      metros_largo: [0],
      area_total: [0],
      negociable: ['', Validators.required],
      estado_inmueble: ['Disponible', Validators.required],
      descripcion_detallada: [''],
      ciudad_direccion: ['', Validators.required],
      zona: ['', Validators.required],
      calle: ['', Validators.required],
      sector: ['', Validators.required],
      especificaciones_direccion: [''],
      provincia: ['', Validators.required],
      codigo_referencia: ['', Validators.required],
      precioMetros: [''],
    });
  }

  ngOnInit() {
    this.inmoService.getPersonas().subscribe((persona: Persona[]) => {
      this.propietarios = persona
        .filter(p => p.rol_persona.toLowerCase() === 'propietario')
        .map(p => ({
          ...p,
          propietario: Number(p.id_persona)
        }));
    });
  }

  onTipoInmuebleChange(event: any) {
    this.selectedTipoInmueble = event.target.value;
    this.resetCamposEspecificos();
    
    // Remove existing subscriptions if they exist

    // Only set up price calculation for Solar type
    if (this.selectedTipoInmueble === 'Solar') {
      this.areaTotalSubscription = this.registroForm.get('area_total')?.valueChanges.subscribe(() => this.calcularPrecio());
      this.precioMetrosSubscription = this.registroForm.get('precioMetros')?.valueChanges.subscribe(() => this.calcularPrecio());
    } else {
      // Reset price when not Solar
      this.registroForm.get('precio')?.setValue(0);
      this.registroForm.get('area_total')?.setValue(0);
    }
  }

  resetCamposEspecificos() {
    // Resetear todos los campos específicos
    this.registroForm.patchValue({
      cant_niveles: 0,
      cant_habitaciones: 0,
      cant_banos: 0,
      cant_parqueos: 0,
      cuarto_servicio: '',
      modulo_local: '',
      plaza_local: '',
      nivel_apt: 0,
      metros_ancho: 0,
      metros_largo: 0,
      area_total: 0,
    });
  }

  mostrarCampos(tipo: string): boolean {
    return this.selectedTipoInmueble === tipo;
  }

  calcularPrecio(): void {
    const areaTotal = this.registroForm.get('area_total')?.value;
    const precioMetros = this.registroForm.get('precioMetros')?.value;
  
    console.log('Area Total:', areaTotal);
    console.log('Precio por Metro:', precioMetros);
  
    // Validar que ambos tengan valor antes de calcular
    if (areaTotal != null && areaTotal !== 0 && precioMetros != null && precioMetros !== 0) {
      this.areaTotal = areaTotal;
      this.precioMetros = precioMetros;
  
      const precio = areaTotal * precioMetros;
      this.registroForm.get('precio')?.setValue(precio, { emitEvent: false });
    } else {
      // Opcional: borrar el precio si los datos no están completos
      this.registroForm.get('precio')?.setValue(0, { emitEvent: false });
    }
  }
  

  async onSubmit() {
    console.log('onSubmit ejecutado'); // Debug: confirmar que se ejecuta
    console.log('Estado del formulario:', this.registroForm.valid);
    console.log('Errores del formulario:', this.registroForm.errors);
    console.log('Valores del formulario:', this.registroForm.value);
  
    // Mostrar errores específicos de campos si el formulario es inválido
    if (this.registroForm.invalid) {
      console.log('Formulario inválido');
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} es inválido:`, control.errors);
        }
      });
      alert('Por favor, complete todos los campos requeridos');
      return;
    }
  
    this.calcularPrecio();
  
    // 1. Crear dirección primero
    const direccionData = {
      ciudad_direccion: this.registroForm.get('ciudad_direccion')?.value,
      zona: this.registroForm.get('zona')?.value,
      calle: this.registroForm.get('calle')?.value,
      sector: this.registroForm.get('sector')?.value,
      especificaciones_direccion: this.registroForm.get('especificaciones_direccion')?.value,
      provincia: this.registroForm.get('provincia')?.value,
    };
    
    console.log('Datos enviados a crearDireccion:', direccionData);
  
    try {
      console.log('Intentando crear dirección...');
      const direccionResp = await this.inmoService.crearDireccion(direccionData).toPromise();
      console.log('Respuesta de dirección:', direccionResp);
      
      const direccionId = direccionResp.id_direccion;
      
      // 2. Preparar datos de inmueble
      const formData = { ...this.registroForm.value };
      formData.direccion_inmueble = direccionId;
      
      // Elimina los campos de dirección del objeto a enviar
      delete formData.ciudad_direccion;
      delete formData.zona;
      delete formData.calle;
      delete formData.sector;
      delete formData.especificaciones_direccion;
      delete formData.provincia;
      
      // 3. Crear inmueble
      console.log('Datos enviados al backend para inmueble:', formData);
      console.log('Intentando crear inmueble...');
      
      this.inmoService.createPropiedad(formData).subscribe({
        next: (res) => {
          console.log('Respuesta exitosa del inmueble:', res);
          alert('Inmueble guardado correctamente');
          this.registroForm.reset();
        },
        error: (err) => {
          console.error('Error al guardar el inmueble:', err);
          alert(`Error al guardar el inmueble: ${err.message || err}`);
        }
      });
      
    } catch (err) {
      console.error('Error al guardar la dirección:', err);
      alert(`Error al guardar la dirección: ${err instanceof Error ? err.message : String(err)}`);
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

  ngOnDestroy() {
    if (this.areaTotalSubscription) {
      this.areaTotalSubscription.unsubscribe();
    }
    if (this.precioMetrosSubscription) {
      this.precioMetrosSubscription.unsubscribe();
    }
  }
}
