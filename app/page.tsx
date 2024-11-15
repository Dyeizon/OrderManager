"use client"

import { SessionProvider } from "next-auth/react";
import Login from "./login/page";

export default function Home() {
  return (
    <SessionProvider>
      <Login/>
    </SessionProvider>
  );
}