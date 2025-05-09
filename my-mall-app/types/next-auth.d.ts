// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string | null;
      role?: string| null;
      id?: string;
    };
  }

  interface User {
    role?: stringstring| null;
    id?: string;
  }
}
