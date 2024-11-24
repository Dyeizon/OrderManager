"use client"

import { SessionProvider } from "next-auth/react";
import { Header } from "../components/Header";

export default function CozinhaLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <SessionProvider>
        <Header/>
        <div className="w-11/12 m-auto">
          {children}
        </div>
      </SessionProvider>
    );
}