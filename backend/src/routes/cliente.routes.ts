import { Router, type Router as RouterType } from 'express';
import { clienteController } from '../controllers/cliente.controller.js';

const router: RouterType = Router();

router.get('/clientes', clienteController.getClientes.bind(clienteController));

router.post('/clientes', clienteController.createCliente.bind(clienteController));

export default router;
