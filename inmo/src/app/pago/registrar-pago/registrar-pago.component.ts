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
propiedades: any;

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      id_inmueble: ['', Validators.required],
      tipo_transaccion: ['', Validators.required],
      fecha_transaccion: ['', Validators.required],
      monto_transaccion: ['', Validators.required],
      id_inquilino: ['', Validators.required],
      nombre_agente: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.inmoService.getPropiedades().subscribe((data) => {
      this.propiedades = data;
    });
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
