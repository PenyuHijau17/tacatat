"use client";

import { useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      window.location.href = "/login";
    }
  }, [session, isPending]);

  if (isPending) {
    return <main>Loading...</main>;
  }

  if (!session) {
    return null;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Selamat datang, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </main>
  );
}