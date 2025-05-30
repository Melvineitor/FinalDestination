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
      this.applyFilters();
      console.log(data);
    });
  }

  extractRoles(): void {
    const uniqueRoles = new Set(this.personas.map(p => p.rol_persona).filter(r => r && r.trim() !== ''));
    this.roles = Array.from(uniqueRoles);
  }

  applyFilters(): void {
    let filtered = this.personas;
    if (this.selectedFilter && this.selectedFilter !== 'Todos') {
      filtered = filtered.filter(p => p.rol_persona === this.selectedFilter);
    }
    this.filteredPersonas = filtered;
    this.totalItems = filtered.length;
  }

  onRoleChange(event: any): void {
    this.selectedFilter = event.target.value;
    this.applyFilters();
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
