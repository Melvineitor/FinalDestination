import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PersonaComponent } from './persona/persona.component';
import { AppComponent } from './app.component';
import { dashboardComponent } from './dashboard/dashboard.component';
import { PropiedadComponent } from './propiedad/propiedad.component';
import { AlquilerComponent } from './alquiler/alquiler.component';
import { CitaComponent } from './cita/cita.component';
import { VentaComponent } from './venta/venta.component';
import { PagoComponent } from './pago/pago.component';
import { PerfilComponent } from './perfil/perfil.component';
import { LandingComponent } from './landing/landing.component';
import { RegistroPersonaComponent } from './persona/registro-persona/registro-persona.component';
import { RegistroPropiedadComponent } from './propiedad/registro-propiedad/registro-propiedad.component';
import { RegistrarPagoComponent } from './pago/registrar-pago/registrar-pago.component';
import { RegistroAlquilerComponent } from './alquiler/registro-alquiler/registro-alquiler.component';
import { AuthGuard } from './auth.guard';
import { RegistroVentaComponent } from './venta/registro-venta/registro-venta.component';

export const routes: Routes = [
    {path: 'landing', component: LandingComponent, pathMatch: 'full'},
    {path: '', redirectTo: 'landing', pathMatch: 'full'},
    {path: 'dashboard', component: dashboardComponent, canActivate: [AuthGuard]},
    {path: 'persona', component: PersonaComponent},
    {path: 'propiedad', component: PropiedadComponent},
    {path: 'alquiler', component: AlquilerComponent},
    {path: 'cita', component: CitaComponent},
    {path: 'venta', component: VentaComponent},
    {path: 'pago', component: PagoComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'registroPersona', component: RegistroPersonaComponent},
    {path: 'registroPropiedad', component: RegistroPropiedadComponent },
    {path: 'registroPago', component: RegistrarPagoComponent},
    {path: 'registroAlquiler', component:RegistroAlquilerComponent},
    {path: 'registroVenta', component:RegistroVentaComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
