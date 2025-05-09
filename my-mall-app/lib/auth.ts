// lib/auth.ts
export async function getUserFromDB(username: string, password: string) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    if (!res.ok) return null;
  
    return await res.json();
  }
  