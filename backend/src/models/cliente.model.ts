// ============================================
// 1. INTERFAZ - Define la estructura del cliente
// ============================================
export interface ICliente {
  id: number;
  codigo_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
}

// ============================================
// 2. DTO - Data Transfer Object para creación/actualización
// ============================================
export interface ICreateClienteDTO {
  codigo_cliente: string;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
}

export interface IUpdateClienteDTO {
  nombre?: string;
  direccion?: string | null;
  telefono?: string | null;
}

// ============================================
// 3. CLASE - Implementación con validaciones
// ============================================
export class Cliente implements ICliente {
  id: number;
  codigo_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;

  constructor(data: ICliente) {
    this.id = data.id;
    this.codigo_cliente = data.codigo_cliente;
    this.nombre = data.nombre;
    this.direccion = data.direccion ?? null;
    this.telefono = data.telefono ?? null;
  }

  // ============================================
  // VALIDACIONES
  // ============================================

  /**
   * Valida los datos de un cliente antes de guardarlo
   * @param data - Datos parciales del cliente a validar
   * @returns Array de mensajes de error (vacío si todo está bien)
   */
  static validate(data: Partial<ICliente>): string[] {
    const errors: string[] = [];

    // --- Validación de codigo_cliente ---
    if (data.codigo_cliente !== undefined) {
      if (!data.codigo_cliente || data.codigo_cliente.trim().length === 0) {
        errors.push('El código del cliente es obligatorio');
      } else if (data.codigo_cliente.length > 20) {
        errors.push('El código del cliente no puede exceder los 20 caracteres');
      } else if (!/^[A-Z0-9\-]+$/.test(data.codigo_cliente)) {
        errors.push('El código del cliente solo puede contener letras mayúsculas, números y guiones');
      }
    }

    // --- Validación de nombre ---
    if (data.nombre !== undefined) {
      if (!data.nombre || data.nombre.trim().length === 0) {
        errors.push('El nombre del cliente es obligatorio');
      } else if (data.nombre.length > 100) {
        errors.push('El nombre del cliente no puede exceder los 100 caracteres');
      }
    }

    // --- Validación de direccion ---
    if (data.direccion !== undefined && data.direccion !== null) {
      if (data.direccion.length > 1000) {
        errors.push('La dirección no puede exceder los 1000 caracteres');
      }
    }

    // --- Validación de telefono ---
    if (data.telefono !== undefined && data.telefono !== null) {
      if (data.telefono.length > 20) {
        errors.push('El teléfono no puede exceder los 20 caracteres');
      }
      // Validación básica de formato (solo números, +, -, espacios, paréntesis)
      const telefonoLimpio = data.telefono.replace(/[\s\-\(\)\+]/g, '');
      if (telefonoLimpio && !/^\d+$/.test(telefonoLimpio)) {
        errors.push('El teléfono contiene caracteres no válidos');
      }
    }

    return errors;
  }

  /**
   * Valida un DTO de creación
   */
  static validateCreate(data: ICreateClienteDTO): string[] {
    const errors = this.validate(data);
    
    // Validaciones específicas de creación
    if (!data.codigo_cliente) {
      errors.push('El código del cliente es obligatorio');
    }
    if (!data.nombre) {
      errors.push('El nombre del cliente es obligatorio');
    }
    
    return errors;
  }

  // ============================================
  // MÉTODOS DE UTILIDAD
  // ============================================

  /**
   * Convierte el cliente a un objeto plano (para respuestas JSON)
   */
  toJSON(): ICliente {
    return {
      id: this.id,
      codigo_cliente: this.codigo_cliente,
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
    };
  }

  /**
   * Crea un cliente desde datos de entrada (sin ID)
   */
  static createFromDTO(data: ICreateClienteDTO): Omit<ICliente, 'id'> {
    return {
      codigo_cliente: data.codigo_cliente.trim().toUpperCase(),
      nombre: data.nombre.trim(),
      direccion: data.direccion?.trim() || null,
      telefono: data.telefono?.trim() || null,
    };
  }

  /**
   * Crea una instancia de Cliente desde una fila de PostgreSQL
   */
  static fromDatabase(row: any): Cliente {
    return new Cliente({
      id: row.id,
      codigo_cliente: row.codigo_cliente,
      nombre: row.nombre,
      direccion: row.direccion ?? null,
      telefono: row.telefono ?? null,
    });
  }

  /**
   * Genera un código de cliente (CLI-XXXX)
   */
  static generateCodigo(sequence: number): string {
    const padded = String(sequence).padStart(4, '0');
    return `CLI-${padded}`;
  }

  /**
   * Verifica si dos clientes son iguales (por ID)
   */
  equals(other: Cliente): boolean {
    return this.id === other.id;
  }
}