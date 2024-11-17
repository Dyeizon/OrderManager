"use client"

import { SessionProvider } from "next-auth/react";
import { Header } from "../components/Header";
import ProtectPage from "../components/ProtectPage";

export default function CaixaLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <SessionProvider>
        <ProtectPage min={2}>
          <Header/>
          <div className="w-11/12 m-auto">
            {children}
          </div>
        </ProtectPage>
      </SessionProvider>
    );
  }
  