import { pool } from '../config/database.js';
import { Cliente } from '../models/cliente.model.js';
import type { ICliente } from '../models/cliente.model.js';

export class ClienteRepository {
  /**
   * Obtener todos los clientes
   * @returns Lista de clientes
   */
  async obtenerTodos(): Promise<Cliente[]> {
    const result = await pool.query(
      'SELECT id, codigo_cliente, nombre, direccion, telefono FROM clientes ORDER BY id ASC'
    );
    return result.rows.map((row) => Cliente.fromDatabase(row));
  }

  /**
   * Crear un nuevo cliente
   * @param data - Datos del cliente (sin ID ni código)
   * @returns El cliente creado con ID y código asignado
   */
  async crear(data: Omit<ICliente, 'id' | 'codigo_cliente'>): Promise<Cliente> {
    // 1. Obtener el siguiente número de secuencia para el código
    const seqResult = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM clientes');
    const nextId = seqResult.rows[0]?.next_id || 1;
    const codigo = Cliente.generateCodigo(nextId);

    // 2. Insertar el cliente
    const result = await pool.query(
      `INSERT INTO clientes (codigo_cliente, nombre, direccion, telefono)
       VALUES ($1, $2, $3, $4)
       RETURNING id, codigo_cliente, nombre, direccion, telefono`,
      [codigo, data.nombre.trim(), data.direccion?.trim() || null, data.telefono?.trim() || null]
    );

    // 3. Devolver el cliente creado
    return Cliente.fromDatabase(result.rows[0]);
  }
}