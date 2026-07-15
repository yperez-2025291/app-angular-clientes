import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar configuraciones de base de datos
import { testDatabaseConnection } from './config/database.js';

// Importar rutas de clientes
import clienteRoutes from './routes/cliente.routes.js';

// Cargar variables de entorno
dotenv.config();

// Función auxiliar para acceder a variables de entorno
const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

// Inicializar Express
const app: Express = express();
const PORT = parseInt(getEnv('PORT', '3000'));

// ============ MIDDLEWARES ============

// CORS
app.use(cors({
  origin: getEnv('CORS_ORIGIN', 'http://localhost:4200'),
  credentials: true,
}));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ RUTAS ============

// Health check (público)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'backend-clientes',
  });
});

// Ruta de prueba de base de datos (público)
app.get('/api/db-test', async (_req: Request, res: Response) => {
  try {
    const { pool } = await import('./config/database.js');
    const result = await pool.query('SELECT NOW() as timestamp');
    res.json({
      success: true,
      timestamp: result.rows[0]?.timestamp,
      message: 'Conexión a PostgreSQL exitosa',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al conectar a la base de datos',
    });
  }
});

// ============ RUTAS DE CLIENTES ============
// Montar las rutas de clientes bajo /api
app.use('/api', clienteRoutes);

// ============ MANEJO DE ERRORES ============

// Ruta no encontrada (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  });
});

// ============ INICIO DEL SERVIDOR ============

async function startServer() {
  // Probar conexión a la base de datos
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.warn('⚠️  La base de datos no está disponible. Algunas funcionalidades pueden fallar.');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🗄️  DB Test: http://localhost:${PORT}/api/db-test`);
    console.log(`📋 Clientes API: http://localhost:${PORT}/api/clientes\n`);
  });
}

startServer();

export default app;