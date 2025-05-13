import mysql from 'mysql2/promise';

const globalForMysql = globalThis as unknown as {
  pool: mysql.Pool | undefined;
};

const pool = globalForMysql.pool ?? mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

if (process.env.NODE_ENV !== 'production') globalForMysql.pool = pool;

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows as T;
  } finally {
    connection.release();
  }
}
