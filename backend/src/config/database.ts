import { Pool } from 'pg';
import type { PoolConfig } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Función auxiliar para acceder a variables de entorno
const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

// Configuración del pool de conexiones
const config: PoolConfig = {
  host: getEnv('DB_HOST', 'localhost'),
  port: parseInt(getEnv('DB_PORT', '5432')),
  user: getEnv('DB_USER', 'postgres'),
  password: getEnv('DB_PASSWORD', 'postgres'),
  database: getEnv('DB_NAME', 'clientes_db'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Crear el pool de conexiones
export const pool = new Pool(config);

// Función para probar la conexión
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as timestamp');
    client.release();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    console.log(`📅 Hora del servidor: ${result.rows[0]?.timestamp}`);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error);
    return false;
  }
}