// src/lib/db/queries/auth/users.ts
import { query } from '../connection';
import { hash, compare } from 'bcrypt';

export const userQueries = {
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
  },

  async createUser(data: { username: string; password: string; role: string }) {
    const hashedPassword = await hash(data.password, 10);
    const { insertId } = await query<{ insertId: number }>(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [data.username, hashedPassword, data.role]
    );
    return insertId;
  }
};