/**
 * Interfaz que define la estructura de un cliente
 * Refleja exactamente la respuesta del backend
 */
export interface Cliente {
  id: number;
  codigo_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
}

/**
 * Interfaz para enviar datos al backend al crear un cliente
 * (No incluye id ni codigo_cliente, que son generados por el backend)
 */
export interface CreateClienteDTO {
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
}

/**
 * Interfaz para la respuesta del backend al listar clientes
 */
export interface ClienteListResponse {
  success: boolean;
  data: Cliente[];
  count: number;
}

/**
 * Interfaz para la respuesta del backend al crear un cliente
 */
export interface ClienteCreateResponse {
  success: boolean;
  message: string;
  data: Cliente;
}

/**
 * Interfaz para errores del backend
 */
export interface ClienteErrorResponse {
  success: false;
  error?: string;
  errors?: string[];
}