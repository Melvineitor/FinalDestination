import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { AlquilerService } from '../../alquiler/registro-alquiler/alquiler.service';
import { Inmueble, Inquilino } from '../../inmobilaria.models';

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
  selectedTipoTransaccion: string = '';

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
propiedades: any;
inquilinos: any;
propiedadesActivas: any;
  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router, private alquilerService: AlquilerService) {
    this.registroForm = this.fb.group({
      id_inmueble: [''],
      tipo_transaccion: ['', Validators.required],
      fecha_transaccion: ['', Validators.required],
      monto_transaccion: ['', Validators.required],
      id_inquilino: [''],
      nombre_agente: [''],
      motivo_pago: [''],
    });
  }

  ngOnInit(): void {
    this.inmoService.getPropiedades().subscribe((propiedad: Inmueble[]) => {
      this.propiedades = propiedad
      
      .map(p => ({
        ...p,
        id_inmueble: Number(p.id_inmueble)
      }));
      this.propiedadesActivas = this.propiedades.filter((p: { estado_inmueble: string; objetivo: string; }) => p.estado_inmueble == 'Activo' || p.estado_inmueble == 'Disponible' && p.objetivo == 'Alquiler' || p.objetivo == 'Venta');
      console.log(this.propiedades);
    });
    this.alquilerService.getClientes().subscribe((cliente: Inquilino[]) => {
      this.inquilinos = cliente
      .map(c => ({
        ...c,
        id_cliente: Number(c.id_cliente)
      }));
    });
  }

  onPropiedadChange(event: any) {
    const selectedPropertyId = event.target.value;
    
    if (selectedPropertyId) {
      // Buscar la propiedad seleccionada
      const propiedadSeleccionada = this.propiedades.find(
        (        propiedad: { id_inmueble: any; }) => propiedad.id_inmueble == selectedPropertyId
      );
      
      if (propiedadSeleccionada) {
        // Actualizar el campo de monto con el precio de la propiedad
        this.registroForm.patchValue({
          monto_transaccion: propiedadSeleccionada.precio
        });
      }
    } else {
      // Si no hay selección, limpiar el monto
      this.registroForm.patchValue({
        monto_transaccion: ''
      });
    }
  }
  onTipoTransaccionChange(event: any) {
    this.selectedTipoTransaccion = event.target.value;
  }
  mostrarCampos(tipo: string): boolean {
    return this.selectedTipoTransaccion === tipo;
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    try {

      const pagoData = {
        fecha_transaccion: this.registroForm.get('fecha_transaccion')?.value,
        tipo_transaccion: this.registroForm.get('tipo_transaccion')?.value,
        monto_transaccion: this.registroForm.get('monto_transaccion')?.value,
        id_inquilino: this.registroForm.get('id_inquilino')?.value,
        id_inmueble: this.registroForm.get('id_inmueble')?.value,
        nombre_agente: this.registroForm.get('nombre_agente')?.value,
        motivo_pago: this.registroForm.get('motivo_pago')?.value,
      };

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
