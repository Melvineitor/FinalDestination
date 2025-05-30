import { Component, OnInit } from '@angular/core';
import { InmoService } from '../inmo.service';
import { Admin, Pago } from '../inmobilaria.models';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})

export class PerfilComponent implements OnInit {
  pagos: Pago[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedFilter: string = '';
  admin: Admin | null = null;

  constructor(
    private inmoService: InmoService,
    private adminService: AdminService
  ) {}
  ngOnInit(): void {
   const adminData = localStorage.getItem('admin');
    if (adminData) {
      this.admin = JSON.parse(adminData);
      console.log('Admin cargado desde localStorage:', this.admin);
    } else {
      console.warn('No hay admin en localStorage');
  }
  this.getFotoPerfil();
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
    { name: 'Cita', icon: '📅', active: false, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: true, link: '/perfil' },
  ];

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  selectMenuItem(selectedItem: any): void {
    this.menuItems.forEach((item) => (item.active = false));
    selectedItem.active = true;
  }
  getFotoPerfil(): string {
    if (this.admin?.id_admin === 1) {
      return 'assets/melvin.png';
    } else if (this.admin?.id_admin === 2) {
      return 'assets/cary.png';
    } else {
      return 'assets/images/default.jpg'; // Imagen por defecto si no coincide
    }
  }
  isEditing = false;

guardarCambios() {
 if (this.admin) {
    this.adminService.updateAdmin(this.admin).subscribe(
      response => {
        console.log('Actualizado:', response);
        this.isEditing = false;
        alert('Datos actualizados correctamente');
      },
      error => {
        console.error('Error al actualizar:', error);
        alert('Error al guardar los cambios');
      }
    );
  }
}

cancelarEdicion() {
  // Recargar los datos originales del admin desde localStorage u otro servicio
  const adminData = localStorage.getItem('admin');
  if (adminData) {
    this.admin = JSON.parse(adminData);
  }
  this.isEditing = false;
}
}
