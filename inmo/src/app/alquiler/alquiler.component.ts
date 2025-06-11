import { Component, OnInit } from '@angular/core';
import { InmoService } from '../inmo.service';
import { Alquiler } from '../inmobilaria.models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './alquiler.component.html',
  styleUrl: './alquiler.component.css'
})
export class AlquilerComponent implements OnInit {
  alquileres: Alquiler[] = [];
  alquileresFiltrados: Alquiler[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedFilter: string = '';
  estados: string[] = ['Todos', 'activo', 'inactivo', 'finalizada', 'cancelado', 'en espera'];

  constructor(private inmoService: InmoService) { }
  ngOnInit(): void {
    this.inmoService.getAlquileres().subscribe((data: Alquiler[]) => {
      this.alquileres = data;
      this.filtrarAlquileres();
      this.totalItems = this.alquileres.length;
      console.log(data);
    });
  }

  filtrarAlquileres(): void {
    let filtrados = this.alquileres;
    if (this.selectedFilter && this.selectedFilter !== 'Todos') {
      filtrados = filtrados.filter(a => (a.estado_alquiler || '').toLowerCase() === this.selectedFilter.toLowerCase());
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(a =>
        (a.nombre_empleado && a.nombre_empleado.toLowerCase().includes(term)) ||
        (a.nombre_cliente && a.nombre_cliente.toLowerCase().includes(term)) ||
        (a.nombre_fiador && a.nombre_fiador.toLowerCase().includes(term)) ||
        (a.nombre_notario && a.nombre_notario.toLowerCase().includes(term)) ||
        (a.contrato_alquiler && a.contrato_alquiler.toLowerCase().includes(term)) ||
        (a.estado_alquiler && a.estado_alquiler.toLowerCase().includes(term)) ||
        (a.especificaciones_direccion && a.especificaciones_direccion.toLowerCase().includes(term)) ||
        (a.plazo_pago && a.plazo_pago.toLowerCase().includes(term)) ||
        (a.fecha_alquiler && a.fecha_alquiler.toString().toLowerCase().includes(term)) ||
        (a.fecha_fin_alquiler && a.fecha_fin_alquiler.toString().toLowerCase().includes(term)) 
      );
    }
    this.alquileresFiltrados = filtrados;
    this.totalItems = filtrados.length;
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

  formatFecha(fecha: string | Date): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
