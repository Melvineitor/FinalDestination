import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pago, Comision, Transaccion, Propiedad, Inmueble } from '../inmobilaria.models';
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
  transacciones: Transaccion[] = [];
  comisiones: Comision[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedTipoContrato: string = '';
  selectedEstado: string = '';
  selectedAgente: string = '';
  tiposTransaccion: string[] = [];
  tiposComision: string[] = [];
  estadosTransaccion: string[] = [];
  agentes: string[] = [];
  personas: string[] = [];
  transaccionesFiltrados: Transaccion[] = [];
  propiedades: Inmueble[] = [];
  constructor(private inmoService: InmoService){}
  ngOnInit(): void {
    this.inmoService.getTransacciones().subscribe((data: Transaccion[]) => {
      this.transacciones = data;
      this.tiposTransaccion = Array.from(new Set(data.map(p => p.tipo_transaccion)));
      this.estadosTransaccion = Array.from(new Set(data.map(p => p.id_inquilino.toString())));
      this.agentes = Array.from(new Set(data.map(p => p.nombre_agente)));
      this.filtrarTransacciones();
      this.totalItems = this.transacciones.length;
      console.log(this.transacciones);
    });
    this.inmoService.getComisiones().subscribe((data: Comision[]) => {
      this.comisiones = data;
      this.tiposComision = Array.from(new Set(data.map(p => p.tipo_transaccion)));
      this.filtrarComisiones();
      console.log(this.comisiones);
    });
    this.inmoService.getPropiedades().subscribe((data: Inmueble[]) => {
      this.propiedades = data.map(p => ({
        ...p,
        id_inmueble: Number(p.id_inmueble)
      }));
    });
  }

  filtrarTransacciones(): void {
    let filtrados = this.transacciones;
    if (this.selectedTipoContrato) {
      filtrados = filtrados.filter(p => p.tipo_transaccion === this.selectedTipoContrato);
    }
    if (this.selectedEstado) {
      filtrados = filtrados.filter(p => p.id_inquilino.toString() === this.selectedEstado);
    }
    if (this.selectedAgente) {
      filtrados = filtrados.filter(p => p.nombre_agente === this.selectedAgente);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtrados = filtrados.filter(p =>
        (p.tipo_transaccion && p.tipo_transaccion.toLowerCase().includes(term)) ||
        (p.id_inquilino && p.id_inquilino.toString().toLowerCase().includes(term)) ||
        (p.nombre_agente && p.nombre_agente.toLowerCase().includes(term))
      );
    }
    this.transaccionesFiltrados = filtrados;
    this.totalItems = filtrados.length;
  }
  filtrarComisiones(): void {
    let filtrados = this.comisiones;
    if (this.selectedTipoContrato) {
      filtrados = filtrados.filter(p => p.tipo_transaccion === this.selectedTipoContrato);
    }
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
