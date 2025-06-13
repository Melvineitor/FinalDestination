import { Component, OnInit } from '@angular/core';
import { InmoService } from '../inmo.service';
import { Venta } from '../inmobilaria.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedFilter: string = '';
  tiposPropiedad: string[] = ['Apartamento', 'Casa', 'Local'];

  constructor(private inmoService: InmoService){}
  ngOnInit(): void {
    this.inmoService.getVentas().subscribe((data: Venta[]) => {
      this.ventas = data;
      this.filtrarVentas();
      this.totalItems = this.ventas.length;
      console.log(data);
    });
  }

  filtrarVentas(): void {
    let filtradas = this.ventas;
    if (this.selectedFilter) {
      filtradas = filtradas.filter(v => v.plazo_pago === this.selectedFilter);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(v =>
        (v.nombre_empleado && v.nombre_empleado.toLowerCase().includes(term)) ||
        (v.nombre_cliente && v.nombre_cliente.toLowerCase().includes(term)) ||
        (v.nombre_notario && v.nombre_notario.toLowerCase().includes(term)) ||
        (v.id_inmueble && v.id_inmueble.toString().toLowerCase().includes(term)) ||
        (v.plazo_pago && v.plazo_pago.toLowerCase().includes(term))
      );
    }
    this.ventasFiltradas = filtradas;
    this.totalItems = filtradas.length;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage(): void {
    this.currentPage++;
  }

  exportar(): void {
    console.log('Exportando datos...');
  }

  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: true, link: '/venta' },
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
}
