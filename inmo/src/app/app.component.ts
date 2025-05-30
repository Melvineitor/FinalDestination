import { Component, OnInit, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { InmoService } from './inmo.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Users } from 'lucide-angular';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [CommonModule, LucideAngularModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
@Injectable({
  providedIn: 'root'})
export class AppComponent{
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor() {
    // Borra 'admin' cada vez que se recarga la página
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem('admin');
    }
  }
}
