import { Component, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { InmoService } from '../inmo.service';
import { Injectable } from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import { LucideAngularModule, Users } from 'lucide-angular';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
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
  gananciasMensuales: any[] | [] = [];
  totalGanancias: any | 0 = 0;

  constructor(private inmoService: InmoService, private router: Router, private dashboardService: DashboardService) {
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
    { title: 'Comisiones Recibidas', value: 0, percentage: '+8% este mes'  }
  ];

  ngAfterViewInit(): void {
    this.inmoService.getClientes().subscribe((data: any) => {
      this.inquilinos = data;
      //Actualizar el valor de las cartas despues de conseguir la data
      this.cards[0].value = Array.isArray(this.inquilinos) ? this.inquilinos.length : this.inquilinos;
      console.log(this.inquilinos);
    });
    this.dashboardService.getTotalComisiones().subscribe((data: any) => {
      this.totalGanancias = data;
      //Actualizar el valor de las cartas despues de conseguir la data
      this.cards[1].value = Array.isArray(this.totalGanancias) ? this.totalGanancias.length : this.totalGanancias;
      console.log(this.totalGanancias);
    });
    this.inmoService.getPagosEstados().subscribe((data: any) => {
      this.pagosEstados = data;
      console.log(data);
      // Inicializar el gráfico de pie después de tener los datos
      this.initializeCharts();
    });
    this.dashboardService.getGananciasMensuales().subscribe(data => {
      this.barras = data;
      console.log('Datos recibidos:', data);
      
      // Asegurarnos de que tenemos un array de 12 meses
      const datosMensuales = Array(12).fill(0);
      
      // Llenar el array con los datos recibidos
      this.barras.forEach((item: any) => {
        const mesIndex = item.mes - 1; // Convertir mes a índice 0-11
        datosMensuales[mesIndex] = item.totalGanancia;
      });

      console.log('Datos procesados:', datosMensuales);
      
      // Crear o actualizar el gráfico de barras
      if (this.barChart) {
        this.barChart.destroy();
      }
      
      this.barChart = new Chart(this.barChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{
            label: 'Ganancias',
            data: [this.barras[0].TotalGanancia, this.barras[1].TotalGanancia, this.barras[2].TotalGanancia, this.barras[3].TotalGanancia, this.barras[4].TotalGanancia, this.barras[5].TotalGanancia, this.barras[6].TotalGanancia, this.barras[7].TotalGanancia, this.barras[8].TotalGanancia, this.barras[9].TotalGanancia, this.barras[10].TotalGanancia, this.barras[11].TotalGanancia],
            backgroundColor: '#465fff',
            borderWidth: 1,
            borderRadius: 8,
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
              text: 'Ganancias por Mes',
              font: {
                size: 28
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('es-DO', {
                      style: 'currency',
                      currency: 'DOP'
                    }).format(Number(context.parsed.y));
                  }
                  return label;
                }
              }
            }
          },
          layout: {
            padding: {
              bottom: 40
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                padding: 10
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#e5e7eb'
              },
              ticks: {
                callback: function(value) {
                  return new Intl.NumberFormat('es-DO', {
                    style: 'currency',
                    currency: 'DOP'
                  }).format(Number(value));
                }
              }
            }
          }
        }
      });
    });
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
  }

  selectMenuItem(selectedItem: any): void {
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
  }
}
