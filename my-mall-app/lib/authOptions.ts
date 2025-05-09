// src/lib/auth/auth-config.ts
import { NextAuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';
import { hash, compare } from 'bcrypt';
import mysql from 'mysql2/promise';

// 1. DB връзка и помощни функции
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const [rows] = await pool.query(sql, params);
  return rows as T;
}

// 2. User related queries
const userQueries = {
  async findByUsername(username: string) {
    const [user] = await query<{
      id: number;
      username: string;
      password: string;
      role: string;
    }[]>("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    return user || null;
  },

  async verifyLogin(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) return null;

    const isValid = await compare(password, user.password);
    return isValid ? user : null;
  }
};

// 3. NextAuth конфигурация
export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const user = await userQueries.verifyLogin(
          credentials.username,
          credentials.password
        );
        
        return user ? {
          id: user.id.toString(),
          name: user.username,
          role: user.role
        } : null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Explicitly type the user object
        const typedUser = user as { role?: string };
        if (typedUser.role) {
          token.role = typedUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        // Safely assign the role with proper typing
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

// 4. Auth actions
export const authActions = {
  getCurrentUser: async () => {
    const session = await getServerSession(authOptions);
    return session?.user;
  },
  
  requireAdmin: async () => {
    const user = await authActions.getCurrentUser();
    if (user?.role !== 'admin') {
      redirect('/login');
    }
    return user;
  },

  createUser: async (data: { username: string; password: string; role: string }) => {
    const hashedPassword = await hash(data.password, 10);
    const { insertId } = await query<{ insertId: number }>(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [data.username, hashedPassword, data.role]
    );
    return insertId;
  }
};

// Типове за по-лесна употреба
export type AuthUser = {
  id: string;
  name: string;
  role: string;
};