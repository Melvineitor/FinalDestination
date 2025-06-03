import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const admin = localStorage.getItem('admin');
    if (admin) {
      return true;
    } else {
      this.router.navigate(['/login']); // Ajusta según tu ruta real
      return false;
    }
  }
}