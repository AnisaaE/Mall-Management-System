// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Просто използвай 'as any', ако искаш да избегнеш TypeScript грешките
  const user = session.user as any;

  return (
    <main>
      <h1>Welcome {user?.name || user?.username || 'Guest'}</h1>
    </main>
  );
}