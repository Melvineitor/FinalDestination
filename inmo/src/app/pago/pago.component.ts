import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pago } from '../inmobilaria.models';
import { InmoService } from '../inmo.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedTipoContrato: string = '';
  selectedEstado: string = '';
  selectedAgente: string = '';
  tiposContrato: string[] = [];
  estadosPago: string[] = [];
  agentes: string[] = [];


  constructor(private inmoService: InmoService){}
  ngOnInit(): void {
    this.inmoService.getPagosAlquiler().subscribe((data: Pago[]) => {
      this.pagos = data;
      this.tiposContrato = Array.from(new Set(data.map(p => p.tipo_contrato)));
      this.estadosPago = Array.from(new Set(data.map(p => p.estado_pago)));
      this.agentes = Array.from(new Set(data.map(p => p.nombre_agente)));
      this.filtrarPagos();
      this.totalItems = this.pagos.length;
      console.log(data);
    });
  }

  filtrarPagos(): void {
    let filtrados = this.pagos;
    if (this.selectedTipoContrato) {
      filtrados = filtrados.filter(p => p.tipo_contrato === this.selectedTipoContrato);
    }
    if (this.selectedEstado) {
      filtrados = filtrados.filter(p => p.estado_pago === this.selectedEstado);
    }
    if (this.selectedAgente) {
      filtrados = filtrados.filter(p => p.nombre_agente === this.selectedAgente);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        (p.tipo_contrato && p.tipo_contrato.toLowerCase().includes(term)) ||
        (p.estado_pago && p.estado_pago.toLowerCase().includes(term)) ||
        (p.nombre_agente && p.nombre_agente.toLowerCase().includes(term))
      );
    }
    this.pagosFiltrados = filtrados;
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
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: true, link: '/pago' },
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
