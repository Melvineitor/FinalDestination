import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Persona } from '../inmobilaria.models';
import { InmoService } from '../inmo.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  personas: Persona[] = [];
  filteredPersonas: Persona[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedFilter: string = '';
  roles: string[] = [];

  constructor(private inmoService: InmoService){}
  ngOnInit(): void {
    this.inmoService.getPersonas().subscribe((data: Persona[]) => {
      this.personas = data;
      this.extractRoles();
      this.filtrarPersonas();
      console.log(data);
    });
  }

  extractRoles(): void {
    const uniqueRoles = new Set(this.personas.map(p => p.rol_persona).filter(r => r && r.trim() !== ''));
    this.roles = Array.from(uniqueRoles);
  }

  filtrarPersonas(): void {
    let filtradas = this.personas;
    if (this.selectedFilter && this.selectedFilter !== 'Todos') {
      filtradas = filtradas.filter(p => p.rol_persona === this.selectedFilter);
    }
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(p =>
        (p.nombre_persona && p.nombre_persona.toLowerCase().includes(term)) ||
        (p.apellido_persona && p.apellido_persona.toLowerCase().includes(term)) ||
        (p.cedula_pasaporte && p.cedula_pasaporte.toLowerCase().includes(term)) ||
        (p.telefono && p.telefono.toLowerCase().includes(term)) ||
        (p.sexo_persona && p.sexo_persona.toLowerCase().includes(term)) ||
        (p.estado_civil && p.estado_civil.toLowerCase().includes(term)) ||
        (p.domicilio && p.domicilio.toLowerCase().includes(term)) ||
        (p.estado_persona && p.estado_persona.toLowerCase().includes(term)) ||
        (p.rol_persona && p.rol_persona.toLowerCase().includes(term))
      );
    }
    this.filteredPersonas = filtradas;
    this.totalItems = filtradas.length;
  }

  onRoleChange(event: any): void {
    this.selectedFilter = event.target.value;
    this.filtrarPersonas();
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
    { name: 'Persona', icon: '👤', active: true, link: '/persona' },
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
