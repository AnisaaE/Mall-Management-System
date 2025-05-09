'use client';
//we need this because the nav bar is not updating right after login
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.refresh(); // Принудително презареждане на рутера след успешен логин
    }
  }, [status, router]);

  return null;
}