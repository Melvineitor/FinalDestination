import { Component, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { InmoService } from '../inmo.service';
import { Injectable } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { LucideAngularModule, Users } from 'lucide-angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
@Injectable({
  providedIn: 'root'})
export class dashboardComponent implements AfterViewInit {

  
  inquilinos: any[] | number = [];
  pagos: any[] | number = [];
  pagosEstados!: any[] | [];
  barras!: any[] | [];
  title = 'inmo';
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;
  
  private pieChart!: Chart<'pie', number[], string>;
  private barChart!: Chart<'bar', number[], string>;

  constructor(private inmoService: InmoService, private router: Router) {
    Chart.register(PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  }
  
  menuItems = [
    { name: 'Inicio', icon: '🏠', active: true, link: '/dashboard' },
    { name: 'Persona', icon: '👤', active: false, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
    { name: 'Cita', icon: '📅', active: false, link: '/cita' },
    { name: 'Perfil', icon: '👤', active: false, link: '/perfil' },
  ];

  // Datos para las tarjetas

  cards = [
    { title: 'Total de Clientes', value: 0, percentage: '+12% este mes' },
    { title: 'Pagos Recibidos', value: 0, percentage: '+8% este mes'  }
  ];

  ngAfterViewInit(): void {
    this.inmoService.getClientes().subscribe((data: any) => {
      this.inquilinos = data;
      //Actualizar el valor de las cartas despues de conseguir la data
      this.cards[0].value = Array.isArray(this.inquilinos) ? this.inquilinos.length : this.inquilinos;
      console.log(this.inquilinos);
    });
    this.inmoService.getPagos().subscribe((data: any) => {
      this.pagos = data;
      //Actualizar el valor de las cartas despues de conseguir la data
      this.cards[1].value = Array.isArray(this.pagos) ? this.pagos.length : this.pagos;
      console.log(this.pagos);
    });
    this.inmoService.getPagosEstados().subscribe((data: any) => {
      this.pagosEstados = data;
      console.log(data);
    });
    this.inmoService.getBarras().subscribe((data: any) => {
      this.barras = data;
      console.log(data);
      this.initializeCharts();
    });
     this.initializeCharts();
  }
  
  //buscador
 private onSearch() {
throw new Error('Method not implemented.');
}

//Menu
isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  private initializeCharts(): void {
    this.pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Completo', 'Reembolsado', 'Incompleto'],
        datasets: [{
          data: [this.pagosEstados[1]?.cantidad_registros, this.pagosEstados[0]?.cantidad_registros, this.pagosEstados[2]?.cantidad_registros],
          backgroundColor: [
            '#28a745',
            '#ffc107',
            '#e63946'
          ],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Cobros por Recaudar',
            font: {
              size: 200
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });

    // Bar Chart - Ventas por mes
    this.barChart = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [{
          label: 'Ventas',
          data: [this.barras[2]?.total, 1900,  1500, 2800, this.barras[3]?.total, 2200, 2400, 2300, 2600,2000, this.barras[1]?.total, 2700],
          backgroundColor: '#465fff', // Sin fondo sólido
          borderWidth: 1, // Borde grueso para que se vea como línea
          borderRadius: 8, // Sin esquinas redondeadas
          barPercentage: 0.7,
          categoryPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Ventas por Mes',
            font: {
              size: 28
            }
          },
          legend: {
            display: false
          }
        },
        layout: {
          padding: {
            bottom: 40 // Margen inferior para los meses
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              padding: 10 // Espacio extra para los meses
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb'
            }
          }
        }
      }
    });
  }

  selectMenuItem(selectedItem: any): void {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
  }
}
