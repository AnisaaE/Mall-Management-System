// src/lib/auth/auth-config.ts
import { NextAuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';
import { hash, compare } from 'bcrypt';
import { query } from "@/lib/db/connection";
import { userQueries } from "@/lib/db/queries/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.JWT_SECRET,
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
        //in session by default we get only user id and name if there is one 
        return user ? {
          name: user.username,
          role: user.role
        } : null;
      }
    })
  ],
  callbacks: {

// слагаме допълнителни данни в токена, например роля, защото до сега в нашата сесия се пазаят сid and name
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
  name: string;
  role: string;
};