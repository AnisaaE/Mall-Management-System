"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ 
  children,
  session // Добавяме session като prop
}: { 
  children: React.ReactNode;
  session?: any; // Можете да замените 'any' с правилния тип
}) {
  return (
    <SessionProvider session={session}> {/* Подаваме session на SessionProvider */}
      {children}
    </SessionProvider>
  );
}