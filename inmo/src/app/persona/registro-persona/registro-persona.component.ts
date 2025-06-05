import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InmoService, Persona, Empleado, Notario, Fiador } from '../../inmo.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registro-persona',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-persona.component.html',
  styleUrl: './registro-persona.component.css'
})
export class RegistroPersonaComponent {
  registroForm: FormGroup;
  selectedRole: string = '';

  constructor(private fb: FormBuilder, private inmoService: InmoService, private router: Router) {
    this.registroForm = this.fb.group({
      nombre_persona: ['', Validators.required],
      apellido_persona: ['', Validators.required],
      rol_persona: ['', Validators.required],
      edad: ['', [Validators.required]],
      telefono: ['', Validators.required],
      correo_persona: ['', [Validators.required, Validators.email]],
      cedula_pasaporte: ['', Validators.required],
      sexo_persona: ['', Validators.required],
      estado_civil_persona: ['', Validators.required],
      domicilio: ['', Validators.required],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      estado_persona: ['', Validators.required],
      pais_origen: ['', Validators.required],
      comentario: [''],
      // Grupos de campos específicos por rol
      empleadoData: this.fb.group({
        id_empleado: [''],
        persona_empleado: [''],
        sueldo_empleado: [''],
        puesto_empleado: ['']
      }),
      notarioData: this.fb.group({
        id_notario: [''],
        matricula_colegio: [''],
        persona_notario: ['']
      }),
      fiadorData: this.fb.group({
        id_fiador_solidario: [''],
        persona_fiador: ['']
      })
    });
  }

  onRoleChange(event: any): void {
    this.selectedRole = event.target.value;
    
    // Resetear los grupos de datos específicos y remover validadores
    const empleadoGroup = this.registroForm.get('empleadoData');
    const notarioGroup = this.registroForm.get('notarioData');
    const fiadorGroup = this.registroForm.get('fiadorData');

    empleadoGroup?.clearValidators();
    notarioGroup?.clearValidators();
    fiadorGroup?.clearValidators();

    empleadoGroup?.reset();
    notarioGroup?.reset();
    fiadorGroup?.reset();

    // Aplicar validadores solo al grupo correspondiente al rol seleccionado
    if (this.selectedRole === 'Empleado') {
      this.registroForm.get('empleadoData.sueldo_empleado')?.setValidators([Validators.required]);
      this.registroForm.get('empleadoData.puesto_empleado')?.setValidators([Validators.required]);
    } else if (this.selectedRole === 'Notario') {
      this.registroForm.get('notarioData.matricula_colegio')?.setValidators([Validators.required]);
    }
    // Para otros roles (Propietario, etc.) no se necesitan validadores adicionales

    // Actualizar validadores
    empleadoGroup?.updateValueAndValidity();
    notarioGroup?.updateValueAndValidity();
    fiadorGroup?.updateValueAndValidity();
  }

  onSubmit(): void {
    // Verificar solo los campos base si no es un rol especial
    const baseFieldsValid = 
      this.registroForm.get('nombre_persona')?.valid &&
      this.registroForm.get('apellido_persona')?.valid &&
      this.registroForm.get('rol_persona')?.valid &&
      this.registroForm.get('edad')?.valid &&
      this.registroForm.get('telefono')?.valid &&
      this.registroForm.get('correo_persona')?.valid &&
      this.registroForm.get('cedula_pasaporte')?.valid &&
      this.registroForm.get('sexo_persona')?.valid &&
      this.registroForm.get('estado_civil_persona')?.valid &&
      this.registroForm.get('domicilio')?.valid &&
      this.registroForm.get('contrasena')?.valid &&
      this.registroForm.get('estado_persona')?.valid &&
      this.registroForm.get('pais_origen')?.valid;

    // Verificar campos adicionales solo si el rol lo requiere
    let roleFieldsValid = true;
    if (this.selectedRole === 'Empleado') {
      roleFieldsValid = this.registroForm.get('empleadoData')?.valid ?? false;
    } else if (this.selectedRole === 'Notario') {
      roleFieldsValid = this.registroForm.get('notarioData')?.valid ?? false;
    }

    if (!baseFieldsValid || !roleFieldsValid) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }

    const formData = this.registroForm.value;
    
    this.inmoService.createPersona(formData).subscribe({
      next: (personaResponse: Persona) => {
        console.log('Persona guardada con éxito:', personaResponse);
        
        // Usar el ID de la persona creada para los datos específicos del rol
        const personaId = personaResponse.id_persona;
        
        // Preparar datos específicos según el rol
        if (this.selectedRole === 'Empleado') {
          const empleadoData = {
            ...formData.empleadoData,
            persona_empleado: personaId
          };
          this.inmoService.createEmpleado(empleadoData).subscribe({
            next: () => {
              alert('Empleado registrado correctamente');
              this.registroForm.reset();
              this.router.navigate(['/persona']);
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al registrar empleado:', err);
              alert('Error al registrar empleado');
            }
          });
        } else if (this.selectedRole === 'Notario') {
          const notarioData = {
            ...formData.notarioData,
            persona_notario: personaId
          };
          this.inmoService.createNotario(notarioData).subscribe({
            next: () => {
              alert('Notario registrado correctamente');
              this.registroForm.reset();
              this.router.navigate(['/persona']);
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al registrar notario:', err);
              alert('Error al registrar notario');
            }
          });
        } else if (this.selectedRole === 'Fiador') {
          const fiadorData = {
            ...formData.fiadorData,
            persona_fiador: personaId
          };
          this.inmoService.createFiador(fiadorData).subscribe({
            next: () => {
              alert('Fiador registrado correctamente');
              this.registroForm.reset();
              this.router.navigate(['/persona']);
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al registrar fiador:', err);
              alert('Error al registrar fiador');
            }
          });
        } else {
          // Para roles que no requieren datos adicionales
          alert('Persona registrada correctamente');
          this.registroForm.reset();
          this.router.navigate(['/persona']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar persona:', err);
        alert('Error al guardar los datos de la persona');
      }
    });
  }

  menuItems = [
    { name: 'Inicio', icon: '🏠', active: false, link: '/' },
    { name: 'Persona', icon: '👤', active: true, link: '/persona' },
    { name: 'Propiedad', icon: '🏢', active: false, link: '/propiedad' },
    { name: 'Alquiler', icon: '🔑', active: false, link: '/alquiler' },
    { name: 'Ventas', icon: '💰', active: false, link: '/venta' },
    { name: 'Pago', icon: '💳', active: false, link: '/pago' },
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
