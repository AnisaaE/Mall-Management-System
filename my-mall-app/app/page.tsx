import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }
  const user = session.user as any;
  return (
    <main className="relative h-screen overflow-hidden">
  {/* Снимка на фон с по-интензивен оверлей */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/images/image.png"
      alt="Mall Management System Background"
      fill
      className="object-cover object-center"
      priority
      quality={100}
    />
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
  </div>

  {/* Съдържание с по-изчистен стил */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
        Welcome, <span className="text-blue-200">{user?.name || user?.username || 'Guest'}</span>
      </h1>
      <p className="text-xl md:text-2xl text-blue-100 font-light mb-6">
        Mall Management System
      </p>
      <div className="w-24 h-1 bg-blue-300 mx-auto my-6 rounded-full"></div>
      <p className="text-lg text-blue-50 opacity-90">
        Efficient management for modern shopping centers
      </p>
    </div>
  </div>
</main>
  );
}