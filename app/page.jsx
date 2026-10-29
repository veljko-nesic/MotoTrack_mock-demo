"use client";

import { AppProvider, useApp } from "@/components/state";
import { AuthScreen } from "@/components/auth-screen";
import { Shell } from "@/components/shell";
import { Boot } from "@/components/ui";

function Gate() {
  const { ready, user } = useApp();
  if (!ready) return <Boot />;
  if (!user) return <AuthScreen />;
  return <Shell />;
}

export default function Page() {
  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}
