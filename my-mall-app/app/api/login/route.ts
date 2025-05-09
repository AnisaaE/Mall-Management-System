// app/api/users/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  // Примерна "база данни"
  const fakeDB = [
    { id: "1", email: "admin@example.com", password: "1234", role: "admin" },
    { id: "2", email: "manager@example.com", password: "5678", role: "manager" }
  ];

  const user = fakeDB.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role
  });
}
