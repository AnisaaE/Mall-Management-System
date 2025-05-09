// src/lib/db/connection.ts
import mysql from 'mysql2/promise';
import { cache } from 'react';

const createPool = cache(() => {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const pool = createPool();
  const [rows] = await pool.query(sql, params);
  return rows as T;
}