import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService } from '../../inmo.service';
import { Router } from '@angular/router';
import { Persona, VentaCrear } from '../../inmobilaria.models';

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
  propietarios: Persona[] = [];
  propiedades: any[] = [];
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

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      fecha_venta: ['', Validators.required],
      pago_venta: ['', [Validators.required, Validators.min(0)]],
      propiedad_venta: ['', Validators.required],
      empleado_venta: ['', Validators.required],
      cliente_venta: ['', Validators.required],
      fiador_venta: ['', Validators.required],
      notario_venta: ['', Validators.required],
      contrato_venta: ['', Validators.required],
      inmueble_venta: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar empleados
    this.inmoService.getPersonas().subscribe(
      (personas: Persona[]) => {
        this.clientes = personas.filter(p => p.rol_persona === 'Inquilino');
        this.propietarios = personas.filter(p => p.rol_persona === 'Propietario');
        console.log(this.empleados);
      },
      (error) => {
        console.error('Error al cargar personas:', error);
      }
    );

    // Cargar propiedades disponibles
    this.inmoService.getPropiedades().subscribe(
      (propiedades) => {
        this.propiedades = propiedades.filter(p => p.estado_inmueble === 'Disponible');
        console.log(this.propiedades);
      },
      (error) => {
        console.error('Error al cargar propiedades:', error);
      }
    );
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
}
