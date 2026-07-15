import type { Request, Response } from 'express';
import { ClienteRepository } from '../persistence/cliente.repository.js';
import { Cliente } from '../models/cliente.model.js';

const clienteRepository = new ClienteRepository();

export class ClienteController {

    async getClientes(_req: Request, res: Response): Promise<void> {
        try {
        const clientes = await clienteRepository.obtenerTodos();
        res.status(200).json({
            success: true,
            data: clientes.map((cliente) => cliente.toJSON()),
            count: clientes.length,
        });
        } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor al obtener los clientes',
        });
        }
    }


    async createCliente(req: Request, res: Response): Promise<void> {
        try {
        const { nombre, direccion, telefono } = req.body;

        if (!nombre) {
            res.status(400).json({
                success: false,
                error: 'El nombre del cliente es obligatorio',
            });
            return;
        }

        const validationErrors = Cliente.validate({
            nombre,
            direccion,
            telefono,
        });

        if (validationErrors.length > 0) {
            res.status(400).json({
                success: false,
                errors: validationErrors,
            });
            return;
        }

        const clienteData = {
            nombre,
            direccion: direccion || null,
            telefono: telefono || null,
        };

        const nuevoCliente = await clienteRepository.crear(clienteData);

        res.status(201).json({
            success: true,
            message: 'Cliente creado correctamente',
            data: nuevoCliente.toJSON(),
        });

        } catch (error: any) {
            console.error('Error al crear cliente:', error);

            if (error.code === '23505') {
                res.status(409).json({
                    success: false,
                    error: 'El código del cliente ya existe. Intente nuevamente.',
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: 'Error interno del servidor al crear el cliente',
            });
        }
    }
}

// Exportar una instancia única del controlador
export const clienteController = new ClienteController();