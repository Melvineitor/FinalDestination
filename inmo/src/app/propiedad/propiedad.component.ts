import { Component, OnInit } from '@angular/core';
import { InmoService } from '../inmo.service';
import { Inmueble, Propiedad } from '../inmobilaria.models';
import { CommonModule,  } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './propiedad.component.html',
  styleUrl: './propiedad.component.css'
})
export class PropiedadComponent implements OnInit {
  propiedades: Inmueble[] = [];
  propiedadesFiltradas: Inmueble[] = [];
  selectedTipo: string = '';
  selectedObjetivo: string = '';
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  searchTerm: string = '';
  selectedFilter: string = '';


  constructor(private inmoService: InmoService){}
  ngOnInit(): void {
    this.inmoService.getPropiedades().subscribe((data: Inmueble[]) => {
      this.propiedades = data;
      this.filtrarPorTipo();
      this.totalItems = this.propiedades.length;
      console.log(data);
    });
  }

  filtrarPorTipo(): void {
    let filtradas = this.propiedades;
    if (this.selectedTipo) {
      filtradas = filtradas.filter(p => p.tipo_inmueble === this.selectedTipo);
    }
    if (this.selectedObjetivo) {
      filtradas = filtradas.filter(p => (p.objetivo || '').toLowerCase() === this.selectedObjetivo.toLowerCase());
    }
    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase();
      filtradas = filtradas.filter(p =>
        (p.propietario && p.propietario.toLowerCase().includes(term)) ||
        (p.direccion_inmueble && p.direccion_inmueble.toString().toLowerCase().includes(term)) ||
        (p.tipo_inmueble && p.tipo_inmueble.toLowerCase().includes(term)) ||
        (p.estado_inmueble && p.estado_inmueble.toLowerCase().includes(term)) ||
        (p.descripcion_detallada && p.descripcion_detallada.toLowerCase().includes(term)) ||
        (p.objetivo && p.objetivo.toLowerCase().includes(term))
      );
    }
    this.propiedadesFiltradas = filtradas;
  }

  mostrarColumna(campo: string): boolean {
    if (!this.selectedTipo || this.selectedTipo === '') return true;
    const columnasPorTipo: any = {
      Casa: ['id_inmueble','propietario','tipo_inmueble','cant_niveles','cant_habitaciones','cant_banos','cant_parqueos','cuarto_servicio','metros_ancho','metros_largo','direccion','estado_inmueble','descripcion_detallada','precio'],
      Apartamento: ['id_inmueble','propietario','tipo_inmueble','cant_niveles','cant_habitaciones','cant_banos','cant_parqueos','nivel_apt','metros_ancho','metros_largo','direccion','estado_inmueble','descripcion_detallada','precio'],
      Local: ['id_inmueble','propietario','tipo_inmueble','modulo_local','plaza_local','uso_espacio','metros_ancho','metros_largo','direccion','estado_inmueble','descripcion_detallada','precio'],
      Edificio: ['id_inmueble','propietario','tipo_inmueble','cant_niveles','metros_ancho','metros_largo','direccion','estado_inmueble','descripcion_detallada','precio'],
      Solar: ['id_inmueble','propietario','tipo_inmueble','metros_ancho','metros_largo','direccion','estado_inmueble','descripcion_detallada','precio']
    };
    return columnasPorTipo[this.selectedTipo]?.includes(campo) ?? true;
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
    { name: 'Propiedad', icon: '🏢', active: true, link: '/propiedad' },
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
