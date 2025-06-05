import { Component, OnInit } from '@angular/core';
import { InmoService } from '../inmo.service';
import { Alquiler, Cita } from '../inmobilaria.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.css'
})
export class CitaComponent implements OnInit {
  citas: Cita[] = [];
  citasFiltradas: Cita[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedFilter: string = '';
  estados: string[] = ['Todos', 'Programada','Cancelada','Reprogramada','Completada','No Asistida','Pendiente de Confirmacion'];

  constructor(private inmoService: InmoService){}
  ngOnInit(): void {
    this.inmoService.getCitas().subscribe((data: Cita[]) => {
      this.citas = data;
      this.filtrarCitas();
      this.totalItems = this.citas.length;
      console.log(data);
    });
  }

  filtrarCitas(): void {
    let filtradas = this.citas;
    if (this.selectedFilter && this.selectedFilter !== 'Todos') {
      filtradas = filtradas.filter(c => (c.estado_cita || '').toLowerCase() === this.selectedFilter.toLowerCase());
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(c =>
        (c.motivo_cita && c.motivo_cita.toLowerCase().includes(term)) ||
        (c.nombre_empleado && c.nombre_empleado.toLowerCase().includes(term)) ||
        (c.nombre_cliente && c.nombre_cliente.toLowerCase().includes(term)) ||
        (c.estado_cita && c.estado_cita.toLowerCase().includes(term))
      );
    }
    this.citasFiltradas = filtradas;
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
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
    { name: 'Cita', icon: '📅', active: true, link: '/cita' },
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
