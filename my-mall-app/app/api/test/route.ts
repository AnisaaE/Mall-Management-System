// src/lib/db/queries/auth/users.ts
import { query } from '@/lib/db/connection';
import { hash, compare } from 'bcrypt';


export  default async findByUsername() {
    const [user] = await query<{
      username: string;
      password: string;
      role: string;
    }[]>("SELECT * FROM user WHERE username = manager1 LIMIT 1", []);

    
    return user || null;
}