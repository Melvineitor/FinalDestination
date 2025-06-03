export interface Inquilino {
  id_cliente: number;
  persona_cliente: number;
  empleo_cliente: string;
  cargo_cliente: string;
  sueldo_cliente: number;
  antiguo_arrendador_cliente: string;
  total_ingresos_cliente: number;
}

export interface Persona {
  id_persona: number;
  nombre_persona: string;
  apellido_persona: string;
  rol_persona: string; 
  edad: number;
  telefono: string;
  correo_persona: string;
  cedula_pasaporte: string;
  sexo_persona: string;
  estado_civil: string;
  domicilio: string;
  contrasena: string;
  estado_persona: string;
  pais_origen: string;
  comentario: string;
}

export interface Propiedad {
  id_propiedad: number;
  titulo: string;
  m_ancho: number;
  m_largo: number;
  metros_cuadrados: number;
  descripcion: string;
  precio_venta?: number; // opcional
  precio_alquiler?: number; // opcional
  direccion_propiedad: number;
  /** Enum: 'Disponible' | 'No disponible' | 'Vendida' | 'Alquilada' | 'En negociación' | 'Reservada' | 'En mantenimiento' | 'Fuera de mercado' | 'Pendiente de documentación' */
  estado_propiedad: string;
}

export interface Alquiler {
empleado_alquiler: any;
  id_alquiler: number;
  fecha_alquiler: Date;
  fecha_fin_alquiler: Date;
  pago_alquiler: number;
  plazo_pago: string;
  id_propiedad: number;
  nombre_empleado: string;
  nombre_cliente: string;
  nombre_fiador: string;
  nombre_notario: string;
  id_contrato: number;
  estado_alquiler: string;
  especificaciones_direccion: string;
}


export interface Cita{
  id_cita: number;
  fecha_cita: Date;
  hora_cita: string;
  motivo_cita: string;
  nombre_empleado: string;
  nombre_cliente: string;
  estado_cita: string;
}
export interface Venta{
  id_venta: number;
  fecha_venta: Date;
  pago_venta: number;
  id_propiedad: number;
  nombre_empleado: string;
  nombre_cliente: string;
  nombre_fiador: string;
  nombre_notario: string;
  id_contrato: number;
  estado_venta: string;
  tipo_inmueble: string;
}
export interface Pago{
  id_pago: number;
  fecha_pago: Date;
  metodo_pago: string;
  motivo_pago: string;
  desc_pago: string;
  tipo_contrato: string;
  descripcion_penalidad: string;
  compania_tarjeta: string;
  monto_pagado: number;
  estado_pago: string;
  nombre_agente: string;
}
export interface PagoCrear {
  fecha_pago: Date;
  metodo_pago: string;
  motivo_pago: string;
  desc_pago: string;
  tipo_contrato: number;
  descripcion_penalidad: number;
  compania_tarjeta: number;
  monto_pagado: number;
  estado_pago: string;
  nombre_agente: number;
}
export interface Admin {
  id_admin: number;
  nombre_admin: string;
  apellido_admin: string;
  correo_admin: string;
  telefono_admin: string;
  cargo_admin: string;
  pais_admin: string;
  ciudad_admin: string;
  codigo_postal: string;
  nombre_usuario: string;
  contrasena: string;
}

export interface Inmueble {
propietario: any;
  id_inmueble: number;
  propietario_inmueble: string;
  tipo_inmueble: string;
  cant_niveles?: number;
  cant_habitaciones?: number;
  cant_banos?: number;
  cant_parqueos?: number;
  cuarto_servicio?: number;
  modulo_local?: string;
  plaza_local?: string;
  nivel_apt?: number;
  uso_espacio?: string;
  objetivo: string;
  precio: number;
  metros_ancho: string;
  metros_largo: string;
  direccion_inmueble: number;
  estado_inmueble: string;
  descripcion_detallada: string;
}

